import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '@/controllers';
import { authMiddleware, validate, isAdmin } from '@/middlewares';
import { updateUserSchema } from '@/validations';

const userRouter = Router();

userRouter.get('/', authMiddleware, isAdmin, getAllUsers);
userRouter.get('/me', authMiddleware, getProfile);
userRouter.patch('/update', authMiddleware, validate(updateUserSchema), updateProfile);

export {userRouter}; 