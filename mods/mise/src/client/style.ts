// Every colour comes from the host theme (applyHostReady sets the --oc-*
// variables), so the bento follows light/dark and custom themes live.
export const BASE_CSS = /* css */ `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; background: var(--oc-bg); color: var(--oc-fg); }
body { font-family: var(--oc-font, system-ui, sans-serif); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--oc-focus, var(--oc-primary)); outline-offset: 1px; border-radius: 6px; }

/* Where a value came from. --k fills, --kt is readable text on neutral surfaces. */
.k-global   { --k: var(--oc-muted);   --kt: var(--oc-muted); }
.k-parent   { --k: var(--oc-info);    --kt: var(--oc-info-text); }
.k-root     { --k: var(--oc-primary); --kt: var(--oc-primary-text); }
.k-local    { --k: var(--oc-success); --kt: var(--oc-success-text); }
.k-other    { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.k-computed { --k: var(--oc-syntax-type, var(--oc-muted)); --kt: var(--oc-syntax-type, var(--oc-muted)); }
.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--k, var(--oc-muted));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--k, var(--oc-muted)) 16%, transparent); }

.mono { font-family: var(--oc-mono, ui-monospace, monospace); font-variant-ligatures: none; }
.muted { color: var(--oc-muted); }
.trunc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

.iconbtn { width: 26px; height: 26px; flex: none; display: inline-grid; place-items: center; border: 0; border-radius: 8px;
  background: transparent; color: var(--oc-muted); cursor: pointer; transition: background .12s, color .12s; }
.iconbtn:hover { background: var(--oc-hover); color: var(--oc-fg); }
.iconbtn svg { width: 15px; height: 15px; }
.iconbtn[disabled] { opacity: .45; cursor: default; }
.spin svg { animation: oc-spin .9s linear infinite; }
@keyframes oc-spin { to { transform: rotate(360deg); } }

.btn { height: 28px; padding: 0 12px; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;
  border: 1px solid var(--oc-border); background: var(--oc-elevated); font-size: .78em; font-weight: 550; cursor: pointer; }
.btn:hover { background: var(--oc-hover); }
.btn svg { width: 13px; height: 13px; }
.btn.ghost { border-color: transparent; background: transparent; color: var(--oc-muted); padding: 0 8px; }
.btn.ghost:hover { color: var(--oc-fg); background: var(--oc-hover); }

.chip { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px; border-radius: 6px; max-width: 100%;
  font-size: .72em; font-weight: 520; white-space: nowrap; background: var(--oc-muted-surface); color: var(--oc-fg); }
.chip svg { width: 12px; height: 12px; flex: none; }
.chip.t-warning { background: color-mix(in srgb, var(--oc-warning) 14%, transparent); color: var(--oc-warning-text); }
.chip.t-success { background: color-mix(in srgb, var(--oc-success) 14%, transparent); color: var(--oc-success-text); }
.chip.t-info    { background: color-mix(in srgb, var(--oc-info) 14%, transparent);    color: var(--oc-info-text); }
.chip.t-primary { background: color-mix(in srgb, var(--oc-primary) 14%, transparent); color: var(--oc-primary-text); }

.badge { display: inline-flex; align-items: center; height: 17px; padding: 0 6px; border-radius: 5px; font-size: .64em;
  font-weight: 650; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap;
  background: color-mix(in srgb, var(--k, var(--oc-muted)) 13%, transparent); color: var(--kt, var(--oc-muted)); }
.badge.warn { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.badge.ok { --k: var(--oc-success); --kt: var(--oc-success-text); }

.problem { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; padding: 10px 11px; border-radius: 10px;
  font-size: .78em; line-height: 1.45; background: color-mix(in srgb, var(--oc-warning) 10%, transparent); }
.problem > svg { width: 15px; height: 15px; margin-top: 1px; color: var(--oc-warning-text); }
.problem.error { background: color-mix(in srgb, var(--oc-error) 10%, transparent); }
.problem.error > svg { color: var(--oc-error-text); }
.problem b { display: block; font-weight: 620; margin-bottom: 1px; }
.problem pre { margin: 6px 0 0; font-family: var(--oc-mono, monospace); font-size: .92em; white-space: pre-wrap; word-break: break-word; color: var(--oc-muted); }

.skel { border-radius: 8px; background: linear-gradient(90deg, var(--oc-muted-surface) 0%,
  color-mix(in srgb, var(--oc-muted-surface) 35%, transparent) 50%, var(--oc-muted-surface) 100%);
  background-size: 200% 100%; animation: oc-shimmer 1.4s ease-in-out infinite; }
@keyframes oc-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .skel, .spin svg { animation: none; } }
`;

