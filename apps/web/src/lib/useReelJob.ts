import { useEffect, useRef, useState } from 'react';
import { jobSnapshotSchema } from '@reverie/contracts';
import type { JobSnapshot } from '@reverie/contracts';
import { api, ApiRequestError } from './api';

const TERMINAL = ['completed', 'failed'];
const POLL_MS = 2000;

export interface ReelJobState {
  snapshot: JobSnapshot | null;
  loading: boolean;
  error: string | null;
}

/**
 * Streams job progress over SSE, falling back to polling if the stream drops.
 * The user is never left without progress information.
 */
export function useReelJob(jobId: string | undefined): ReelJobState {
  const [snapshot, setSnapshot] = useState<JobSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const closed = useRef(false);

  useEffect(() => {
    if (!jobId) return;

    closed.current = false;
    let source: EventSource | null = null;
    let poller: number | undefined;

    const finish = () => {
      closed.current = true;
      source?.close();
      if (poller) window.clearInterval(poller);
    };

    const apply = (next: JobSnapshot) => {
      setSnapshot(next);
      setLoading(false);
      if (TERMINAL.includes(next.state)) finish();
    };

    const startPolling = () => {
      if (closed.current || poller) return;
      poller = window.setInterval(() => {
        api
          .getReel(jobId)
          .then(apply)
          .catch(() => undefined);
      }, POLL_MS);
    };

    const startStream = () => {
      source = new EventSource(api.reelEventsUrl(jobId));

      source.onmessage = (event) => {
        const parsed = jobSnapshotSchema.safeParse(JSON.parse(event.data as string));
        if (parsed.success) apply(parsed.data);
      };

      source.onerror = () => {
        source?.close();
        if (!closed.current) startPolling();
      };
    };

    // Confirm the job exists first so a bad id produces a real message.
    api
      .getReel(jobId)
      .then((initial) => {
        apply(initial);
        if (!TERMINAL.includes(initial.state)) startStream();
      })
      .catch((err: unknown) => {
        setLoading(false);
        setError(
          err instanceof ApiRequestError ? err.message : 'We could not load this reel.',
        );
      });

    return finish;
  }, [jobId]);

  return { snapshot, loading, error };
}