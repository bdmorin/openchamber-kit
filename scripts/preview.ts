// Screenshots of the panel and the Work Status section in both themes, for
// design review and for docs/. Reads a throwaway demo project through the real
// service code, then swaps local paths for /Users/you so nothing personal lands
// in an image.
//
//   bun run preview          -> scratch/preview/mise/*.png at the kit root
//   bun run preview --docs   -> also refreshes docs/*.png
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { bundle, page, shoot, type Shot, type ThemeName } from '../../../tools/preview/index.ts';
import { fallbackCandidates, findProgram } from '../src/service/discover.ts';
import { Limiter, inspect, miseEnv, readVersion } from '../src/service/inspect.ts';
import { resolveScope } from '../src/service/scope.ts';
import type { Inspection } from '../src/shared/types.ts';

const mod = resolve(import.meta.dir, '..');
const out = resolve(mod, '../../scratch/preview/mise');
const FAKE_HOME = '/Users/you';

const DEMO_TOML = `[tools]
node = "22"
pnpm = "9"
python = "3.12"
jq = "latest"
terraform = "1.9"

[tasks.dev]
description = "Start the API with hot reload"
run = "pnpm tsx watch src/server.ts"
alias = "d"

[tasks.build]
description = "Compile TypeScript and bundle the worker"
run = ["pnpm tsc -p tsconfig.build.json", "pnpm esbuild src/worker.ts --bundle --outdir=dist"]
depends = ["codegen"]

[tasks.codegen]
description = "Generate the OpenAPI client"
run = "pnpm openapi-typescript openapi.yaml -o src/gen/api.ts"

[tasks.test]
description = "Unit tests with coverage"
run = "pnpm vitest run --coverage"
depends = ["codegen"]

[tasks.lint]
description = "Biome lint and format check"
run = "pnpm biome check ."
alias = "l"

[tasks."db:migrate"]
description = "Apply pending database migrations"
run = "pnpm drizzle-kit migrate"

[tasks."db:seed"]
description = "Load fixture data into the local database"
run = "python scripts/seed.py --env local"
depends = ["db:migrate"]

[tasks.release]
description = "Tag, changelog and publish"
run = "./scripts/release.sh"
hide = true
`;

const capture = async (): Promise<Inspection> => {
  const base = realpathSync(mkdtempSync(join(tmpdir(), 'mise-preview-')));
  const demo = join(base, 'demo-api');
  try {
    mkdirSync(join(demo, '.mise/tasks'), { recursive: true });
    writeFileSync(join(demo, 'mise.toml'), DEMO_TOML);
    writeFileSync(join(demo, '.mise/tasks/deploy'), '#!/usr/bin/env bash\n#MISE description="Deploy the worker to staging"\nwrangler deploy --env staging\n', { mode: 0o755 });
    const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=demo', '-c', 'user.email=demo@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd: demo, stdio: 'pipe' });
    git('init', '-q'); git('commit', '-q', '--allow-empty', '-m', 'init'); git('checkout', '-q', '-b', 'feat/rate-limits');

    const home = process.env.HOME ?? '';
    const env = miseEnv(process.env);
    const mise = findProgram('mise', process.env, fallbackCandidates(home)).found;
    const gitBin = findProgram('git', process.env).found;
    if (!mise || !gitBin) throw new Error('preview needs mise and git');
    const scope = await resolveScope(demo, { git: gitBin.path, env: { PATH: env.PATH ?? '', HOME: home }, home });
    if (!scope.ok) throw new Error(scope.failure.error.message);
    const result = await inspect(scope.scope, ['tasks', 'tools', 'configs'], {
      mise: { ...mise, version: await readVersion(mise.path, env, home) }, env, home, limiter: new Limiter(4, 24),
    });
    // Nothing local in the pictures: the demo lives in ~/src, home is /Users/you.
    const json = JSON.stringify(result)
      .replaceAll(demo, `${FAKE_HOME}/src/demo-api`)
      .replaceAll(home, FAKE_HOME)
      .replaceAll(`~${base.startsWith(home) ? base.slice(home.length) : base}/demo-api`, '~/src/demo-api');
    const clean = JSON.parse(json) as Inspection;
    clean.scope.label = '~/src/demo-api';
    clean.elapsedMs = 64;
    return clean;
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
};

const fnv = (value: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 0x01000193);
  return (hash >>> 0).toString(36);
};

const data = await capture();
const storage = { [`pins:v1:${fnv(data.scope.directory)}`]: { v: 1, directory: data.scope.directory, tasks: ['dev', 'test', 'db:migrate', 'old-smoke'] } };
const answer = (body: unknown, status = 200) => `async (req) => req.path === '/pins-changed' ? [200, { ok: true }] : [${status}, ${JSON.stringify(body)}]`;

const refused = {
  ...data,
  tools: { ok: false, error: { code: 'safe-mode-refused', message: 'Safe mode refused part of this config (a template calls exec() or reads files), so mise stopped. Nothing was run, and the inspector does not retry outside safe mode.', detail: 'error parsing config file: ~/src/demo-api/.tool-versions\nerror: exec() is disabled in safe mode (MISE_SAFE=1)' } },
};
const noMise = { error: { code: 'no-mise', message: 'mise was not found by the OpenChamber service. Install it, or make sure it is on the PATH OpenChamber starts with.', searched: ['/usr/bin/mise', '/bin/mise', '/opt/homebrew/bin/mise', '/usr/local/bin/mise', '~/.local/bin/mise'] } };

const [panel, status] = await Promise.all([bundle(join(mod, 'src/panel/main.ts')), bundle(join(mod, 'src/status/main.ts'))]);
const openBuild = "[...document.querySelectorAll('.task-row')].find((row) => row.textContent.includes('build'))?.click()";

const shots: Shot[] = [];
for (const theme of ['dark', 'light'] as ThemeName[]) {
  const base = { theme, directory: data.scope.directory, storage };
  for (const width of [440, 920]) {
    shots.push({ name: `panel-${theme}-${width}`, width, html: page(panel, { ...base, surface: 'panel', service: answer(data), after: openBuild }) });
  }
  shots.push({ name: `panel-${theme}-refused`, width: 440, html: page(panel, { ...base, surface: 'panel', service: answer(refused) }) });
  shots.push({ name: `panel-${theme}-no-mise`, width: 440, html: page(panel, { ...base, surface: 'panel', service: answer(noMise, 503) }) });
  shots.push({ name: `status-${theme}`, width: 380, html: page(status, { ...base, surface: 'status', service: answer(data) }) });
}

const errors = await shoot(shots, out);
let failed = false;
for (const [name, list] of Object.entries(errors)) {
  console.log(`${name.padEnd(24)} ${list.length ? `ERRORS: ${list.join(' | ')}` : 'ok'}`);
  failed ||= list.length > 0;
}
if (process.argv.includes('--docs')) {
  copyFileSync(join(out, 'panel-dark-440.png'), join(mod, 'docs/panel-dark.png'));
  copyFileSync(join(out, 'panel-light-920.png'), join(mod, 'docs/panel-light-wide.png'));
  console.log('docs/ refreshed');
}
console.log(`\n${out}`);
process.exit(failed ? 1 : 0);
