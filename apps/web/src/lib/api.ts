import { healthResponseSchema, jobSnapshotSchema } from '@reverie/contracts';
import type {
  CreateReelRequest,
  HealthResponse,
  JobSnapshot,
  StyleCatalogEntry,
} from '@reverie/contracts';

const BASE = '/api';

export class ApiRequestError extends Error {
  readonly code: string;
  readonly recoverable: boolean;

  constructor(code: string, userMessage: string, recoverable: boolean) {
    super(userMessage);
    this.name = 'ApiRequestError';
    this.code = code;
    this.recoverable = recoverable;
  }
}

interface ErrorEnvelope {
  error?: { code?: string; userMessage?: string; recoverable?: boolean };
}

async function request<T>(
  path: string,
  parse: (value: unknown) => T,
  init?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (init?.body) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(BASE + path, { ...init, headers });
  } catch {
    throw new ApiRequestError('NETWORK', 'Could not reach the server.', true);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const envelope = payload as ErrorEnvelope | null;
    throw new ApiRequestError(
      envelope?.error?.code ?? 'INTERNAL_ERROR',
      envelope?.error?.userMessage ?? 'Something went wrong.',
      envelope?.error?.recoverable ?? false,
    );
  }

  return parse(payload);
}

export const api = {
  health: (): Promise<HealthResponse> => request('/health', (v) => healthResponseSchema.parse(v)),

  styles: (): Promise<StyleCatalogEntry[]> =>
    request('/styles', (v) => v as StyleCatalogEntry[]),

  createReel: (input: CreateReelRequest): Promise<JobSnapshot> =>
    request('/reels', (v) => jobSnapshotSchema.parse(v), {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getReel: (jobId: string): Promise<JobSnapshot> =>
    request('/reels/' + jobId, (v) => jobSnapshotSchema.parse(v)),

  reelEventsUrl: (jobId: string): string => BASE + '/reels/' + jobId + '/events',
};