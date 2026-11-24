import { spawn } from 'node:child_process';

export type RunResult = {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  overflow: boolean;
  /** Set when the program could not be started at all (ENOENT, EACCES). */
  spawnError: string | null;
};

export type RunOptions = {
  cwd: string;
  env: Record<string, string>;
  timeoutMs: number;
  maxBytes: number;
};

/**
 * Runs one program with an argv (never a shell), no stdin, a wall-clock limit
 * and an output cap. Over either limit the process is killed and the result
 * says why; partial output is never handed on as if it were complete.
 */
export const run = (file: string, args: string[], options: RunOptions): Promise<RunResult> => new Promise((resolve) => {
  let stdout = '';
  let stderr = '';
  let bytes = 0;
  let timedOut = false;
  let overflow = false;
  let settled = false;

  let child: ReturnType<typeof spawn>;
  try {
    child = spawn(file, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsHide: true,
    });
  } catch (error) {
    resolve({ code: null, stdout: '', stderr: '', timedOut: false, overflow: false, spawnError: String((error as Error).message ?? error) });
    return;
  }

  const finish = (result: Omit<RunResult, 'stdout' | 'stderr'>) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    resolve({ ...result, stdout, stderr });
  };

  const kill = () => {
    child.kill('SIGTERM');
    setTimeout(() => { if (child.exitCode === null) child.kill('SIGKILL'); }, 500).unref();
  };

  const timer = setTimeout(() => { timedOut = true; kill(); }, options.timeoutMs);

  const take = (chunk: Buffer, into: 'stdout' | 'stderr') => {
    bytes += chunk.length;
    if (bytes > options.maxBytes) {
      if (!overflow) { overflow = true; kill(); }
      return;
    }
    if (into === 'stdout') stdout += chunk.toString('utf8');
    else stderr += chunk.toString('utf8');
  };
  child.stdout?.on('data', (chunk: Buffer) => take(chunk, 'stdout'));
  child.stderr?.on('data', (chunk: Buffer) => take(chunk, 'stderr'));

  child.on('error', (error) => finish({ code: null, timedOut, overflow, spawnError: error.message }));
  child.on('close', (code) => finish({ code, timedOut, overflow, spawnError: null }));
});

// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]/g;

/** The meaningful tail of stderr: no ANSI, no code-frame gutter, no version boilerplate. */
export const stderrTail = (stderr: string, lines = 4): string | null => {
  const kept = stderr
    .replace(ANSI, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== '')
    .filter((line) => !/^\s*(\||-->|\d+\s*\|)/.test(line))
    .filter((line) => !/mise (ERROR|WARN) (Version:|Run with --verbose)/.test(line))
    .filter((line) => !/mise WARN\s+(mise version .* available|self-update is disabled)/.test(line))
    .map((line) => line.replace(/^mise (ERROR|WARN)\s+/, ''));
  if (!kept.length) return null;
  return kept.slice(-lines).join('\n').slice(0, 1200);
};
