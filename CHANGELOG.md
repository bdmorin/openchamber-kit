# Changelog

## 0.3.0

- First public release, installable from `https://codeberg.org/brahn/openchamber-kit.git#mise-inspector`.
- Extension id is now `mise-inspector` (was `mise`). Remove a copy installed under the old id and add it again; pins made under the old id don't carry over.

## 0.2.0

- Inspects mise projects outside git: a folder inside your home folder whose root has its own mise config, such as a workspace folder holding several repos.

## 0.1.0

- Panel with tasks, tools and the config chain; pinned tasks in the panel and in Work Status.
- Every read in mise safe mode, with clear states for refused config, missing mise, folders that can't be inspected and partial failures.
