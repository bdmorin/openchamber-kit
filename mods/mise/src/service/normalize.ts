// mise JSON -> the wire types in shared/types.ts. Pure functions, tested
// against captured mise output. Anything not listed here is dropped on
// purpose: task `env`, `secrets`, tool install paths and every env value.
import { join, relative, sep } from 'node:path';

import type { ConfigFile, Source, SourceKind, Task, Tool, TrustState } from '../shared/types.ts';
import { tilde, under } from './scope.ts';

export type Where = { home: string; root: string; directory: string };

const CONFIG_PARTS = new Set(['.config', 'mise', '.mise', 'conf.d', 'tasks']);
const RUN_LINES_MAX = 40;
const RUN_LINE_CHARS = 400;
const TEXT_MAX = 600;

const text = (value: unknown, max = TEXT_MAX): string => (typeof value === 'string' ? value.slice(0, max) : '');
const strings = (value: unknown, max = 50): string[] => (Array.isArray(value) ? value : [])
  .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
  .filter((item): item is string => typeof item === 'string' && item !== '')
  .slice(0, max)
  .map((item) => item.slice(0, 200));

/** The folder a config file belongs to: ~/x/.config/mise/config.toml -> ~/x. */
export const configDir = (path: string): string => {
  const parts = path.split(sep);
  parts.pop();
  while (parts.length > 1 && CONFIG_PARTS.has(parts[parts.length - 1] ?? '')) parts.pop();
  return parts.join(sep) || sep;
};

export const kindOf = (path: string | null, where: Where): SourceKind => {
  if (!path) return 'computed';
  const dir = configDir(path);
  if (under(path, join(where.home, '.config', 'mise')) || under(path, '/etc/mise') || dir === where.home) return 'global';
  if (dir === where.root) return 'root';
  if (under(dir, where.root)) return 'local';
  if (under(where.root, dir)) return 'parent';
  return 'other';
};

export const sourceOf = (path: unknown, where: Where): Source => {
  const value = typeof path === 'string' && path !== '' ? path : null;
  if (!value) return { kind: 'computed', path: null, label: null };
  const label = under(value, where.root) && value !== where.root ? relative(where.root, value) : tilde(value, where.home);
  return { kind: kindOf(value, where), path: value, label };
};

const KIND_ORDER: Record<SourceKind, number> = { global: 0, parent: 1, other: 2, root: 3, local: 4, computed: 5 };

const runLines = (value: unknown): { run: string[]; truncated: boolean } => {
  const entries = (Array.isArray(value) ? value : [])
    .slice(0, 200)
    .map((item) => (typeof item === 'string' ? item.slice(0, 64_000) : JSON.stringify(item) ?? ''));
  const lines = entries.flatMap((entry) => entry.split('\n'));
  const run = lines.slice(0, RUN_LINES_MAX).map((line) => line.slice(0, RUN_LINE_CHARS));
  const truncated = lines.length > RUN_LINES_MAX || lines.some((line) => line.length > RUN_LINE_CHARS);
  return { run, truncated };
};

export const normalizeTasks = (raw: unknown, where: Where): Task[] => {
  if (!Array.isArray(raw)) throw new Error('mise tasks ls did not return a list');
  return raw
    .filter((task): task is Record<string, unknown> => typeof task === 'object' && task !== null && typeof (task as { name?: unknown }).name === 'string')
    .slice(0, 500)
    .map((task) => {
      // `run` in tasks ls can hold full script text; keep it bounded.
      const { run, truncated } = runLines(task.run);
      const dir = typeof task.dir === 'string' && task.dir !== '' ? task.dir : null;
      return {
        name: text(task.name, 200),
        aliases: strings(task.aliases, 20),
        description: text(task.description),
        source: sourceOf(task.source, where),
        dir: dir ? (under(dir, where.root) ? (relative(where.root, dir) || '.') : tilde(dir, where.home)) : null,
        run,
        runTruncated: truncated,
        depends: strings(task.depends, 30),
        hidden: task.hide === true,
        file: typeof task.file === 'string' && task.file !== '',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const normalizeTools = (raw: unknown, where: Where): Tool[] => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('mise ls did not return an object');
  const tools: Tool[] = [];
  for (const [name, list] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(list)) continue;
    for (const entry of list.slice(0, 20)) {
      if (typeof entry !== 'object' || entry === null) continue;
      const item = entry as Record<string, unknown>;
      const source = item.source as { path?: unknown } | undefined;
      tools.push({
        name: name.slice(0, 200),
        version: text(item.version, 100) || '?',
        requested: typeof item.requested_version === 'string' ? item.requested_version.slice(0, 100) : null,
        installed: item.installed === true,
        active: item.active === true,
        source: sourceOf(source?.path, where),
      });
    }
  }
  return tools.slice(0, 300).sort((a, b) => a.name.localeCompare(b.name));
};

/** Parses `mise trust --show`: one `<dir>: <state>` line per config root from here up. */
export const parseTrust = (stdout: string, home: string): Map<string, TrustState> => {
  const states = new Map<string, TrustState>();
  for (const line of stdout.split('\n')) {
    const match = /^(.*):\s+(trusted|untrusted|ignored)\s*$/.exec(line.trim());
    if (!match?.[1] || !match[2]) continue;
    const dir = match[1] === '~' ? home : match[1].startsWith('~/') ? join(home, match[1].slice(2)) : match[1];
    states.set(dir, match[2] as TrustState);
  }
  return states;
};

export const normalizeConfigs = (raw: unknown, trust: Map<string, TrustState> | null, where: Where): ConfigFile[] => {
  if (!Array.isArray(raw)) throw new Error('mise config ls did not return a list');
  return raw
    .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null && typeof (entry as { path?: unknown }).path === 'string')
    .slice(0, 100)
    .map((entry, index) => {
      const source = sourceOf(entry.path, where);
      let state: TrustState = 'unknown';
      if (source.kind === 'global') state = 'trusted';
      else if (trust && source.path) state = trust.get(configDir(source.path)) ?? 'unknown';
      return { file: { source, tools: strings(entry.tools, 50), trust: state }, index };
    })
    // Load order for display: global first, the checkout's own files last.
    .sort((a, b) => KIND_ORDER[a.file.source.kind] - KIND_ORDER[b.file.source.kind] || b.index - a.index)
    .map(({ file }) => file);
};
