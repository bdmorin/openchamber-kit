// Runs the real service code against real mise on disposable fixtures.
// Every fixture plants commands that would create a marker file if mise ran
// them; the inspection must leave the marker directory empty.
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { fallbackCandidates, findProgram } from '../src/service/discover.ts';
import { Limiter, inspect, miseEnv, readVersion } from '../src/service/inspect.ts';
import { resolveScope } from '../src/service/scope.ts';

const home = process.env.HOME ?? '';
const mise = findProgram('mise', process.env, fallbackCandidates(home)).found;
const git = findProgram('git', process.env, ['/usr/bin/git']).found;
const env = miseEnv(process.env);
const gitEnv = { PATH: env.PATH ?? '/usr/bin:/bin', HOME: home, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' };

const base = realpathSync(mkdtempSync(join(tmpdir(), 'oc-mise-test-')));
const markers = join(base, 'markers');
const trusted: string[] = [];

const sh = (cwd: string, ...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd, stdio: 'pipe' });

/** A checkout whose config tries every way of running code during a read. */
const hostile = (name: string, extraTasks = '') => {
  const dir = join(base, name);
  mkdirSync(join(dir, '.mise/tasks'), { recursive: true });
  mkdirSync(join(dir, 'bin'), { recursive: true });
  const m = (tag: string) => join(markers, `${name}-${tag}`);
  writeFileSync(join(dir, 'evil.sh'), `touch ${m('source-sh')}\n`);
  writeFileSync(join(dir, 'mise.toml'), `
[tools]
jq = "1.7.1"
node = { version = "22", postinstall = "touch ${m('postinstall')}" }
local-thing = "path:${join(dir, 'bin')}"

[env]
FROM_EXEC = "{{ exec(command='touch ${m('env-exec')} && echo x') }}"
_.source = "${join(dir, 'evil.sh')}"
PLAIN = "plain-value-should-never-be-read"

[vars]
V = "{{ exec(command='touch ${m('vars-exec')} && echo y') }}"

[hooks]
enter = "touch ${m('hook-enter')}"
cd = "touch ${m('hook-cd')}"

[tasks.build]
description = "Build it"
run = "touch ${m('task-run')}"

[tasks.lint]
description = "Lint"
run = ["echo lint"]
depends = ["build"]
alias = "l"
${extraTasks}
`);
  writeFileSync(join(dir, '.mise/tasks/deploy'), `#!/usr/bin/env bash\n#MISE description="Deploy"\ntouch ${m('file-task')}\n`, { mode: 0o755 });
  sh(dir, 'init', '-q');
  sh(dir, 'add', '-A');
  sh(dir, 'commit', '-q', '-m', 'init');
  return dir;
};

const ctx = async () => ({
  mise: { path: mise!.path, via: mise!.via, version: await readVersion(mise!.path, env, home) },
  env,
  home,
  limiter: new Limiter(4, 24),
});
const scopeOf = async (dir: string) => {
  const result = await resolveScope(dir, { git: git!.path, env: gitEnv, home });
  if (!result.ok) throw new Error(result.failure.error.message);
  return result.scope;
};

const ready = Boolean(mise && git);

beforeAll(() => { mkdirSync(markers, { recursive: true }); });
afterAll(() => {
  for (const dir of trusted) {
    try { execFileSync(mise!.path, ['trust', '--untrust', dir], { stdio: 'pipe', env: { ...env, MISE_SAFE: '0' } }); } catch { /* best effort */ }
  }
  rmSync(base, { recursive: true, force: true });
});

describe.skipIf(!ready)('safe discovery against real mise', () => {
  test('an untrusted checkout is listed and nothing runs', async () => {
    const dir = hostile('untrusted');
    const result = await inspect(await scopeOf(dir), ['tasks', 'tools', 'configs'], await ctx());
    expect(result.tasks?.ok).toBe(true);
    if (result.tasks?.ok) expect(result.tasks.data.map((task) => task.name)).toEqual(['build', 'deploy', 'lint']);
    expect(result.tools?.ok).toBe(true);
    if (result.tools?.ok) expect(result.tools.data.map((tool) => tool.name)).not.toContain('local-thing');
    expect(result.configs?.ok).toBe(true);
    if (result.configs?.ok) {
      const own = result.configs.data.find((config) => config.source.kind === 'root');
      expect(own?.trust).toBe('untrusted');
    }
    expect(JSON.stringify(result)).not.toContain('plain-value-should-never-be-read');
    expect(readdirSync(markers)).toEqual([]);
  }, 30_000);

  test('a trusted checkout is still read in safe mode, and nothing runs', async () => {
    const dir = hostile('trusted');
    execFileSync(mise!.path, ['trust', join(dir, 'mise.toml')], { stdio: 'pipe', env: { ...env, MISE_SAFE: '0' } });
    trusted.push(dir);
    const result = await inspect(await scopeOf(dir), ['tasks', 'tools', 'configs'], await ctx());
    expect(result.tasks?.ok).toBe(true);
    if (result.configs?.ok) expect(result.configs.data.find((config) => config.source.kind === 'root')?.trust).toBe('trusted');
    expect(readdirSync(markers)).toEqual([]);
  }, 30_000);

  test('a template that needs exec() fails the section clearly instead of running', async () => {
    const dir = hostile('refused', `
[tasks.sneaky]
description = "{{ exec(command='touch ${join(markers, 'refused-description-exec')} && echo z') }}"
run = "echo hi"
`);
    const result = await inspect(await scopeOf(dir), ['tasks', 'tools'], await ctx());
    expect(result.tasks?.ok).toBe(false);
    if (result.tasks && !result.tasks.ok) {
      expect(result.tasks.error.code).toBe('safe-mode-refused');
      expect(result.tasks.error.detail).toContain('disabled in safe mode');
    }
    expect(readdirSync(markers)).toEqual([]);
  }, 30_000);

  test('linked worktrees are separate scopes with their own tasks', async () => {
    const main = hostile('wt-main');
    const linked = join(base, 'wt-linked');
    sh(main, 'worktree', 'add', '-q', '-b', 'feature', linked);
    writeFileSync(join(linked, 'mise.toml'), '[tasks.only-in-feature]\nrun = "echo feature"\n');
    const [a, b] = await Promise.all([scopeOf(main), scopeOf(linked)]);
    expect(a.directory).not.toBe(b.directory);
    expect(a.linkedWorktree).toBe(false);
    expect(b.linkedWorktree).toBe(true);
    expect(b.branch).toBe('feature');
    const [ra, rb] = await Promise.all([inspect(a, ['tasks'], await ctx()), inspect(b, ['tasks'], await ctx())]);
    const names = (r: typeof ra) => (r.tasks?.ok ? r.tasks.data.map((task) => task.name) : []);
    expect(names(ra)).toContain('build');
    // The committed file task comes along; the edited mise.toml replaced the rest.
    expect(names(rb)).toEqual(['deploy', 'only-in-feature']);
    expect(names(ra)).not.toContain('only-in-feature');
    expect(readdirSync(markers)).toEqual([]);
  }, 30_000);
});

