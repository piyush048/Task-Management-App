import { Request, Response, NextFunction } from 'express';
import * as taskService from '@/services';
import { AuthenticatedRequest } from '@/middlewares';
import { ITask } from '@/models';

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: Partial<ITask> = {
      ...req.body,
      createdBy: req.user?.id,
    };
    const task = await taskService.createTask(data);
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};

export const getByIdTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task){
        res.status(404).json({ success: false, message: 'Not found' });
        return;
    }
    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body);
    if (!updated){
        res.status(404).json({ success: false, message: 'Not found' });
        return;
    }
    res.status(200).json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted){
        res.status(404).json({ success: false, message: 'Not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
