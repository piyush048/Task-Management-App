import { Router } from 'express';

import {authrouter} from './auth.routes';
import {userRouter} from './user.routes';
import {projectRouter} from './project.routes';
import {taskRouter} from './task.routes';

const v1router = Router();

v1router.use('/auth', authrouter);
v1router.use('/users', userRouter);
v1router.use('/projects', projectRouter);
v1router.use('/tasks', taskRouter);

export default v1router;
