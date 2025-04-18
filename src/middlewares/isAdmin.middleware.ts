import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ErrorMessages, HTTP_CODES } from '../common';
import { userModel } from '../models';
import {redisClient, logger } from '../config';

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const userData = req.user;
  if(!userData){
    logger.error(ErrorMessages.UNAUTHORIZED);
    throw new Error(ErrorMessages.UNAUTHORIZED);
  }

  let userRole: string | undefined | null = await redisClient.get(`user:${userData!.id}`);
  if (!userRole) {
    const user = await userModel.findById(userData!.id);
    logger.info(`User role fetched from DB: ${user?.role}`);
    userRole = user?.role;
  }
  if (userRole !== 'admin') {
    res.status(HTTP_CODES.FORBIDDEN).json({ success: false, message: ErrorMessages.ADMIN_ERROR });
    return;
  }

  next();
};

