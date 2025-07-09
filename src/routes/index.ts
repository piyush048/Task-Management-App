import { Router } from 'express';

import v1router from './v1/routes';

const routes = Router();
//  version 1 routes
routes.use('/v1', v1router);

export default routes;
