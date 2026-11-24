import type { Inspection, MiseInfo, Part, Scope, Section, SectionError } from '../shared/types.ts';
import { normalizeConfigs, normalizeTasks, normalizeTools, parseTrust, type Where } from './normalize.ts';
import { run, stderrTail, type RunResult } from './run.ts';

export const MISE_TIMEOUT_MS = 8_000;
export const MISE_MAX_BYTES = 4 * 1024 * 1024;

/** The fixed read operations. Nothing else is ever passed to mise. */
export const OPERATIONS = {
  tasks: ['tasks', 'ls', '--json'],
  tools: ['ls', '--current', '--json'],
  configs: ['config', 'ls', '--json'],
  trust: ['trust', '--show'],
} as const satisfies Record<string, readonly string[]>;

/**
 * The whole environment mise gets. Built from scratch so CI, MISE_YES,
 * MISE_TRUSTED_CONFIG_PATHS or anything else in the host's environment can't
 * loosen trust. MISE_SAFE=1 makes project config load without running code;
 * the auto-install switches are defense in depth, not a sandbox.
 */
export const miseEnv = (base: NodeJS.ProcessEnv): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const key of ['PATH', 'HOME', 'TMPDIR', 'TMP', 'TEMP', 'LANG', 'LC_ALL', 'LC_CTYPE', 'USER', 'LOGNAME']) {
    const value = base[key];
    if (typeof value === 'string' && value !== '') env[key] = value;
  }
  return {
    ...env,
    MISE_SAFE: '1',
    MISE_AUTO_INSTALL: '0',
    MISE_NOT_FOUND_AUTO_INSTALL: '0',
    MISE_EXEC_AUTO_INSTALL: '0',
    MISE_TASK_RUN_AUTO_INSTALL: '0',
    MISE_YES: '0',
    NO_COLOR: '1',
  };
};

/** Small FIFO limiter so a burst of directory switches can't fork-bomb the host. */
export class Limiter {
  private active = 0;
  private readonly queue: Array<() => void> = [];
  constructor(private readonly max: number, private readonly maxQueue: number) {}
  get saturated(): boolean { return this.queue.length >= this.maxQueue; }
  async use<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) await new Promise<void>((resolve) => this.queue.push(resolve));
    this.active++;
    try { return await task(); } finally {
      this.active--;
      this.queue.shift()?.();
    }
  }
}

const sectionError = (code: SectionError['code'], message: string, result?: RunResult): SectionError => ({
  code,
  message,
  detail: result ? stderrTail(result.stderr) : null,
});

/** Maps a finished mise run onto a clear section failure, or null when it succeeded. */
export const classify = (result: RunResult): SectionError | null => {
  if (result.timedOut) return sectionError('timeout', `mise did not finish within ${MISE_TIMEOUT_MS / 1000}s and was stopped.`, result);
  if (result.overflow) return sectionError('output-too-large', `mise printed more than ${MISE_MAX_BYTES / 1024 / 1024} MB and was stopped.`, result);
  if (result.spawnError) return sectionError('mise-failed', `mise could not be started: ${result.spawnError}`);
  if (result.code === 0) return null;
  const err = result.stderr;
  if (/disabled in safe mode/i.test(err)) {
    return sectionError('safe-mode-refused',
      'Safe mode refused part of this config (a template calls exec() or reads files), so mise stopped. Nothing was run, and the inspector does not retry outside safe mode.',
      result);
  }
  if (/are not trusted/i.test(err)) return sectionError('untrusted', 'mise refused an untrusted config even in safe mode.', result);
  if (/error parsing config file/i.test(err)) return sectionError('parse-error', 'mise could not parse a config file.', result);
  return sectionError('mise-failed', `mise exited with code ${result.code}.`, result);
};

const parse = <T>(result: RunResult, map: (raw: unknown) => T): Section<T> => {
  const failure = classify(result);
  if (failure) return { ok: false, error: failure };
  let raw: unknown;
  try { raw = JSON.parse(result.stdout || 'null'); } catch {
    return { ok: false, error: sectionError('bad-json', 'mise answered with output that is not JSON.', result) };
  }
  try { return { ok: true, data: map(raw) }; } catch (error) {
    return { ok: false, error: sectionError('bad-json', String((error as Error).message ?? error), result) };
  }
};

export type InspectContext = { mise: MiseInfo; env: Record<string, string>; home: string; limiter: Limiter };

export const inspect = async (scope: Scope, parts: Part[], ctx: InspectContext): Promise<Inspection> => {
  const started = performance.now();
  const options = { cwd: scope.directory, env: ctx.env, timeoutMs: MISE_TIMEOUT_MS, maxBytes: MISE_MAX_BYTES };
  const call = (args: readonly string[]) => ctx.limiter.use(() => run(ctx.mise.path, [...args], options));
  const where: Where = { home: ctx.home, root: scope.root, directory: scope.directory };

  const want = new Set(parts);
  const [tasks, tools, configs, trust] = await Promise.all([
    want.has('tasks') ? call(OPERATIONS.tasks) : null,
    want.has('tools') ? call(OPERATIONS.tools) : null,
    want.has('configs') ? call(OPERATIONS.configs) : null,
    want.has('configs') ? call(OPERATIONS.trust) : null,
  ]);

  // Trust is decoration: when it fails, configs still show, with trust unknown.
  const trustMap = trust && trust.code === 0 && !trust.timedOut && !trust.overflow ? parseTrust(trust.stdout, ctx.home) : null;

  const inspection: Inspection = { scope, mise: ctx.mise, elapsedMs: 0 };
  if (tasks) inspection.tasks = parse(tasks, (raw) => normalizeTasks(raw, where));
  if (tools) inspection.tools = parse(tools, (raw) => normalizeTools(raw, where));
  if (configs) inspection.configs = parse(configs, (raw) => normalizeConfigs(raw, trustMap, where));
  inspection.elapsedMs = Math.round(performance.now() - started);
  return inspection;
};

/** `mise --version` once per binary; the version is informational only. */
export const readVersion = async (path: string, env: Record<string, string>, home: string): Promise<string | null> => {
  const result = await run(path, ['--version'], { cwd: home || '/', env, timeoutMs: 4_000, maxBytes: 64 * 1024 });
  if (result.code !== 0) return null;
  return /\d{4}\.\d+\.\d+/.exec(result.stdout)?.[0] ?? (result.stdout.trim().split(/\s+/)[0] || null);
};
