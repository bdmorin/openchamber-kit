import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

import { inspectDirectory, type Problem } from '../client/api.ts';
import { h } from '../client/dom.ts';
import { icon } from '../client/icons.ts';
import { PinStore } from '../client/pins.ts';
import { BASE_CSS, PANEL_CSS, installStyle } from '../client/style.ts';
import { PARTS, type ConfigFile, type Inspection, type Section, type SectionError, type SourceKind, type Task, type Tool } from '../shared/types.ts';

const host = connectHost();
const pinStore = new PinStore(host);
installStyle(BASE_CSS, PANEL_CSS);
const root = document.querySelector<HTMLElement>('#root')!;

type View =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'problem'; problem: Problem }
  | { kind: 'ready'; data: Inspection };

// ---- state -----------------------------------------------------------------
let directory: string | null = null;
let directorySeen = false;
let generation = 0;
let view: View = { kind: 'loading' };
let refreshing = false;
/** Last good answer per reported directory: switching back paints at once, then refreshes. */
const cache = new Map<string, Inspection>();
let pins: string[] = [];
let pinsError: string | null = null;
let filter = '';
let showHidden = false;
let showAllTasks = false;
const expanded = new Set<string>();
let flashTask: string | null = null;

const TASKS_SHOWN = 30;
const KIND_LABEL: Record<SourceKind, string> = { global: 'global', parent: 'parent', root: 'checkout', local: 'subfolder', other: 'other', computed: 'computed' };

// ---- data ------------------------------------------------------------------
const canonical = (): string | null => (view.kind === 'ready' ? view.data.scope.directory : null);

const load = async (): Promise<void> => {
  const dir = directory;
  const mine = ++generation;
  if (!dir) { view = { kind: 'empty' }; refreshing = false; render(); return; }
  const cached = cache.get(dir);
  if (cached) { view = { kind: 'ready', data: cached }; refreshing = true; }
  else { view = { kind: 'loading' }; pins = []; pinsError = null; }
  render();

  const answer = await inspectDirectory(host, dir, [...PARTS]);
  // A later directory or refresh owns the screen now: never paint this answer.
  if (mine !== generation || dir !== directory) return;
  refreshing = false;
  if (!answer.ok) { view = { kind: 'problem', problem: answer.problem }; render(); return; }
  cache.set(dir, answer.data);
  view = { kind: 'ready', data: answer.data };
  await loadPins(answer.data.scope.directory, mine);
  render();
};

const loadPins = async (scopeDir: string, mine = generation): Promise<void> => {
  const result = await pinStore.read(scopeDir);
  if (mine !== generation || canonical() !== scopeDir) return;
  if (result.ok) { pins = result.pins; pinsError = null; } else pinsError = result.message;
};

const togglePin = (name: string): void => {
  const scopeDir = canonical();
  if (!scopeDir) return;
  const before = pins;
  pins = pins.includes(name) ? pins.filter((pin) => pin !== name) : [...pins, name];
  render();
  pinStore.toggle(scopeDir, name).then((next) => {
    if (canonical() === scopeDir) { pins = next; render(); }
  }).catch((error: unknown) => {
    if (canonical() === scopeDir) { pins = before; render(); }
    void host.toast({ kind: 'error', message: error instanceof Error ? error.message : 'Could not save the pin.' });
  });
};

