import { Router } from 'express';
import { createReelRequestSchema } from '@reverie/contracts';
import { createReel, getReel, getScenePlan, streamReel } from '../controllers/reels.controller.js';
import { validateBody } from '../middleware/validate.js';
import { rateLimit } from '../middleware/rate-limit.js';

export const reelsRouter: Router = Router();

reelsRouter.post('/', rateLimit(10, 60_000), validateBody(createReelRequestSchema), createReel);
reelsRouter.get('/:id', getReel);
reelsRouter.get('/:id/scene-plan', getScenePlan);
reelsRouter.get('/:id/events', streamReel);