import { describe, expect, test } from 'bun:test';

import { classify } from '../src/service/inspect.ts';
import { configDir, kindOf, normalizeConfigs, normalizeTasks, normalizeTools, parseTrust } from '../src/service/normalize.ts';
import { stderrTail } from '../src/service/run.ts';

const where = { home: '/Users/me', root: '/Users/me/src/app', directory: '/Users/me/src/app' };

describe('source kinds', () => {
  test('configDir strips config folders', () => {
    expect(configDir('/Users/me/src/app/.config/mise/config.toml')).toBe('/Users/me/src/app');
    expect(configDir('/Users/me/src/app/.mise/tasks/deploy')).toBe('/Users/me/src/app');
    expect(configDir('/Users/me/src/app/mise.toml')).toBe('/Users/me/src/app');
  });
  test('classifies global, parent, root, local, other, computed', () => {
    expect(kindOf('/Users/me/.config/mise/config.toml', where)).toBe('global');
    expect(kindOf('/Users/me/.mise.local.toml', where)).toBe('global');
    expect(kindOf('/Users/me/src/mise.toml', where)).toBe('parent');
    expect(kindOf('/Users/me/src/app/mise.toml', where)).toBe('root');
    expect(kindOf('/Users/me/src/app/.mise/tasks/x', where)).toBe('root');
    expect(kindOf('/Users/me/src/app/pkg/mise.toml', where)).toBe('local');
    expect(kindOf('/opt/elsewhere/mise.toml', where)).toBe('other');
    expect(kindOf(null, where)).toBe('computed');
  });
});

describe('tasks', () => {
  const raw = [
    {
      name: 'build', aliases: ['b'], description: 'Build it', source: '/Users/me/src/app/mise.toml',
      dir: '/Users/me/src/app', run: ['cargo build', { task: 'gen' }], depends: ['gen'], hide: false, file: null,
      env: [['TOKEN', 'super-secret']], secrets: ['API_KEY'],
    },
    { name: 'deploy', source: '/Users/me/src/app/.mise/tasks/deploy', file: '/Users/me/src/app/.mise/tasks/deploy', run: [] },
  ];
  test('keeps the definition, drops env and secrets', () => {
    const tasks = normalizeTasks(raw, where);
    expect(tasks.map((task) => task.name)).toEqual(['build', 'deploy']);
    expect(tasks[0]).toMatchObject({ aliases: ['b'], dir: '.', run: ['cargo build', '{"task":"gen"}'], depends: ['gen'], file: false });
    expect(tasks[0]?.source).toEqual({ kind: 'root', path: '/Users/me/src/app/mise.toml', label: 'mise.toml' });
    expect(tasks[1]?.file).toBe(true);
    expect(JSON.stringify(tasks)).not.toContain('super-secret');
    expect(JSON.stringify(tasks)).not.toContain('API_KEY');
  });
  test('caps long scripts', () => {
    const [task] = normalizeTasks([{ name: 'long', run: [Array.from({ length: 80 }, (_, i) => `echo ${i}`).join('\n')] }], where);
    expect(task?.run.length).toBe(40);
    expect(task?.runTruncated).toBe(true);
  });
  test('rejects non-lists', () => {
    expect(() => normalizeTasks({}, where)).toThrow();
  });
});

describe('tools and configs', () => {
  test('flattens mise ls --current', () => {
    const tools = normalizeTools({
      node: [{ version: '22.1.0', requested_version: '22', installed: true, active: true, install_path: '/x', source: { type: 'mise.toml', path: '/Users/me/src/app/mise.toml' } }],
      jq: [{ version: '1.8.2', requested_version: 'latest', installed: false, active: false, source: { path: '/Users/me/.config/mise/config.toml' } }],
    }, where);
    expect(tools.map((tool) => [tool.name, tool.version, tool.installed, tool.source.kind])).toEqual([
      ['jq', '1.8.2', false, 'global'],
      ['node', '22.1.0', true, 'root'],
    ]);
    expect(JSON.stringify(tools)).not.toContain('install_path');
  });
  test('orders configs global first and attaches trust', () => {
    const trust = parseTrust('~: trusted\n~/src/app: untrusted\n', '/Users/me');
    expect(trust.get('/Users/me/src/app')).toBe('untrusted');
    const configs = normalizeConfigs([
      { path: '/Users/me/src/app/mise.toml', tools: ['node'] },
      { path: '/Users/me/.config/mise/config.toml', tools: ['rust'] },
    ], trust, where);
    expect(configs.map((config) => [config.source.kind, config.trust])).toEqual([['global', 'trusted'], ['root', 'untrusted']]);
  });
});

describe('failures', () => {
  const result = (stderr: string, code = 1) => ({ code, stdout: '', stderr, timedOut: false, overflow: false, spawnError: null });
  test('safe-mode refusal is its own state', () => {
    expect(classify(result('mise ERROR error: exec() is disabled in safe mode (MISE_SAFE=1)'))?.code).toBe('safe-mode-refused');
  });
  test('timeouts and overflow are reported as such', () => {
    expect(classify({ ...result(''), timedOut: true })?.code).toBe('timeout');
    expect(classify({ ...result(''), overflow: true })?.code).toBe('output-too-large');
  });
  test('stderr tail drops code frames and boilerplate', () => {
    const tail = stderrTail([
      'mise ERROR error parsing config file: ~/x/mise.toml',
      'mise ERROR error: exec() is disabled in safe mode (MISE_SAFE=1)',
      ' --> __tera_one_off:1:11',
      '  |',
      '1 | python {{ exec() }}',
      'mise ERROR Version: 2026.11.0 macos-arm64 (2026-11-03)',
      'mise ERROR Run with --verbose or MISE_VERBOSE=1 for more information',
    ].join('\n'));
    expect(tail).toBe('error parsing config file: ~/x/mise.toml\nerror: exec() is disabled in safe mode (MISE_SAFE=1)');
  });
});
