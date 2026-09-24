import type { RequestHandler } from 'express';
import { isStyleAvailable } from '@reverie/contracts';
import type { CreateReelRequest } from '@reverie/contracts';
import { jobStore } from '../jobs/job-store.js';
import { runPipeline } from '../jobs/pipeline.js';
import { AppError } from '../lib/app-error.js';
import { env } from '../config/env.js';

interface ReelParams {
  id: string;
}

export const createReel: RequestHandler = (req, res, next) => {
  const input = req.body as CreateReelRequest;

  if (!isStyleAvailable(input.styleId)) {
    next(
      new AppError('BAD_REQUEST', 'Style not available: ' + input.styleId, {
        status: 400,
        userMessage: 'That style is not available yet. Try Pen & Ink or Minimal Type.',
        recoverable: true,
      }),
    );
    return;
  }

  // The simulate flag is a development and test affordance only.
  const allowSimulate = env.NODE_ENV !== 'production';
  const sanitised: CreateReelRequest = allowSimulate ? input : { ...input, simulate: undefined };

  const job = jobStore.create(sanitised);
  const snapshot = jobStore.snapshot(job);

  // Defer so the 202 response describes the job as created, not mid-flight.
  setImmediate(() => {
    void runPipeline(job.id);
  });

  res.status(202).json(snapshot);
};

export const getReel: RequestHandler<ReelParams> = (req, res, next) => {
  const job = jobStore.get(req.params.id);

  if (!job) {
    next(AppError.notFound('No job with id ' + req.params.id, 'That reel could not be found.'));
    return;
  }

  res.json(jobStore.snapshot(job));
};

export const getScenePlan: RequestHandler<ReelParams> = (req, res, next) => {
  const job = jobStore.get(req.params.id);

  if (!job) {
    next(AppError.notFound('No job with id ' + req.params.id, 'That reel could not be found.'));
    return;
  }

  if (!job.scenePlan) {
    next(
      new AppError('BAD_REQUEST', 'Scene plan not yet generated for job ' + req.params.id, {
        status: 404,
        userMessage: 'The visual direction for this reel is still being generated.',
        recoverable: true,
      }),
    );
    return;
  }

  res.json(job.scenePlan);
};

export const streamReel: RequestHandler<ReelParams> = (req, res, next) => {
  const id = req.params.id;
  const job = jobStore.get(id);

  if (!job) {
    next(AppError.notFound('No job with id ' + id, 'That reel could not be found.'));
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (snapshot: unknown) => {
    res.write('data: ' + JSON.stringify(snapshot) + '\n\n');
  };

  send(jobStore.snapshot(job));

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15000);

  const unsubscribe = jobStore.subscribe(id, (snapshot) => {
    send(snapshot);
    if (jobStore.isTerminal(snapshot.state)) {
      unsubscribe();
      clearInterval(heartbeat);
      res.end();
    }
  });

  req.on('close', () => {
    unsubscribe();
    clearInterval(heartbeat);
  });
};