import { realpath, stat } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, sep } from 'node:path';

import type { Failure, Scope } from '../shared/types.ts';
import { run, stderrTail } from './run.ts';

export const under = (path: string, dir: string): boolean => path === dir || path.startsWith(dir.endsWith(sep) ? dir : dir + sep);

export const tilde = (path: string, home: string): string => (home && under(path, home) ? '~' + path.slice(home.length) : path);

/** Files that make a folder a mise project root of its own. */
export const MISE_CONFIG_FILES = [
  'mise.toml', '.mise.toml', 'mise.local.toml', '.mise.local.toml',
  'mise/config.toml', '.mise/config.toml', '.config/mise.toml', '.config/mise/config.toml',
];

const hasMiseConfig = async (dir: string): Promise<boolean> => {
  for (const name of MISE_CONFIG_FILES) {
    try { if ((await stat(join(dir, name))).isFile()) return true; } catch { /* next */ }
  }
  return false;
};

/**
 * Root for a folder outside git: the highest folder from `directory` up to,
 * but not including, the home folder that has its own mise config. Only
 * folders inside home qualify, and never home itself or ~/.config or
 * ~/Library, whose configs are global.
 */
export const findMiseProject = async (directory: string, home: string): Promise<string | null> => {
  if (!home || directory === home || !under(directory, home)) return null;
  if (under(directory, join(home, '.config')) || under(directory, join(home, 'Library'))) return null;
  let found: string | null = null;
  for (let dir = directory; dir !== home && under(dir, home); dir = dirname(dir)) {
    if (await hasMiseConfig(dir)) found = dir;
  }
  return found;
};

export type GitEnv = { git: string; env: Record<string, string>; home: string };

const fail = (code: Failure['error']['code'], message: string): { ok: false; failure: Failure } => ({ ok: false, failure: { error: { code, message } } });

/**
 * Turns the directory the frame reports into an approved scope, or refuses it.
 * Approved means: an absolute path that resolves to an existing directory inside
 * a git working tree (the main checkout or a linked worktree), not inside .git.
 * Symlinks are resolved first, so the pin namespace is the canonical path and a
 * sibling worktree is never collapsed into its main checkout.
 */
export const resolveScope = async (input: unknown, ctx: GitEnv): Promise<{ ok: true; scope: Scope } | { ok: false; failure: Failure }> => {
  if (typeof input !== 'string' || input.length === 0 || input.length > 4096 || input.includes('\0')) {
    return fail('bad-request', 'No directory was given.');
  }
  if (!isAbsolute(input)) return fail('invalid-scope', 'The directory must be an absolute path.');

  let directory: string;
  try {
    directory = await realpath(input);
    if (!(await stat(directory)).isDirectory()) return fail('invalid-scope', 'That path is not a directory.');
  } catch {
    return fail('invalid-scope', 'That directory does not exist on the OpenChamber server.');
  }
  if (directory.split(sep).includes('.git')) return fail('invalid-scope', 'That directory is inside a .git folder.');

  const gitOptions = { cwd: directory, env: ctx.env, timeoutMs: 5_000, maxBytes: 64 * 1024 };
  const parsed = await run(ctx.git, ['rev-parse', '--path-format=absolute', '--show-toplevel', '--git-dir', '--git-common-dir'], gitOptions);
  if (parsed.spawnError) return fail('no-git', `git could not be started: ${parsed.spawnError}`);
  if (parsed.timedOut) return fail('invalid-scope', 'git did not answer in time for this directory.');
  if (parsed.code !== 0) {
    const tail = stderrTail(parsed.stderr) ?? '';
    if (!/not a git repository/i.test(tail)) return fail('invalid-scope', `git could not read this directory: ${tail || `exit ${parsed.code}`}`);
    const project = await findMiseProject(directory, ctx.home);
    if (!project) {
      return fail('invalid-scope', 'This directory is not in a git checkout and no folder above it (inside your home folder) has its own mise config, so mise inspection is off here.');
    }
    return {
      ok: true,
      scope: { kind: 'mise', directory, root: project, name: basename(project) || project, branch: null, linkedWorktree: false, label: tilde(directory, ctx.home) },
    };
  }
  const [top = '', gitDir = '', commonDir = ''] = parsed.stdout.split('\n').map((line) => line.trim());
  if (!top) return fail('invalid-scope', 'This directory is a bare repository or has no working tree.');

  const root = await realpath(top).catch(() => top);
  if (!under(directory, root)) return fail('invalid-scope', 'The directory resolves outside its git checkout.');
  const [gitReal, commonReal] = await Promise.all([realpath(gitDir).catch(() => gitDir), realpath(commonDir).catch(() => commonDir)]);

  let branch: string | null = null;
  const head = await run(ctx.git, ['symbolic-ref', '--short', '-q', 'HEAD'], gitOptions);
  if (head.code === 0 && head.stdout.trim()) branch = head.stdout.trim();
  else {
    const sha = await run(ctx.git, ['rev-parse', '--short', 'HEAD'], gitOptions);
    if (sha.code === 0 && sha.stdout.trim()) branch = `detached @ ${sha.stdout.trim()}`;
  }

  return {
    ok: true,
    scope: {
      kind: 'git',
      directory,
      root,
      name: basename(root) || root,
      branch,
      linkedWorktree: gitReal !== commonReal,
      label: tilde(directory, ctx.home),
    },
  };
};
