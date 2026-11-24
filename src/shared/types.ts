// The wire contract between the service and both frames. The service owns
// normalization: frames never see raw mise output, task env, or secrets.

/** Where a config file sits relative to the inspected checkout. */
export type SourceKind = 'global' | 'parent' | 'root' | 'local' | 'other' | 'computed';

export type Source = {
  kind: SourceKind;
  /** Absolute path, or null for values mise computed itself. */
  path: string | null;
  /** Path for display: relative to the checkout root, else ~-relative. */
  label: string | null;
};

export type Task = {
  name: string;
  aliases: string[];
  description: string;
  source: Source;
  /** Working directory label, or null for the config root. */
  dir: string | null;
  /** Script lines; empty for file tasks. Capped in length and count. */
  run: string[];
  runTruncated: boolean;
  depends: string[];
  hidden: boolean;
  /** True when the task is a standalone script file. */
  file: boolean;
};

export type Tool = {
  name: string;
  version: string;
  requested: string | null;
  installed: boolean;
  active: boolean;
  source: Source;
};

export type TrustState = 'trusted' | 'untrusted' | 'ignored' | 'unknown';

export type ConfigFile = {
  source: Source;
  tools: string[];
  /** Trust of the config root this file belongs to, from `mise trust --show`. */
  trust: TrustState;
};

export type SectionError = {
  code: 'safe-mode-refused' | 'untrusted' | 'parse-error' | 'timeout' | 'output-too-large' | 'bad-json' | 'mise-failed';
  message: string;
  /** Last few stderr lines, already free of ANSI escapes. */
  detail: string | null;
};

export type Section<T> = { ok: true; data: T } | { ok: false; error: SectionError };

export type Scope = {
  /** git: inside a git working tree. mise: a non-git folder whose root has its own mise config. */
  kind: 'git' | 'mise';
  /** Canonical inspected directory; the pin namespace. */
  directory: string;
  /** Canonical top level of the git checkout, or the mise project folder. */
  root: string;
  name: string;
  branch: string | null;
  /** A linked worktree rather than the main checkout. */
  linkedWorktree: boolean;
  /** Display form of `directory`. */
  label: string;
};

export type MiseInfo = {
  path: string;
  via: 'PATH' | 'fallback';
  version: string | null;
};

export type Part = 'tasks' | 'tools' | 'configs';
export const PARTS: readonly Part[] = ['tasks', 'tools', 'configs'];

export type Inspection = {
  scope: Scope;
  mise: MiseInfo;
  tasks?: Section<Task[]>;
  tools?: Section<Tool[]>;
  configs?: Section<ConfigFile[]>;
  elapsedMs: number;
};

export type FailureCode = 'unauthorized' | 'not-found' | 'bad-request' | 'invalid-scope' | 'no-git' | 'no-mise' | 'busy';

export type Failure = { error: { code: FailureCode; message: string; searched?: string[] } };

/** Pins for one checkout, stored in extension storage. Names only. */
export type PinRecord = { v: 1; directory: string; tasks: string[] };
