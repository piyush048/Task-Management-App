import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (role: 'user' | 'admin') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      console.log(req.user, req.user?.role, role);
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    next();
  };
};