const reveal = (name: string): void => {
  filter = '';
  expanded.add(name);
  const task = sectionData(view.kind === 'ready' ? view.data.tasks : undefined)?.find((item) => item.name === name);
  if (task?.hidden) showHidden = true;
  showAllTasks = true;
  flashTask = name;
  render();
  root.querySelector(`[data-task="${CSS.escape(name)}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  flashTask = null;
};

const sectionData = <T>(section: Section<T> | undefined): T | null => (section?.ok ? section.data : null);

// ---- small parts -------------------------------------------------------------
const svg = (markup: string) => h('span', { html: markup, style: { display: 'contents' } });

const iconButton = (markup: string, label: string, onClick: (event: Event) => void, extra = '') => h('button', {
  class: `iconbtn ${extra}`.trim(),
  title: label,
  attrs: { 'aria-label': label },
  html: markup,
  on: { click: (event) => { event.stopPropagation(); onClick(event); } },
});

const eyebrow = (markup: string, label: string, count?: number | string) => h('div', { class: 'tile-head' },
  h('span', { class: 'eyebrow' }, svg(markup), label),
  count === undefined ? null : h('span', { class: 'count' }, String(count)),
);

const dot = (kind: SourceKind) => h('span', { class: `dot k-${kind}`, attrs: { 'aria-hidden': 'true' } });

const PROBLEM_TITLES: Record<SectionError['code'], string> = {
  'safe-mode-refused': 'Not read: safe mode refused this config',
  untrusted: 'Not read: config is untrusted',
  'parse-error': 'Not read: config has an error',
  timeout: 'Not read: mise timed out',
  'output-too-large': 'Not read: output too large',
  'bad-json': 'Not read: unexpected mise output',
  'mise-failed': 'Not read: mise failed',
};

const sectionProblem = (error: SectionError) => h('div', { class: `problem ${error.code === 'safe-mode-refused' ? '' : 'error'}`.trim() },
  svg(icon.alert),
  h('div', null,
    h('b', null, PROBLEM_TITLES[error.code]),
    error.message,
    error.detail ? h('pre', null, error.detail) : null,
  ),
);

// ---- tiles -----------------------------------------------------------------
const heroTile = (data: Inspection) => {
  const { scope } = data;
  return h('section', { class: 'tile hero span-all' },
    h('div', { class: 'glyph monogram', attrs: { 'aria-hidden': 'true' } }, (scope.name.match(/[a-z0-9]/i)?.[0] ?? 'm').toUpperCase()),
    h('div', { class: 'trunc' },
      h('h1', { class: 'trunc', title: scope.root }, scope.name),
      h('div', { class: 'meta' },
        scope.branch ? h('span', { class: 'chip', title: 'Branch' }, svg(icon.branch), h('span', { class: 'trunc' }, scope.branch)) : null,
        scope.kind === 'mise' ? h('span', { class: 'chip', title: 'Not a git checkout: the root is the highest folder here with its own mise config' }, svg(icon.folder), 'mise project') : null,
        scope.linkedWorktree ? h('span', { class: 'chip t-info', title: 'A linked git worktree. Its pins are separate from the main checkout.' }, 'worktree') : null,
        scope.directory !== scope.root ? h('span', { class: 'chip t-primary', title: 'Inspecting a folder inside the checkout' }, 'subfolder') : null,
      ),
      h('div', { class: 'path mono trunc', title: scope.directory }, scope.label),
    ),
    h('div', { class: 'actions' },
      iconButton(icon.refresh, refreshing ? 'Refreshing…' : 'Refresh', () => { void load(); }, refreshing ? 'spin' : ''),
    ),
  );
};

const statsTile = (data: Inspection) => {
  const tasks = sectionData(data.tasks);
  const tools = sectionData(data.tools);
  const configs = sectionData(data.configs);
  const missing = tools?.filter((tool) => !tool.installed).length ?? 0;
  const untrusted = configs?.filter((config) => config.trust === 'untrusted').length ?? 0;
  const stat = (target: string, value: number | null, label: string, note: string | null) => h('button', {
    class: `stat ${value === null ? 'failed' : ''}`.trim(),
    title: value === null ? `${label}: not read` : `Jump to ${label.toLowerCase()}`,
    on: { click: () => root.querySelector(`.${target}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }) },
  },
  h('div', { class: 'stat-num' }, value === null ? '—' : String(value)),
  h('div', { class: 'stat-label' }, label, note ? h('span', { class: 'stat-note' }, note) : null),
  );
  return h('section', { class: 'tile flush stats-tile span-all' },
    h('div', { class: 'stats' },
      stat('tasks-tile', tasks ? tasks.filter((task) => !task.hidden).length : null, 'Tasks', null),
      stat('tools-tile', tools ? tools.length : null, 'Tools', missing ? `${missing} missing` : null),
      stat('configs-tile', configs ? configs.length : null, 'Configs', untrusted ? `${untrusted} untrusted` : null),
    ),
  );
};

const pinnedTile = (data: Inspection) => {
  const tasks = sectionData(data.tasks);
  const byName = new Map((tasks ?? []).map((task) => [task.name, task]));
  let body: HTMLElement;
  if (pinsError) body = sectionProblem({ code: 'mise-failed', message: pinsError, detail: null });
  else if (!pins.length) {
    body = h('div', { class: 'hint' }, 'Pin tasks with ', h('span', { html: icon.pin, style: { display: 'inline-flex', width: '12px', 'vertical-align': '-2px' } }),
      ' below to keep them here and in Work Status. Pins belong to this checkout only.');
  } else {
    body = h('div', { class: 'pins' }, ...pins.map((name) => {
      const task = byName.get(name);
      const missing = tasks !== null && !task;
      return h('div', {
        class: `pin ${missing ? 'missing' : ''}`.trim(),
        title: missing ? `${name} is pinned but no longer defined here` : `Show ${name}`,
        attrs: { role: 'button', tabindex: '0' },
        on: {
          click: () => { if (!missing) reveal(name); },
          keydown: (event) => { if ((event as KeyboardEvent).key === 'Enter' && !missing) reveal(name); },
        },
      },
      svg(icon.pinFilled),
      h('div', { class: 'trunc' },
        h('div', { class: 'name mono trunc' }, name),
        h('div', { class: 'desc trunc' }, missing ? 'not defined in this checkout' : task?.description || (tasks ? 'no description' : 'tasks not read')),
      ),
      iconButton(icon.x, `Unpin ${name}`, () => togglePin(name)),
      );
    }));
  }
  return h('section', { class: 'tile pinned span-all' }, eyebrow(icon.pin, 'Pinned', pins.length || undefined), body);
};

