import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { createApp } from '../app.js';

interface Snapshot {
  jobId: string;
  state: string;
  progress: number;
  stageLabel: string;
  scenePlan?: {
    styleId: string;
    scenes: unknown[];
  };
}

interface ErrorBody {
  error: { code: string; userMessage: string; recoverable: boolean };
}

interface StyleEntry {
  id: string;
  displayName: string;
  available: boolean;
}

let server: Server;
let base = '';

const VALID = {
  url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  styleId: 'pen-ink',
};

async function readJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

function post(body: unknown): Promise<Response> {
  return fetch(base + '/api/reels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeAll(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address !== null ? address.port : 0;
  base = 'http://127.0.0.1:'+port;
});

afterAll(() => {
  server.close();
});

describe('POST /api/reels', () => {
  it('creates a job for a valid request', async () => {
    const res = await post(VALID);
    expect(res.status).toBe(202);

    const body = await readJson<Snapshot>(res);
    expect(body.jobId).toBeTruthy();
    expect(body.state).toBe('queued');
  });

  it('accepts a shorts link', async () => {
    const res = await post({ ...VALID, url: 'https://youtu.be/dQw4w9WgXcQ?t=12'});
    expect(res.status).toBe(202);
  });

  it('rejects a non youtube url', async () => {
    const res = await post({ ...VALID, url: 'https://vimeo.com/123'});
    expect(res.status).toBe(400);

    const body = await readJson<ErrorBody>(res);
    expect(body.error.code).toBe('VALIDATION_FAILED');
  });

  it('rejects an unavailable style', async () => {
    const res = await post({ ...VALID, styleId: 'lyrical-animation' });
    expect(res.status).toBe(400);

    const body = await readJson<ErrorBody>(res);
    expect(body.error.recoverable).toBe(true);
  });


  it('rejects a malformed body', async () => {
    const res = await post({ nonsense: true });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/reels/:id', () => {
  it('returns 404 for an unknown job', async () => {
    const res = await fetch(base + '/api/reels/does-not-exist');
    expect(res.status).toBe(404);

    const body = await readJson<ErrorBody>(res);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('progresses a job to completion', async () => {
    const created = await readJson<Snapshot>(await post(VALID));

    let state = 'queued';
    for (let i = 0; i < 40 && state !== 'completed'; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const snap = await readJson<Snapshot>(await fetch(base + '/api/reels/' + created.jobId));
      state = snap.state;
    }

    expect(state).toBe('completed');

    const finalSnap = await readJson<Snapshot>(await fetch(base + '/api/reels/' + created.jobId));
    expect(finalSnap.scenePlan).toBeDefined();
    expect(finalSnap.scenePlan?.scenes.length).toBeGreaterThan(0);

    const planRes = await fetch(base + '/api/reels/' + created.jobId + '/scene-plan');
    expect(planRes.status).toBe(200);
    const planBody = (await planRes.json()) as { styleId: string };
    expect(planBody.styleId).toBe('pen-ink');
  });

  it('reports a failed job when failure is simulated', async () => {
    const created = await readJson<Snapshot>(await post({ ...VALID, simulate: 'failure' }));

    let state = 'queued';
    for (let i = 0; i < 40 && state !== 'failed' && state !== 'completed'; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const snap = await readJson<Snapshot>(await fetch(base + '/api/reels/' + created.jobId));
      state = snap.state;
    }

    expect(state).toBe('failed');
  });
});

describe('GET /api/styles', () => {
  it('returns the catalog', async () => {
    const res = await fetch(base + '/api/styles');
    expect(res.status).toBe(200);

    const body = await readJson<StyleEntry[]>(res);
    expect(Array.isArray(body)).toBe(true);
    expect(body.some((entry) => entry.id === 'pen-ink' && entry.available)).toBe(true);
  });
});