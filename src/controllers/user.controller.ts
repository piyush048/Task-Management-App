import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services';

interface IRequest extends Request {
    user?: any;
}

export const getAllUsers = async (req : Request, res : Response, next : NextFunction): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req : IRequest, res: Response, next : NextFunction): Promise<void> => {
  try{
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ success: true, user});
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req : IRequest, res : Response, next : NextFunction): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};
