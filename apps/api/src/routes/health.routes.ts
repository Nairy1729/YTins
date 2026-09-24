import { Router } from 'express';
import { errorProbe, getHealth } from '../controllers/health.controller.js';
import { isDev } from '../config/env.js';

export const healthRouter: Router = Router();

healthRouter.get('/', getHealth);

if (isDev) {
  healthRouter.get('/error-probe', errorProbe);
}