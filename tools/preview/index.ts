// Renders a mod's frames in headless Chromium against a mock OpenChamber host,
// so layout and typography can be reviewed in both themes and at several
// widths before installing. Dev-only; nothing here ships in a mod.
//
//   import { bundle, page, shoot } from '../../../tools/preview/index.ts';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { chromium } from 'playwright';

import { themes, type ThemeName } from './themes.ts';

export { themes, type ThemeName };

/** Builds a frame entry as an IIFE with @openchamber/sdk swapped for the mock. */
export const bundle = async (entry: string): Promise<string> => {
  const result = await Bun.build({
    entrypoints: [resolve(entry)],
    format: 'iife',
    target: 'browser',
    plugins: [{
      name: 'mock-openchamber-sdk',
      setup(build) {
        build.onResolve({ filter: /^@openchamber\/sdk$/ }, () => ({ path: resolve(import.meta.dir, 'mock-sdk.ts') }));
      },
    }],
  });
  if (!result.success || !result.outputs[0]) throw new Error(result.logs.map(String).join('\n') || `bundle failed: ${entry}`);
  return result.outputs[0].text();
};

export type MockHost = {
  surface: 'panel' | 'status' | 'page' | 'dialog';
  theme: ThemeName;
  directory: string | null;
  /** Answers serviceRequest; return [status, JSON body]. Runs in the page, so it must be self-contained. */
  service: string;
  /** Initial host.storage contents. */
  storage?: Record<string, unknown>;
  /** Extra script run 300 ms after load, e.g. to open a row. */
  after?: string;
};

/** A self-contained HTML page: mock host, then the bundle. */
export const page = (script: string, host: MockHost): string => `<!doctype html><html><head><meta charset="utf-8"></head>
<body><div id="root"></div>
<script>
const store = ${JSON.stringify(host.storage ?? {})};
const service = ${host.service};
window.__mockHost = {
  onReady(fn) { fn({ theme: { mode: ${JSON.stringify(host.theme)}, tokens: ${JSON.stringify(themes[host.theme])} }, surface: ${JSON.stringify(host.surface)}, features: {}, locale: 'en' }); },
  onDirectory(fn) { fn(${JSON.stringify(host.directory)}); },
  onSession() {}, onServiceEvent() {}, onSessionLifecycle() {}, onStatusControl() {},
  serviceRequest: async (req) => { const [status, body] = await service(req); return { status, body: JSON.stringify(body) }; },
  storage: { get: async (k) => store[k], set: async (k, v) => { store[k] = v; }, delete: async (k) => { delete store[k]; }, keys: async () => Object.keys(store).sort() },
  toast: async () => {}, setHeight: async () => {}, openSurface: async () => {}, openUrl: async () => {}, writeClipboard: async () => {},
};
</script>
<script>${script.replace(/<\/script/gi, '<\\/script')}</script>
${host.after ? `<script>setTimeout(() => { ${host.after} }, 300);</script>` : ''}
</body></html>`;

export type Shot = { name: string; html: string; width: number };

/** Writes each page to outDir and screenshots it full-page at 2x. Returns page errors per shot. */
export const shoot = async (shots: Shot[], outDir: string): Promise<Record<string, string[]>> => {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const errors: Record<string, string[]> = {};
  try {
    for (const shot of shots) {
      const file = join(outDir, `${shot.name}.html`);
      writeFileSync(file, shot.html);
      const tab = await browser.newPage({ viewport: { width: shot.width, height: 900 }, deviceScaleFactor: 2 });
      const found: string[] = [];
      tab.on('pageerror', (error) => found.push(String(error)));
      tab.on('console', (message) => { if (message.type() === 'error') found.push(message.text()); });
      await tab.goto(`file://${file}`);
      await tab.waitForTimeout(700);
      await tab.screenshot({ path: join(outDir, `${shot.name}.png`), fullPage: true });
      errors[shot.name] = found;
      await tab.close();
    }
  } finally {
    await browser.close();
  }
  return errors;
};
