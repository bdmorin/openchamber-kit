# openchamber-kit

Extensions for [OpenChamber](https://openchamber.dev), each one self-contained and installable on its own.

| Extension | What it does | Install URL |
| --- | --- | --- |
| [mise inspector](mods/mise/) | The project's [mise](https://mise.jdx.dev) tasks, tools and config files in a bento panel, with pinned tasks in Work Status. Read-only, in mise's safe mode | `https://codeberg.org/brahn/openchamber-kit.git#mise-inspector` |

## Installing

In OpenChamber, open **Settings → Extensions**, paste an install URL into **Folder, ZIP, or URL** and choose **Add**. Each extension's README says what its approval dialog will ask for. To update one, use **Update** on its card.

The URL points at a release branch named after the extension. A tag such as `#mise-inspector-v0.3.0` installs one fixed version instead; it won't update.

## Layout

```text
mods/<mod>/       one extension: manifest, sources, tests, built bundles, README, CHANGELOG
tools/preview/    dev tool: renders a mod's frames against a mock host in headless Chromium
scripts/publish.ts  turns mods/<mod> at main into a signed release on its branch
```

Work happens on `main`. Each mod has its own dependencies, lockfile and build; nothing is shared at runtime.

## Developing

You need [Bun](https://bun.sh). Each mod lists its own requirements in its README.

```sh
cd mods/<mod>
bun install
bun run check                # typecheck, tests, build
bun run preview              # screenshots in both themes (once: cd tools/preview && bun run setup)
```

OpenChamber installs extensions without building them, so the built bundles are committed. To try a change, add the mod's folder in Settings → Extensions; OpenChamber then runs it straight from that folder, so rebuild and reload.

## Releasing

Bump `version` in the mod's `package.json`, update its `CHANGELOG.md`, commit, then run:

```sh
bun scripts/publish.ts <mod>             # or --dry-run first
```

The script runs the mod's checks and refuses if the committed bundles are out of date. It then adds a signed release commit to the mod's branch, tags it `<id>-v<version>`, and pushes `main`, the branch and the tag together.

The repository lives on [Codeberg](https://codeberg.org/brahn/openchamber-kit), with a read-only mirror at [github.com/bdmorin/openchamber-kit](https://github.com/bdmorin/openchamber-kit). Issues and pull requests go to Codeberg. Install URLs work from either host.

## License

[MIT](LICENSE)
