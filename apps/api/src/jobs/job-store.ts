import { EventEmitter } from 'node:events';
import { nanoid } from 'nanoid';
import { JOB_STAGE_LABELS } from '@reverie/contracts';
import type {
  ApiError,
  CreateReelRequest,
  JobSnapshot,
  JobState,
  Lyrics,
  LyricsSummary,
  ScenePlan,
  Timeline,
  TimelineSummary,
  Track,
} from '@reverie/contracts';

const TERMINAL: JobState[] = ['completed', 'failed'];
const RETENTION_MS = 30 * 60 * 1000;

export interface JobRecord {
  id: string;
  state: JobState;
  progress: number;
  detail?: string;
  input: CreateReelRequest;
  track?: Track;
  /** Full lyrics stay server side. Only the summary is exposed. */
  lyrics?: Lyrics;
  audioPath?: string;
  outputUrl?: string;
  error?: ApiError;
  createdAt: number;
  updatedAt: number;
  /** Full timeline stays server side. Only the summary is exposed. */
  timeline?: Timeline;
  /** Generated ScenePlan from AI Visual Director */
  scenePlan?: ScenePlan;
}

function toLyricsSummary(lyrics: Lyrics): LyricsSummary {
  return {
    source: lyrics.source,
    synced: lyrics.synced,
    instrumental: lyrics.instrumental,
    lineCount: lyrics.lineCount,
    matchedTitle: lyrics.matchedTitle,
    matchedArtist: lyrics.matchedArtist,
  };
}

function toTimelineSummary(timeline: Timeline): TimelineSummary {
  return {
    kind: timeline.kind,
    lineCount: timeline.lineCount,
    segmentLineCount: timeline.segmentLineCount,
    totalDurationMs: timeline.totalDurationMs,
    segment: timeline.segment,
  };
}

class JobStore {
  private readonly jobs = new Map<string, JobRecord>();
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(0);
    setInterval(() => this.prune(), 5 * 60 * 1000).unref();
  }

  create(input: CreateReelRequest): JobRecord {
    const now = Date.now();
    const job: JobRecord = {
      id: nanoid(12),
      state: 'queued',
      progress: 0,
      input,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.id, job);
    return job;
  }

  get(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  update(id: string, patch: Partial<Omit<JobRecord, 'id' | 'createdAt'>>): JobRecord | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    if (TERMINAL.includes(job.state)) return job;

    Object.assign(job, patch, { updatedAt: Date.now() });
    this.emitter.emit(id, this.snapshot(job));
    return job;
  }

  isTerminal(state: JobState): boolean {
    return TERMINAL.includes(state);
  }

  subscribe(id: string, listener: (snapshot: JobSnapshot) => void): () => void {
    this.emitter.on(id, listener);
    return () => this.emitter.off(id, listener);
  }

  snapshot(job: JobRecord): JobSnapshot {
    return {
      jobId: job.id,
      state: job.state,
      progress: Number(job.progress.toFixed(3)),
      stageLabel: JOB_STAGE_LABELS[job.state],
      ...(job.detail ? { detail: job.detail } : {}),
      ...(job.track ? { track: job.track } : {}),
      ...(job.lyrics ? { lyrics: toLyricsSummary(job.lyrics) } : {}),
      ...(job.timeline ? { timeline: toTimelineSummary(job.timeline) } : {}),
      ...(job.scenePlan ? { scenePlan: job.scenePlan } : {}),
      createdAt: new Date(job.createdAt).toISOString(),
      updatedAt: new Date(job.updatedAt).toISOString(),
      ...(job.outputUrl ? { outputUrl: job.outputUrl } : {}),
      ...(job.error ? { error: job.error } : {}),
    };
  }

  private prune(): void {
    const cutoff = Date.now() - RETENTION_MS;
    for (const [id, job] of this.jobs) {
      if (TERMINAL.includes(job.state) && job.updatedAt < cutoff) this.jobs.delete(id);
    }
  }
}

export const jobStore = new JobStore();