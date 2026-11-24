# openchamber-kit: notes for agents

Independent OpenChamber extensions in `mods/<mod>/`. Read the mod's own README before changing it. Use Bun throughout (`bun install`, `bun run`, `bun test`).

## Rules

- **Keep mods self-contained.** Each mod owns its manifest, dependencies, lockfile, build, tests, README and CHANGELOG. Don't add a shared runtime layer until two mods need the same code. `tools/` holds dev-only tooling, never shipped code.
- **Commit the built bundles.** OpenChamber installs without building, so they live next to their sources: `panel/main.js`, `status/main.js`, `service/main.js`. Run `bun run build` after every source change. `scripts/publish.ts` refuses stale bundles.
- **Don't change a published extension's `panel.id`.** Extension storage (pins, preferences) is keyed by it, and so is the release branch.
- **Design is a requirement, not polish.**
  - Bento layouts, deliberate typography.
  - Every colour from the host theme: the `--oc-*` variables set by `applyHostReady`.
  - Review `bun run preview` screenshots in both themes and at rail width (about 440 px) and wide (920 px) before calling UI work done.
  - The harness swaps local paths for `/Users/you`; keep it that way for anything committed under `docs/`.
- **Keep the public repo free of personal or client details.**
  - No local paths, client names or folder names in docs, tests, fixtures or screenshots.
  - Use generic names such as `demo-api` and `workspace`.

## Local services

A `contributes.service` runs with the user's full OS permissions. Rules for one:

- **Fixed operations only.** Expose them as routes; never a generic command endpoint.
- **How to run programs:** argv with `shell: false`, no stdin, a timeout and an output cap. Report a killed run as an error, never as partial data.
- **Validate every directory the frame sends,** using `realpath` and a scope rule.
- **Environment:** OpenChamber gives a service only `PATH`, `HOME`, temp and locale. On macOS the desktop app's `PATH` can be minimal, so search known install folders after `PATH` and say in the UI when one was used.
- **Talking to the frames:** frames reach the service through `host.serviceRequest`. The service pushes to open frames with `createServiceHost(...).emit(topic, data)`, which arrives as `host.onServiceEvent`.

## mise specifics

- **Safe mode for every read.** Run reads with a scratch-built environment that includes `MISE_SAFE=1` and the auto-install switches off. `CI` or `MISE_YES` from the host would otherwise loosen trust.
- **Safe mode fails, it doesn't degrade.** A template that needs `exec()` makes the whole command fail with `… is disabled in safe mode`. Show that as its own state; never retry without safe mode.
- **Without safe mode, untrusted config doesn't load at all.** mise errors with *Config files … are not trusted* when there's no TTY.

## Publishing

- **Where it lives.** Codeberg is the primary remote: `ssh://git@codeberg.org/brahn/openchamber-kit.git`.
- **GitHub mirror.** `github.com/bdmorin/openchamber-kit` mirrors it; issues and wiki are off there, and its homepage points to Codeberg. The mirroring is local: `origin` has two push URLs, Codeberg then GitHub, so every `git push`, including `scripts/publish.ts`, updates both. Fetch only from Codeberg. A clone made elsewhere needs `git remote set-url --add --push origin …` for both URLs to keep pushing to both.
- **Unverified on GitHub.** Commits carry the Codeberg noreply address, which GitHub can't tie to an account. GitHub therefore shows them as unverified, although their signatures are valid. Codeberg shows them as Verified.
- **Commit identity.** Commits use the Codeberg noreply identity and are SSH-signed. The user's `~/.gitconfig` sets both through `includeIf hasconfig:remote.*.url:…codeberg.org…`. Don't set `user.email` in this repo.
- **Releases.** One branch per mod, named after its extension id; `scripts/publish.ts` creates them, and the root README explains the scheme. OpenChamber git installs take `<repo>.git#<branch-or-tag>` and can't point into a subfolder, which is why each mod gets its own branch.
- **Listing.** The community directory is openchamber.dev/extensions. Submit an extension by emailing feedback@openchamber.dev with its name, repository URL, category and a one-line description.
