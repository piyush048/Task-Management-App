import { Router } from 'express';
import * as controller from '@/controllers';
import {authMiddleware, isAdmin, validate} from '@/middlewares';
import { createTaskSchema, updateTaskSchema } from '@/validations';


const taskRouter = Router();

taskRouter.post('/', authMiddleware, validate(createTaskSchema), controller.createTask);
taskRouter.get('/', authMiddleware, isAdmin, controller.getAllTasks);
taskRouter.get('/:id', authMiddleware, controller.getByIdTask);
taskRouter.patch('/:id', authMiddleware, validate(updateTaskSchema), controller.updateTask);
taskRouter.delete('/:id', authMiddleware, isAdmin, controller.removeTask);

export { taskRouter };
