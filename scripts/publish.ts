// Publishes one mod as an installable git ref.
//
//   bun scripts/publish.ts mise            # check, release commit, tag, push
//   bun scripts/publish.ts mise --dry-run  # everything except the push
//
// OpenChamber installs an extension from the root of a git ref
// (`<repo>.git#<branch-or-tag>`) and can't point into a subfolder. So each mod
// gets a release branch named after its extension id, whose tree is exactly
// mods/<mod>/ at the released main commit:
//
//   main            the monorepo, where work happens
//   <id>            one signed commit per release, tree = mods/<mod>; users install this
//   <id>-v<version> tag on that release commit, for pinned installs
//
// The release branch only ever fast-forwards, so Update in Settings → Extensions
// sees each new version.
import { $ } from 'bun';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const [mod, ...flags] = process.argv.slice(2);
const dryRun = flags.includes('--dry-run');
const remote = 'origin';

const fail = (message: string): never => { console.error(`publish: ${message}`); process.exit(1); };
const step = (message: string) => console.log(`• ${message}`);

if (!mod || mod.startsWith('-')) fail('usage: bun scripts/publish.ts <mod> [--dry-run]');
const dir = resolve(root, 'mods', mod!);
const prefix = `mods/${mod}`;

let manifest: { version?: string; openchamber?: { contributes?: { panel?: { id?: string } } } };
try { manifest = JSON.parse(readFileSync(resolve(dir, 'package.json'), 'utf8')); } catch { fail(`no ${prefix}/package.json`); }
const version = manifest!.version ?? fail('package.json has no version');
const id = manifest!.openchamber?.contributes?.panel?.id ?? fail('package.json has no openchamber.contributes.panel.id');
const branch = id;
const tag = `${id}-v${version}`;

$.cwd(root);
$.throws(false);

// 1. A clean main, so the release is exactly a commit others can see.
const current = (await $`git symbolic-ref --short HEAD`.text()).trim();
if (current !== 'main') fail(`on ${current}; publish from main`);
if ((await $`git status --porcelain`.text()).trim()) fail('working tree is not clean; commit or stash first');
if ((await $`git rev-parse -q --verify refs/tags/${tag}`.quiet()).exitCode === 0) fail(`${tag} already exists; bump version in ${prefix}/package.json`);

// 2. Checks pass, and the committed bundles are what the sources build to.
step(`checking ${prefix}`);
if ((await $`bun run check`.cwd(dir)).exitCode !== 0) fail('bun run check failed');
if ((await $`git status --porcelain -- ${prefix}`.text()).trim()) {
  fail(`the build changed committed files in ${prefix}; commit the rebuilt bundles first`);
}

// 3. One signed release commit on the mod's branch.
const head = (await $`git rev-parse HEAD`.text()).trim();
const tree = (await $`git rev-parse ${`HEAD:${prefix}`}`.text()).trim();
await $`git fetch -q ${remote} ${`+refs/heads/${branch}:refs/remotes/${remote}/${branch}`}`.quiet();
const parent = (await $`git rev-parse -q --verify ${`refs/remotes/${remote}/${branch}`}`.quiet().text()).trim()
  || (await $`git rev-parse -q --verify ${`refs/heads/${branch}`}`.quiet().text()).trim();
if (parent && (await $`git rev-parse ${`${parent}^{tree}`}`.text()).trim() === tree) fail(`${branch} already holds this tree; nothing to publish`);
const sign = (await $`git config --bool commit.gpgsign`.quiet().text()).trim() === 'true' ? ['-S'] : [];
const message = `${id} ${version}\n\nReleased from main ${head.slice(0, 12)} (${prefix}).`;
const release = (await $`git commit-tree ${tree} ${parent ? ['-p', parent] : []} ${sign} -m ${message}`.text()).trim();
if (!release) fail('git commit-tree failed');
await $`git update-ref ${`refs/heads/${branch}`} ${release}`;
await $`git tag -a ${sign.length ? ['-s'] : []} ${tag} ${release} -m ${`${id} ${version}`}`;
step(`${branch} → ${release.slice(0, 12)}${parent ? ` (after ${parent.slice(0, 12)})` : ' (first release)'}, tagged ${tag}`);

// 4. Push main, the release branch and the tag together.
const refs = ['main', `refs/heads/${branch}:refs/heads/${branch}`, `refs/tags/${tag}`];
if (dryRun) {
  step(`dry run: would push ${refs.join(' ')} to ${remote}`);
  step(`undo locally with: git tag -d ${tag} && git update-ref ${parent ? `refs/heads/${branch} ${parent}` : `-d refs/heads/${branch}`}`);
} else {
  if ((await $`git push --atomic ${remote} ${refs}`).exitCode !== 0) fail('push failed; the local branch and tag are kept, so fix and rerun the push');
  const url = (await $`git remote get-url ${remote}`.text()).trim()
    .replace(/^ssh:\/\/git@([^/]+)\//, 'https://$1/').replace(/^git@([^:]+):/, 'https://$1/');
  step(`published. Install with: ${url.endsWith('.git') ? url : `${url}.git`}#${branch}`);
}