export const PANEL_CSS = /* css */ `
.wrap { container-type: inline-size; padding: 10px 10px 14px; }
.bento { display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr); }
.tile { position: relative; min-width: 0; padding: 12px; border-radius: 14px; background: var(--oc-elevated);
  border: 1px solid color-mix(in srgb, var(--oc-border) 70%, transparent); }
.tile.flush { padding: 0; overflow: hidden; }
.tile-head { display: flex; align-items: center; gap: 8px; min-height: 24px; margin-bottom: 8px; }
.eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: .68em; font-weight: 650; letter-spacing: .08em;
  text-transform: uppercase; color: var(--oc-muted); }
.eyebrow svg { width: 13px; height: 13px; }
.count { font-family: var(--oc-mono, monospace); font-size: .68em; font-variant-numeric: tabular-nums; color: var(--oc-muted);
  background: var(--oc-muted-surface); border-radius: 999px; padding: 1px 7px; }
.grow { flex: 1; }

/* Hero */
.hero { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 14px;
  background: radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--oc-primary) 11%, var(--oc-elevated)) 0%, var(--oc-elevated) 58%); }
.glyph { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center;
  background: color-mix(in srgb, var(--oc-primary) 15%, transparent); color: var(--oc-primary-text); }
.glyph svg { width: 21px; height: 21px; }
.glyph.monogram { font-size: 1.15em; font-weight: 680; letter-spacing: -.02em; }
.hero h1 { margin: 0; font-size: 1.22em; font-weight: 660; letter-spacing: -.018em; line-height: 1.2; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 6px; }
.path { margin-top: 7px; font-size: .72em; color: var(--oc-muted); }
.hero .actions { align-self: start; display: flex; gap: 2px; }

/* Stats strip */
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.stat { all: unset; cursor: pointer; padding: 10px 12px 11px; min-width: 0; transition: background .12s; }
.stat:hover { background: var(--oc-hover); }
.stat:focus-visible { outline: 2px solid var(--oc-focus, var(--oc-primary)); outline-offset: -2px; }
.stat + .stat { border-left: 1px solid color-mix(in srgb, var(--oc-border) 55%, transparent); }
.stat-num { font-size: 1.55em; font-weight: 640; letter-spacing: -.03em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.stat-label { margin-top: 3px; font-size: .7em; color: var(--oc-muted); display: flex; gap: 6px; align-items: baseline; }
.stat-note { color: var(--oc-warning-text); font-weight: 560; }
.stat.failed .stat-num { color: var(--oc-warning-text); }

/* Pinned */
.pinned { background: linear-gradient(180deg, color-mix(in srgb, var(--oc-primary) 6%, var(--oc-elevated)), var(--oc-elevated)); }
.pins { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.pin { display: grid; grid-template-columns: 14px minmax(0, 1fr) auto; gap: 8px; align-items: start; padding: 8px 6px 8px 9px; border-radius: 10px;
  text-align: left; cursor: pointer; background: color-mix(in srgb, var(--oc-primary) 6%, var(--oc-bg));
  border: 1px solid color-mix(in srgb, var(--oc-primary) 22%, transparent); transition: border-color .12s, background .12s; }
.pin:hover { border-color: color-mix(in srgb, var(--oc-primary) 45%, transparent); }
.pin > svg { width: 14px; height: 14px; margin-top: 1px; color: var(--oc-primary-text); }
.pin .name { font-size: .8em; font-weight: 580; }
.pin .desc { font-size: .72em; color: var(--oc-muted); margin-top: 1px; }
.pin.missing { border-style: dashed; background: transparent; border-color: var(--oc-border); }
.pin.missing > svg, .pin.missing .name { color: var(--oc-muted); }
.pin .iconbtn { width: 20px; height: 20px; opacity: 0; margin-top: -2px; }
.pin .iconbtn svg { width: 12px; height: 12px; }
.pin:hover .iconbtn, .pin .iconbtn:focus-visible { opacity: 1; }
.hint { padding: 11px 12px; border-radius: 10px; border: 1px dashed color-mix(in srgb, var(--oc-border) 90%, transparent);
  font-size: .76em; color: var(--oc-muted); line-height: 1.45; }

/* Tasks */
.search { display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 8px; margin-left: auto; width: min(200px, 52%);
  border-radius: 8px; background: var(--oc-bg); border: 1px solid color-mix(in srgb, var(--oc-border) 70%, transparent); }
.search:focus-within { border-color: var(--oc-focus, var(--oc-primary)); }
.search svg { width: 13px; height: 13px; color: var(--oc-muted); flex: none; }
.search input { all: unset; flex: 1; min-width: 0; font-size: .76em; color: var(--oc-fg); }
.search input::placeholder { color: var(--oc-muted); }
.tasks { display: grid; gap: 1px; margin: 0 -4px; }
.task { border-radius: 10px; }
.task.open { background: color-mix(in srgb, var(--oc-hover) 70%, transparent); }
.task.hidden-task .task-name { color: var(--oc-muted); }
.task.flash { animation: oc-flash 1.2s ease-out; }
@keyframes oc-flash { from { box-shadow: inset 0 0 0 1px var(--oc-primary); } to { box-shadow: inset 0 0 0 1px transparent; } }
.task-row { display: grid; grid-template-columns: 24px auto minmax(0, 1fr) auto; gap: 8px; align-items: center;
  padding: 4px 8px 4px 4px; border-radius: 10px; cursor: pointer; }
.task-row:hover { background: var(--oc-hover); }
.task-name { font-size: .8em; font-weight: 560; white-space: nowrap; }
.task-row .dot, .tool .dot { width: 6px; height: 6px; box-shadow: none; }
.task-full { font-size: .8em; line-height: 1.5; }
.task-desc { font-size: .76em; color: var(--oc-muted); }
.task-tail { display: flex; gap: 8px; align-items: center; }
.task-tail .chev { width: 14px; height: 14px; color: var(--oc-muted); transition: transform .15s; }
.task.open .chev { transform: rotate(90deg); }
.pinbtn { width: 24px; height: 24px; }
.pinbtn.on { color: var(--oc-primary-text); }
.task-body { display: grid; gap: 8px; padding: 2px 10px 11px 36px; }
.kv { display: grid; grid-template-columns: 68px minmax(0, 1fr); gap: 4px 10px; margin: 0; font-size: .74em; }
.kv dt { color: var(--oc-muted); }
.kv dd { margin: 0; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; min-width: 0; }
.kv .chip { font-family: var(--oc-mono, monospace); font-size: 1em; height: 18px; }
pre.script { margin: 0; padding: 8px 10px; border-radius: 8px; overflow-x: auto; white-space: pre; tab-size: 2;
  font-size: .74em; line-height: 1.6; background: var(--oc-bg); border: 1px solid color-mix(in srgb, var(--oc-border) 65%, transparent); }
pre.script .p { color: var(--oc-muted); user-select: none; }
.list-foot { display: flex; justify-content: center; padding-top: 6px; }
.none { padding: 14px 4px 6px; text-align: center; font-size: .78em; color: var(--oc-muted); }

/* Tools */
.tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
.tool { display: grid; gap: 3px; min-width: 0; padding: 9px 10px 10px; border-radius: 10px; background: var(--oc-bg);
  border: 1px solid color-mix(in srgb, var(--oc-border) 60%, transparent); }
.tool-name { display: flex; align-items: center; gap: 6px; font-size: .74em; font-weight: 600; }
.tool-req { margin-left: auto; font-size: .92em; font-weight: 450; color: var(--oc-muted); }
.tool-ver { font-size: .98em; font-weight: 560; letter-spacing: -.01em; }
.tool-state { font-size: .68em; color: var(--oc-muted); }
.tool-state.active { color: var(--oc-success-text); }
.tool-state.missing { color: var(--oc-warning-text); }

/* Config chain */
.chain { list-style: none; margin: 0; padding: 0; }
.chain li { position: relative; display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 10px; padding: 5px 0 7px; }
.chain li::before { content: ''; position: absolute; left: 5.5px; top: 17px; bottom: -6px; width: 1px;
  background: color-mix(in srgb, var(--oc-border) 85%, transparent); }
.chain li:last-child::before { display: none; }
.chain .dot { margin-top: 5px; }
.cfg-path { font-size: .78em; font-weight: 500; }
.cfg-meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; align-items: center; }
.cfg-tools { font-size: .7em; color: var(--oc-muted); margin-top: 3px; }

/* Footer */
.foot { display: grid; gap: 8px; padding: 10px 12px; font-size: .7em; color: var(--oc-muted); line-height: 1.45;
  background: transparent; border-style: dashed; }
.foot-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
.foot svg { width: 13px; height: 13px; flex: none; }
.foot .safe { display: inline-flex; gap: 6px; align-items: center; color: var(--oc-success-text); font-weight: 600; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 12px; }
.legend span { display: inline-flex; gap: 6px; align-items: center; }

/* Whole-panel states */
.state { display: grid; justify-items: center; gap: 8px; padding: 40px 22px; text-align: center; }
.state .glyph { width: 46px; height: 46px; border-radius: 14px; }
.state h2 { margin: 4px 0 0; font-size: 1em; font-weight: 640; letter-spacing: -.01em; }
.state p { margin: 0; max-width: 36ch; font-size: .8em; line-height: 1.5; color: var(--oc-muted); }
.state details { max-width: 100%; font-size: .72em; color: var(--oc-muted); text-align: left; }
.state details pre { margin: 6px 0 0; white-space: pre-wrap; word-break: break-all; }
.state.warn .glyph { background: color-mix(in srgb, var(--oc-warning) 14%, transparent); color: var(--oc-warning-text); }

/* Bento breakpoints follow the panel's own width. */
@container (min-width: 560px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .span-all { grid-column: 1 / -1; }
}
@container (min-width: 880px) {
  .bento { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .hero { grid-column: span 2; }
  .stats-tile { grid-column: span 1; }
  .stats-tile .stats { height: 100%; grid-template-columns: minmax(0, 1fr); grid-auto-rows: 1fr; }
  .stats-tile .stat { display: flex; align-items: baseline; gap: 10px; padding: 8px 14px; }
  .stats-tile .stat + .stat { border-left: 0; border-top: 1px solid color-mix(in srgb, var(--oc-border) 55%, transparent); }
  .stats-tile .stat-num { font-size: 1.3em; min-width: 1.6em; }
  .stats-tile .stat-label { margin-top: 0; }
  .tasks-tile { grid-column: span 2; grid-row: span 2; }
  .tools-tile, .configs-tile { grid-column: span 1; }
}
`;

