// Work Status section: the pinned tasks of the checkout the chat works in.
// Same service, same pin storage as the panel; either side's changes reach
// the other through the service's `pins` event.
import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

import { inspectDirectory, type Problem } from '../client/api.ts';
import { h, trackHeight } from '../client/dom.ts';
import { icon } from '../client/icons.ts';
import { PinStore } from '../client/pins.ts';
import { BASE_CSS, STATUS_CSS, installStyle } from '../client/style.ts';
import type { Scope, Task } from '../shared/types.ts';

const host = connectHost();
const pinStore = new PinStore(host);
installStyle(BASE_CSS, STATUS_CSS);
const root = document.querySelector<HTMLElement>('#root')!;

type View =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'problem'; problem: Problem }
  | { kind: 'ready'; scope: Scope; tasks: Task[] | null; tasksError: string | null; pins: string[]; pinsError: string | null };

let directory: string | null = null;
let directorySeen = false;
let generation = 0;
let view: View = { kind: 'loading' };

const load = async (): Promise<void> => {
  const dir = directory;
  const mine = ++generation;
  if (!dir) { view = { kind: 'empty' }; render(); return; }
  if (view.kind !== 'ready') { view = { kind: 'loading' }; render(); }
  const answer = await inspectDirectory(host, dir, ['tasks']);
  if (mine !== generation || dir !== directory) return;
  if (!answer.ok) { view = { kind: 'problem', problem: answer.problem }; render(); return; }
  const { scope, tasks } = answer.data;
  const stored = await pinStore.read(scope.directory);
  if (mine !== generation || dir !== directory) return;
  view = {
    kind: 'ready',
    scope,
    tasks: tasks?.ok ? tasks.data : null,
    tasksError: tasks && !tasks.ok ? tasks.error.message : null,
    pins: stored.ok ? stored.pins : [],
    pinsError: stored.ok ? null : stored.message,
  };
  render();
};

const reloadPins = async (): Promise<void> => {
  if (view.kind !== 'ready') return;
  const scopeDir = view.scope.directory;
  const stored = await pinStore.read(scopeDir);
  if (view.kind !== 'ready' || view.scope.directory !== scopeDir) return;
  view = { ...view, pins: stored.ok ? stored.pins : view.pins, pinsError: stored.ok ? null : stored.message };
  render();
};

const openPanel = () => { void host.openSurface('plugin:mise-inspector').catch(() => undefined); };

const unpin = (name: string) => {
  if (view.kind !== 'ready') return;
  const scopeDir = view.scope.directory;
  view = { ...view, pins: view.pins.filter((pin) => pin !== name) };
  render();
  pinStore.remove(scopeDir, name).catch(() => { void reloadPins(); void host.toast({ kind: 'error', message: 'Could not unpin the task.' }); });
};

const note = (markup: string, text: string, tone: '' | 'warn' = '', action?: HTMLElement) => h('div', { class: `snote ${tone}`.trim() },
  h('span', { html: markup, style: { display: 'contents' } }), h('span', { class: 'trunc' }, text), action ?? null);

const openButton = (label: string) => h('button', { class: 'btn ghost', on: { click: openPanel } }, label);

const render = (): void => {
  let content: HTMLElement;
  if (view.kind === 'empty') content = note(icon.folder, 'Open a project to see its pinned mise tasks.');
  else if (view.kind === 'loading') content = h('div', { class: 'status' }, ...[60, 45].map((width) => h('div', { class: 'skel', style: { height: '14px', width: `${width}%`, margin: '7px 6px' } })));
  else if (view.kind === 'problem') {
    const quiet = view.problem.code === 'invalid-scope';
    content = note(quiet ? icon.folder : icon.alert, quiet ? 'No git checkout or mise project here.' : `${view.problem.title}. ${view.problem.message}`, quiet ? '' : 'warn',
      quiet ? undefined : h('button', { class: 'btn', on: { click: () => { void load(); } } }, 'Retry'));
  } else if (view.pinsError) content = note(icon.alert, view.pinsError, 'warn');
  else if (!view.pins.length) content = note(icon.pin, `Nothing pinned in ${view.scope.name}.`, '', openButton('Open mise'));
  else {
    const { tasks, pins, scope, tasksError } = view;
    const byName = new Map((tasks ?? []).map((task) => [task.name, task]));
    content = h('div', { class: 'status' },
      ...pins.map((name) => {
        const task = byName.get(name);
        const missing = tasks !== null && !task;
        return h('div', {
          class: `srow ${missing ? 'missing' : ''}`.trim(),
          title: missing ? `${name} is no longer defined in ${scope.name}` : `${name} — open in the mise panel`,
          on: { click: openPanel },
        },
        h('span', { html: icon.pinFilled, style: { display: 'contents' } }),
        h('span', { class: 'name mono' }, name),
        h('span', { class: 'desc trunc' }, missing ? 'not defined here' : task?.description ?? ''),
        h('span', { class: 'tail' },
          task ? h('span', { class: `dot k-${task.source.kind}`, title: task.source.label ?? 'computed' }) : null,
          h('button', {
            class: 'iconbtn',
            title: `Unpin ${name}`,
            attrs: { 'aria-label': `Unpin ${name}` },
            html: icon.x,
            on: { click: (event) => { event.stopPropagation(); unpin(name); } },
          }),
        ),
        );
      }),
      tasksError ? note(icon.alert, `Tasks not read: ${tasksError}`, 'warn') : null,
      h('div', { class: 'sfoot' },
        h('span', { class: 'trunc mono' }, scope.branch ? `${scope.name} · ${scope.branch}` : scope.name),
        openButton('Open mise'),
      ),
    );
  }
  root.replaceChildren(content);
};

host.onReady((context) => { applyHostReady(context, document.documentElement); });

host.onDirectory((next) => {
  if (directorySeen && next === directory) return;
  directorySeen = true;
  directory = next;
  view = { kind: 'loading' };
  void load();
});

host.onServiceEvent((event) => {
  if (event.topic !== 'pins' || view.kind !== 'ready') return;
  if ((event.data as { directory?: unknown } | undefined)?.directory === view.scope.directory) void reloadPins();
});

trackHeight(root, (height) => { void host.setHeight(Math.max(28, height)).catch(() => undefined); });

render();
