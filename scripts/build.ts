// Builds the committed bundles. OpenChamber installs this folder without
// building it, so panel/main.js, status/main.js and service/main.js are
// checked in next to their sources.
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const targets = [
  // Sandboxed iframes cannot load ES modules: one classic IIFE each.
  { entry: 'src/panel/main.ts', out: 'panel/main.js', node: false },
  { entry: 'src/status/main.ts', out: 'status/main.js', node: false },
  // The service runs under OpenChamber's Node runtime; built-ins stay external.
  { entry: 'src/service/main.ts', out: 'service/main.js', node: true },
];

for (const target of targets) {
  const result = await Bun.build({
    entrypoints: [resolve(root, target.entry)],
    format: target.node ? 'esm' : 'iife',
    target: target.node ? 'node' : 'browser',
    minify: !target.node,
  });
  const artifact = result.outputs[0];
  if (!result.success || !artifact) {
    console.error(result.logs.map((log) => String(log.message ?? log)).join('\n') || `Build failed: ${target.entry}`);
    process.exit(1);
  }
  await writeFile(resolve(root, target.out), await artifact.text());
  console.log(`${target.out.padEnd(18)} ${(artifact.size / 1024).toFixed(1)} KB`);
}
