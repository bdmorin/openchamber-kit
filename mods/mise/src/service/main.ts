// Read-only mise service. OpenChamber starts it on the first serviceRequest
// and proxies the panel and status frames to it on loopback. It exposes a
// fixed set of operations, never a command endpoint:
//
//   GET  /health                      readiness probe
//   GET  /doctor                      where mise and git were found
//   GET  /inspect?directory=&parts=   tasks | tools | configs for one checkout
//   POST /pins-changed {directory}    tells open frames to re-read pins
import http from 'node:http';
import { homedir } from 'node:os';

import { createServiceHost } from '@openchamber/sdk';

import { PARTS, type Failure, type MiseInfo, type Part } from '../shared/types.ts';
import { fallbackCandidates, findProgram, pathEntries } from './discover.ts';
import { Limiter, inspect, miseEnv, readVersion } from './inspect.ts';
import { resolveScope } from './scope.ts';

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
const token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';
if (!port || !token) {
  console.error('OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required');
  process.exit(1);
}

const home = process.env.HOME || homedir();
const env = miseEnv(process.env);
const gitEnv: Record<string, string> = {
  PATH: env.PATH ?? '/usr/bin:/bin',
  HOME: home,
  GIT_OPTIONAL_LOCKS: '0',
  GIT_TERMINAL_PROMPT: '0',
  LC_ALL: 'C',
};
const limiter = new Limiter(4, 24);
const versions = new Map<string, Promise<string | null>>();
const host = createServiceHost({ env: process.env });

const send = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};
const failure = (res: http.ServerResponse, status: number, code: Failure['error']['code'], message: string, extra: Partial<Failure['error']> = {}) => {
  send(res, status, { error: { code, message, ...extra } } satisfies Failure);
};

const findMise = async (): Promise<{ mise: MiseInfo | null; searched: string[] }> => {
  const { found, searched } = findProgram('mise', process.env, fallbackCandidates(home));
  if (!found) return { mise: null, searched };
  if (!versions.has(found.path)) versions.set(found.path, readVersion(found.path, env, home));
  return { mise: { path: found.path, via: found.via, version: await versions.get(found.path)! }, searched };
};

const findGit = () => findProgram('git', process.env, ['/usr/bin/git', '/opt/homebrew/bin/git', '/usr/local/bin/git']).found;

const readBody = (req: http.IncomingMessage, max = 16 * 1024): Promise<string | null> => new Promise((resolve) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk: string) => {
    body += chunk;
    if (body.length > max) { resolve(null); req.destroy(); }
  });
  req.on('end', () => resolve(body));
  req.on('error', () => resolve(null));
});

const parseParts = (value: string | null): Part[] | null => {
  if (!value) return [...PARTS];
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  if (!parts.length || parts.some((part) => !(PARTS as readonly string[]).includes(part))) return null;
  return [...new Set(parts)] as Part[];
};

const handle = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.headers.authorization !== `Bearer ${token}`) return failure(res, 401, 'unauthorized', 'Unauthorized.');
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');

  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });

  if (req.method === 'GET' && url.pathname === '/doctor') {
    const { mise, searched } = await findMise();
    return send(res, 200, { mise, git: findGit()?.path ?? null, path: pathEntries(process.env), searched, safe: true });
  }

  if (req.method === 'GET' && url.pathname === '/inspect') {
    const parts = parseParts(url.searchParams.get('parts'));
    if (!parts) return failure(res, 400, 'bad-request', 'Unknown part requested.');
    const git = findGit();
    if (!git) return failure(res, 503, 'no-git', 'git was not found on the OpenChamber server, so the checkout cannot be identified.');
    const scope = await resolveScope(url.searchParams.get('directory'), { git: git.path, env: gitEnv, home });
    if (!scope.ok) return send(res, scope.failure.error.code === 'bad-request' ? 400 : 422, scope.failure);
    const { mise, searched } = await findMise();
    if (!mise) {
      return failure(res, 503, 'no-mise', 'mise was not found by the OpenChamber service. Install it, or make sure it is on the PATH OpenChamber starts with.', { searched });
    }
    if (limiter.saturated) return failure(res, 503, 'busy', 'Too many mise reads are queued. Try again in a moment.');
    return send(res, 200, await inspect(scope.scope, parts, { mise, env, home, limiter }));
  }

  if (req.method === 'POST' && url.pathname === '/pins-changed') {
    const raw = await readBody(req);
    let directory: unknown = null;
    try { directory = raw ? (JSON.parse(raw) as { directory?: unknown }).directory : null; } catch { /* handled below */ }
    if (typeof directory !== 'string' || directory.length === 0 || directory.length > 4096) {
      return failure(res, 400, 'bad-request', 'directory is required.');
    }
    try {
      await host.emit('pins', { directory });
      return send(res, 200, { ok: true });
    } catch {
      // Frames still refresh on their own; a missed broadcast is not an error for the caller.
      return send(res, 200, { ok: false });
    }
  }

  return failure(res, 404, 'not-found', 'Not found.');
};

http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    if (!res.headersSent) failure(res, 500, 'bad-request', 'The mise service failed unexpectedly.');
  });
}).listen(port, '127.0.0.1');