const scriptBlock = (task: Task) => {
  if (task.file) return h('pre', { class: 'script mono' }, h('span', { class: 'p' }, '# '), 'file task: the file is the script');
  if (!task.run.length) return null;
  const pre = h('pre', { class: 'script mono' });
  task.run.forEach((line, index) => {
    if (index) pre.append('\n');
    pre.append(h('span', { class: 'p' }, '$ '), line);
  });
  if (task.runTruncated) pre.append('\n', h('span', { class: 'p' }, '… truncated'));
  return pre;
};

const taskItem = (task: Task) => {
  const open = expanded.has(task.name);
  const pinned = pins.includes(task.name);
  const toggle = () => { if (open) expanded.delete(task.name); else expanded.add(task.name); render(); };
  const chips = (values: string[]) => h('dd', null, ...values.map((value) => h('span', { class: 'chip' }, value)));
  return h('div', {
    class: ['task', open && 'open', task.hidden && 'hidden-task', flashTask === task.name && 'flash'].filter(Boolean).join(' '),
    attrs: { 'data-task': task.name },
  },
  h('div', {
    class: 'task-row',
    attrs: { role: 'button', tabindex: '0', 'aria-expanded': String(open) },
    on: { click: toggle, keydown: (event) => { if ((event as KeyboardEvent).key === 'Enter') toggle(); } },
  },
  iconButton(pinned ? icon.pinFilled : icon.pin, pinned ? `Unpin ${task.name}` : `Pin ${task.name}`, () => togglePin(task.name), `pinbtn ${pinned ? 'on' : ''}`),
  h('span', { class: 'task-name mono' }, task.name),
  h('span', { class: 'task-desc trunc' }, task.description),
  h('span', { class: 'task-tail' },
    h('span', { class: `dot k-${task.source.kind}`, title: `${KIND_LABEL[task.source.kind]} · ${task.source.label ?? 'computed'}` }),
    h('span', { class: 'chev', html: icon.chevron }),
  ),
  ),
  open ? h('div', { class: 'task-body' },
    task.description.length > 56 ? h('div', { class: 'task-full' }, task.description) : null,
    h('dl', { class: 'kv' },
      h('dt', null, 'source'), h('dd', { class: `k-${task.source.kind}` }, dot(task.source.kind), h('span', { class: 'mono trunc', title: task.source.path ?? '' }, task.source.label ?? 'computed by mise')),
      task.dir && task.dir !== '.' ? h('dt', null, 'runs in') : null, task.dir && task.dir !== '.' ? h('dd', { class: 'mono' }, task.dir) : null,
      task.aliases.length ? h('dt', null, 'aliases') : null, task.aliases.length ? chips(task.aliases) : null,
      task.depends.length ? h('dt', null, 'depends') : null, task.depends.length ? chips(task.depends) : null,
      task.hidden ? h('dt', null, 'hidden') : null, task.hidden ? h('dd', null, 'yes — not listed by mise tasks by default') : null,
    ),
    scriptBlock(task),
  ) : null,
  );
};

