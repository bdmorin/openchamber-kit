import { accessSync, constants, statSync } from 'node:fs';
import { delimiter, isAbsolute, join } from 'node:path';

export type Found = { path: string; via: 'PATH' | 'fallback' };

const executable = (file: string): boolean => {
  try {
    if (!statSync(file).isFile()) return false;
    accessSync(file, constants.X_OK);
    return true;
  } catch {
    return false;
  }
};

/** PATH entries the service inherited, in order, absolute only. */
export const pathEntries = (env: NodeJS.ProcessEnv): string[] => (env.PATH ?? '')
  .split(delimiter)
  .filter((entry) => entry !== '' && isAbsolute(entry));

/**
 * Where mise usually lives when the service's PATH is the minimal one a GUI
 * app gets on macOS. These are only tried after PATH, and the UI says when
 * one of them was used.
 */
export const fallbackCandidates = (home: string): string[] => [
  '/opt/homebrew/bin/mise',
  '/usr/local/bin/mise',
  join(home, '.local/bin/mise'),
  join(home, '.local/share/mise/bin/mise'),
  join(home, '.cargo/bin/mise'),
  '/usr/bin/mise',
];

export const findProgram = (name: string, env: NodeJS.ProcessEnv, fallbacks: string[] = []): { found: Found | null; searched: string[] } => {
  const searched: string[] = [];
  for (const dir of pathEntries(env)) {
    const candidate = join(dir, name);
    searched.push(candidate);
    if (executable(candidate)) return { found: { path: candidate, via: 'PATH' }, searched };
  }
  for (const candidate of fallbacks) {
    if (searched.includes(candidate)) continue;
    searched.push(candidate);
    if (executable(candidate)) return { found: { path: candidate, via: 'fallback' }, searched };
  }
  return { found: null, searched };
};