export const STATUS_CSS = /* css */ `
body { background: transparent; }
.status { display: grid; gap: 2px; padding: 4px 6px 6px; }
.srow { display: grid; grid-template-columns: 14px auto minmax(0, 1fr) auto; gap: 8px; align-items: center; height: 28px;
  padding: 0 4px 0 6px; border-radius: 8px; cursor: pointer; }
.srow:hover { background: var(--oc-hover); }
.srow > svg { width: 13px; height: 13px; color: var(--oc-primary-text); }
.srow .name { font-size: .78em; font-weight: 560; }
.srow .desc { font-size: .74em; color: var(--oc-muted); }
.srow .tail { display: flex; align-items: center; gap: 4px; }
.srow .dot { width: 6px; height: 6px; box-shadow: none; }
.srow .iconbtn { width: 20px; height: 20px; opacity: 0; }
.srow .iconbtn svg { width: 12px; height: 12px; }
.srow:hover .iconbtn, .srow .iconbtn:focus-visible { opacity: 1; }
.srow.missing > svg, .srow.missing .name { color: var(--oc-muted); }
.snote { display: flex; align-items: center; gap: 8px; min-height: 28px; padding: 2px 6px; font-size: .76em; color: var(--oc-muted); }
.snote svg { width: 13px; height: 13px; flex: none; }
.snote.warn svg { color: var(--oc-warning-text); }
.snote .btn { margin-left: auto; height: 22px; padding: 0 8px; font-size: .95em; }
.sfoot { display: flex; align-items: center; gap: 6px; padding: 2px 6px 0; font-size: .7em; color: var(--oc-muted); }
.sfoot .btn { margin-left: auto; height: 22px; padding: 0 6px; font-size: 1em; }
`;

export const installStyle = (...sheets: string[]): void => {
  const style = document.createElement('style');
  style.textContent = sheets.join('\n');
  document.head.append(style);
};
