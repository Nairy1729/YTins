import { Router } from 'express';
import { STYLE_CATALOG } from '@reverie/contracts';

export const stylesRouter: Router = Router();

stylesRouter.get('/', (_req, res) => {
  res.json(STYLE_CATALOG);
});