const tasksTile = (section: Section<Task[]> | undefined) => {
  const all = sectionData(section) ?? [];
  const hiddenCount = all.filter((task) => task.hidden).length;
  const needle = filter.trim().toLowerCase();
  const matches = all.filter((task) => (showHidden || !task.hidden || pins.includes(task.name))
    && (!needle || [task.name, task.description, ...task.aliases].some((value) => value.toLowerCase().includes(needle))));
  const shown = showAllTasks || needle ? matches : matches.slice(0, TASKS_SHOWN);

  const search = h('label', { class: 'search' }, svg(icon.search), h('input', {
    attrs: { type: 'search', placeholder: 'Filter tasks', 'aria-label': 'Filter tasks', value: filter, 'data-focus': 'filter', spellcheck: 'false' },
    on: { input: (event) => { filter = (event.target as HTMLInputElement).value; render(); } },
  }));

  let body: HTMLElement;
  if (section && !section.ok) body = sectionProblem(section.error);
  else if (!all.length) body = h('div', { class: 'none' }, 'No tasks defined for this checkout.');
  else {
    body = h('div', null,
      shown.length ? h('div', { class: 'tasks' }, ...shown.map(taskItem)) : h('div', { class: 'none' }, `No task matches “${filter}”.`),
      h('div', { class: 'list-foot' },
        !needle && !showAllTasks && matches.length > TASKS_SHOWN
          ? h('button', { class: 'btn ghost', on: { click: () => { showAllTasks = true; render(); } } }, `Show all ${matches.length}`) : null,
        hiddenCount ? h('button', { class: 'btn ghost', on: { click: () => { showHidden = !showHidden; render(); } } },
          showHidden ? `Hide ${hiddenCount} hidden` : `Show ${hiddenCount} hidden`) : null,
      ),
    );
  }
  return h('section', { class: 'tile tasks-tile span-all' },
    h('div', { class: 'tile-head' },
      h('span', { class: 'eyebrow' }, svg(icon.terminal), 'Tasks'),
      all.length ? h('span', { class: 'count' }, needle ? `${matches.length}/${all.length}` : String(all.length - hiddenCount)) : null,
      all.length ? search : null,
    ),
    body,
  );
};

const toolsTile = (section: Section<Tool[]> | undefined) => {
  const tools = sectionData(section) ?? [];
  let body: HTMLElement;
  if (section && !section.ok) body = sectionProblem(section.error);
  else if (!tools.length) body = h('div', { class: 'none' }, 'No tools requested here.');
  else {
    body = h('div', { class: 'tools' }, ...tools.map((tool) => {
      const state = !tool.installed ? 'missing' : tool.active ? 'active' : 'installed';
      const requested = tool.requested && tool.requested !== tool.version ? tool.requested : null;
      return h('div', { class: `tool k-${tool.source.kind}`, title: `${tool.name} ${tool.version} · ${tool.source.label ?? 'computed'}${requested ? ` · requested ${requested}` : ''}` },
        h('div', { class: 'tool-name' }, dot(tool.source.kind), h('span', { class: 'trunc' }, tool.name),
          requested ? h('span', { class: 'tool-req mono trunc' }, `@${requested}`) : null),
        h('div', { class: 'tool-ver mono trunc' }, tool.version),
        h('div', { class: `tool-state ${state}` }, state === 'missing' ? 'not installed' : state),
      );
    }));
  }
  return h('section', { class: 'tile tools-tile' }, eyebrow(icon.box, 'Tools', tools.length || undefined), body);
};

const configsTile = (section: Section<ConfigFile[]> | undefined) => {
  const configs = sectionData(section) ?? [];
  let body: HTMLElement;
  if (section && !section.ok) body = sectionProblem(section.error);
  else if (!configs.length) body = h('div', { class: 'none' }, 'No mise config applies here.');
  else {
    body = h('ol', { class: 'chain' }, ...configs.map((config) => h('li', { class: `k-${config.source.kind}` },
      dot(config.source.kind),
      h('div', { class: 'trunc' },
        h('div', { class: 'cfg-path mono trunc', title: config.source.path ?? '' }, config.source.label ?? 'computed'),
        h('div', { class: 'cfg-meta' },
          h('span', { class: 'badge' }, KIND_LABEL[config.source.kind]),
          config.trust === 'untrusted' ? h('span', { class: 'badge warn', title: 'Not trusted by mise. Read anyway because safe mode cannot run its code.' }, 'untrusted') : null,
          config.trust === 'ignored' ? h('span', { class: 'badge warn', title: 'On mise’s ignore list' }, 'ignored') : null,
          config.trust === 'trusted' && config.source.kind !== 'global' ? h('span', { class: 'badge ok' }, 'trusted') : null,
        ),
        config.tools.length ? h('div', { class: 'cfg-tools trunc' }, config.tools.join(' · ')) : null,
      ),
    )));
  }
  return h('section', { class: 'tile configs-tile' }, eyebrow(icon.layers, 'Config chain', configs.length || undefined), body);
};