describe.skipIf(!ready)('mise projects outside git', () => {
  // A fake home holding a container folder like ~/src/workspace: mise config, no .git,
  // with a git repo inside it.
  const fakeHome = join(base, 'home');
  const container = join(fakeHome, 'src', 'workspace');
  const scopeIn = (dir: string) => resolveScope(dir, { git: git!.path, env: gitEnv, home: fakeHome });

  beforeAll(() => {
    mkdirSync(join(container, 'notes', 'deep'), { recursive: true });
    writeFileSync(join(container, 'mise.toml'), '[tasks.status]\ndescription = "Report status"\nrun = "echo up"\n');
    writeFileSync(join(container, '.mise.local.toml'), '[tasks.local-only]\nrun = "echo local"\n');
    mkdirSync(join(container, 'repo'), { recursive: true });
    sh(join(container, 'repo'), 'init', '-q');
    mkdirSync(join(fakeHome, 'src', 'bare'), { recursive: true });
  });

  test('a container folder with mise config is its own root', async () => {
    const result = await scopeIn(container);
    expect(result).toMatchObject({ ok: true, scope: { kind: 'mise', root: container, directory: container, name: 'workspace', branch: null } });
  });

  test('a plain subfolder inspects with the container as root', async () => {
    const result = await scopeIn(join(container, 'notes', 'deep'));
    expect(result).toMatchObject({ ok: true, scope: { kind: 'mise', root: container, directory: join(container, 'notes', 'deep') } });
  });

  test('a git repo inside the container is still a git scope', async () => {
    const result = await scopeIn(join(container, 'repo'));
    expect(result).toMatchObject({ ok: true, scope: { kind: 'git', root: join(container, 'repo') } });
  });

  test('home itself and folders without mise config are refused', async () => {
    expect(await scopeIn(fakeHome)).toMatchObject({ ok: false, failure: { error: { code: 'invalid-scope' } } });
    expect(await scopeIn(join(fakeHome, 'src', 'bare'))).toMatchObject({ ok: false, failure: { error: { code: 'invalid-scope' } } });
  });

  test('the container’s tasks are read in safe mode, configs tagged as the root', async () => {
    const result = await scopeIn(container);
    if (!result.ok) throw new Error(result.failure.error.message);
    const inspection = await inspect(result.scope, ['tasks', 'configs'], { ...(await ctx()), home: fakeHome });
    expect(inspection.tasks?.ok && inspection.tasks.data.map((task) => task.name)).toEqual(['local-only', 'status']);
    const own = inspection.configs?.ok ? inspection.configs.data.filter((config) => config.source.path?.startsWith(container)) : [];
    expect(own.map((config) => config.source.kind)).toEqual(['root', 'root']);
    expect(readdirSync(markers)).toEqual([]);
  }, 30_000);
});

describe.skipIf(!git)('scope validation', () => {
  test('refuses relative, missing and non-checkout directories', async () => {
    const plain = join(base, 'plain');
    mkdirSync(plain, { recursive: true });
    const check = (dir: unknown) => resolveScope(dir, { git: git!.path, env: gitEnv, home });
    expect(await check('relative/path')).toMatchObject({ ok: false, failure: { error: { code: 'invalid-scope' } } });
    expect(await check(join(base, 'missing'))).toMatchObject({ ok: false, failure: { error: { code: 'invalid-scope' } } });
    expect(await check(plain)).toMatchObject({ ok: false, failure: { error: { code: 'invalid-scope' } } });
    expect(await check(42)).toMatchObject({ ok: false, failure: { error: { code: 'bad-request' } } });
  });
});
