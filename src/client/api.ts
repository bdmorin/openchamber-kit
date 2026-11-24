import { HostRequestError, type connectHost } from '@openchamber/sdk';

import type { Failure, Inspection, Part } from '../shared/types.ts';

export type Host = ReturnType<typeof connectHost>;

export type Problem = {
  code: string;
  title: string;
  message: string;
  searched?: string[];
  /** Settings → Extensions is where the user fixes it. */
  settings?: boolean;
};

export type Answer<T> = { ok: true; data: T } | { ok: false; problem: Problem };

const HOST_PROBLEMS: Record<string, Omit<Problem, 'code'>> = {
  NO_SERVICE: { title: 'Local service not allowed', message: 'This extension reads mise through a local service. Allow it in Settings → Extensions.', settings: true },
  DISABLED: { title: 'Extension paused', message: 'Resume the mise extension in Settings → Extensions.', settings: true },
  SERVICE_FAILED: { title: 'The mise service did not start', message: 'The local service crashed or never became ready. Try again; if it keeps failing, check Settings → Extensions.' },
  REQUEST_FAILED: { title: 'No answer from the mise service', message: 'The request was sent but no usable answer came back.' },
  HOST_TIMEOUT: { title: 'mise took too long', message: 'OpenChamber stopped waiting for the mise service.' },
  RESPONSE_TOO_LARGE: { title: 'Too much output', message: 'The mise service answered with more than OpenChamber accepts.' },
};

const SERVICE_TITLES: Record<string, string> = {
  'invalid-scope': 'Nothing to inspect here',
  'bad-request': 'Nothing to inspect here',
  'no-git': 'git not found',
  'no-mise': 'mise not found',
  busy: 'mise is busy',
  unauthorized: 'Service refused the request',
  'not-found': 'Unknown operation',
};

const isFailure = (value: unknown): value is Failure => (
  typeof value === 'object' && value !== null && typeof (value as Failure).error?.code === 'string'
);

const call = async (host: Host, request: Parameters<Host['serviceRequest']>[0]): Promise<Answer<unknown>> => {
  let result: Awaited<ReturnType<Host['serviceRequest']>>;
  try {
    result = await host.serviceRequest(request);
  } catch (error) {
    const code = error instanceof HostRequestError ? error.code : 'HOST_UNAVAILABLE';
    const known = HOST_PROBLEMS[code];
    return { ok: false, problem: { code, ...(known ?? { title: 'OpenChamber is unavailable', message: error instanceof Error ? error.message : String(error) }) } };
  }
  let body: unknown;
  try { body = JSON.parse(result.body); } catch {
    return { ok: false, problem: { code: 'bad-answer', title: 'Unexpected answer', message: `The mise service answered HTTP ${result.status} with something that is not JSON.` } };
  }
  if (isFailure(body)) {
    const { code, message, searched } = body.error;
    return { ok: false, problem: { code, title: SERVICE_TITLES[code] ?? 'mise service error', message, searched } };
  }
  return { ok: true, data: body };
};

export const inspectDirectory = async (host: Host, directory: string, parts: Part[]): Promise<Answer<Inspection>> => {
  const answer = await call(host, { method: 'GET', path: '/inspect', query: { directory, parts: parts.join(',') } });
  if (!answer.ok) return answer;
  const data = answer.data as Inspection;
  if (typeof data?.scope?.directory !== 'string' || typeof data?.mise?.path !== 'string') {
    return { ok: false, problem: { code: 'bad-answer', title: 'Unexpected answer', message: 'The mise service answered in a shape this panel does not understand.' } };
  }
  return { ok: true, data };
};

export const announcePins = (host: Host, directory: string): void => {
  void host.serviceRequest({ method: 'POST', path: '/pins-changed', body: JSON.stringify({ directory }) }).catch(() => undefined);
};