const footTile = (data: Inspection) => h('section', { class: 'tile foot span-all' },
  h('div', { class: 'foot-row' },
    h('span', { class: 'safe', title: 'Every read runs with MISE_SAFE=1 and MISE_AUTO_INSTALL=0. Project [env], [vars], hooks, _.source and path: tools are skipped; templates that need exec() or file reads make mise refuse instead.' },
      svg(icon.shield), 'Safe mode · read-only'),
    h('span', { class: 'mono', title: data.mise.path }, `mise ${data.mise.version ?? '?'}`),
    data.mise.via === 'fallback' ? h('span', { class: 'chip t-warning', title: `Not on the service PATH; found at ${data.mise.path}` }, 'found outside PATH') : null,
    h('span', { class: 'grow' }),
    h('span', { class: 'mono' }, `${data.elapsedMs} ms`),
  ),
  h('div', { class: 'foot-row' },
    'Project env, hooks and path: tools are not evaluated, and env values are never read.',
  ),
  h('div', { class: 'legend' }, ...(['global', 'parent', 'root', 'local', 'other'] as SourceKind[]).map((kind) => h('span', null, dot(kind), KIND_LABEL[kind]))),
);

// ---- whole-panel states ----------------------------------------------------
const skeleton = () => h('div', { class: 'bento' },
  h('div', { class: 'tile hero span-all' },
    h('div', { class: 'skel', style: { width: '40px', height: '40px', 'border-radius': '12px' } }),
    h('div', { style: { display: 'grid', gap: '8px' } }, h('div', { class: 'skel', style: { width: '45%', height: '16px' } }), h('div', { class: 'skel', style: { width: '70%', height: '11px' } })),
    h('span'),
  ),
  h('div', { class: 'tile span-all', style: { height: '64px' } }, h('div', { class: 'skel', style: { height: '100%' } })),
  ...[150, 110, 110].map((height) => h('div', { class: 'tile span-all' },
    h('div', { class: 'skel', style: { width: '30%', height: '10px', 'margin-bottom': '12px' } }),
    h('div', { class: 'skel', style: { height: `${height}px` } }),
  )),
);

const statePage = (glyph: string, title: string, message: string, tone: '' | 'warn', ...extra: Array<HTMLElement | null>) => h('div', { class: `state ${tone}`.trim() },
  h('div', { class: 'glyph', html: glyph }),
  h('h2', null, title),
  h('p', null, message),
  ...extra,
);

const problemPage = (problem: Problem) => statePage(
  problem.code === 'invalid-scope' ? icon.folder : icon.alert,
  problem.title,
  problem.message,
  problem.code === 'invalid-scope' ? '' : 'warn',
  problem.searched?.length ? h('details', null, h('summary', null, `Looked in ${problem.searched.length} places`), h('pre', { class: 'mono' }, problem.searched.join('\n'))) : null,
  problem.code === 'invalid-scope' ? null : h('button', { class: 'btn', on: { click: () => { void load(); } } }, svg(icon.refresh), 'Try again'),
);

// ---- render ----------------------------------------------------------------
const render = (): void => {
  const active = document.activeElement as HTMLInputElement | null;
  const focusKey = active?.dataset?.focus ?? null;
  const selection = focusKey ? [active!.selectionStart, active!.selectionEnd] as const : null;

  let content: HTMLElement;
  if (view.kind === 'empty') content = statePage(icon.knife, 'No project open', 'Open a project or worktree and its mise tasks, tools and config show here.', '');
  else if (view.kind === 'loading') content = skeleton();
  else if (view.kind === 'problem') content = problemPage(view.problem);
  else {
    const { data } = view;
    content = h('div', { class: 'bento' },
      heroTile(data),
      statsTile(data),
      pinnedTile(data),
      tasksTile(data.tasks),
      toolsTile(data.tools),
      configsTile(data.configs),
      footTile(data),
    );
  }
  root.replaceChildren(h('div', { class: 'wrap' }, content));

  if (focusKey) {
    const input = root.querySelector<HTMLInputElement>(`[data-focus="${focusKey}"]`);
    if (input) {
      input.focus();
      if (selection) input.setSelectionRange(selection[0], selection[1]);
    }
  }
};

// ---- host wiring -----------------------------------------------------------
host.onReady((context) => {
  applyHostReady(context, document.documentElement);
});

host.onDirectory((next) => {
  if (directorySeen && next === directory) return;
  directorySeen = true;
  directory = next;
  expanded.clear();
  showAllTasks = false;
  filter = '';
  void load();
});

host.onServiceEvent((event) => {
  if (event.topic !== 'pins') return;
  const scopeDir = canonical();
  const changed = (event.data as { directory?: unknown } | undefined)?.directory;
  if (!scopeDir || changed !== scopeDir) return;
  void loadPins(scopeDir).then(render);
});

// An agent turn may have edited mise.toml: re-read when one finishes.
let lastPhase: string | null = null;
host.onSessionLifecycle((event) => {
  const finished = lastPhase === 'started' && event.phase === 'completed';
  lastPhase = event.phase;
  if (finished && directory) void load();
});

render();
