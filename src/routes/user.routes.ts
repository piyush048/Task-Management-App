import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers';
import { authMiddleware, validate, isAdmin } from '../middlewares';
import { updateUserSchema } from '../validations';

const UserRouter = Router();

UserRouter.get('/', authMiddleware,  isAdmin, getAllUsers);
UserRouter.get('/me', authMiddleware, getProfile);
UserRouter.patch('/update', authMiddleware, validate(updateUserSchema), updateProfile);

export {UserRouter}; 