import { Router } from 'express';
import * as controller from '../controllers';
import {authMiddleware, validate, isAdmin} from '../middlewares';
import { createProjectSchema, updateProjectSchema } from '../validations';

const projectRouter = Router();

projectRouter.post('/', authMiddleware,  validate(createProjectSchema), controller.create);
projectRouter.get('/', authMiddleware, isAdmin, controller.getAll);
projectRouter.get('/:id', authMiddleware, controller.getById);
projectRouter.patch('/:id', authMiddleware, validate(updateProjectSchema), controller.update);
projectRouter.delete('/:id', authMiddleware, isAdmin, controller.remove);

export { projectRouter };
