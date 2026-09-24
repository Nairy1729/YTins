import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { reelsRouter } from './reels.routes.js';
import { stylesRouter } from './styles.routes.js';
import { debugRouter } from './debug.routes.js';
import { isDev } from '../config/env.js';

export const apiRouter: Router = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/styles', stylesRouter);
apiRouter.use('/reels', reelsRouter);

if (isDev) apiRouter.use('/debug', debugRouter);