import { Request, Response, NextFunction } from 'express';
import * as projectService from '@/services';
import { AuthenticatedRequest } from '@/middlewares';
import { IProject } from '@/models';
import { HTTP_CODES } from '@/common';


export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: Partial<IProject> = {
      ...req.body,
      createdBy: req.user?.id,
    };
    const project = await projectService.createProject(data);
    res.status(HTTP_CODES.CREATED).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(HTTP_CODES.OK).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project){
        res.status(HTTP_CODES.NOT_FOUND).json({ success: false, message: 'Not found' });
        return;
    }
    res.status(HTTP_CODES.OK).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await projectService.updateProject(req.params.id, req.body);
    if (!updated){
        res.status(HTTP_CODES.NOT_FOUND).json({ success: false, message: 'Not found' });
        return;
    } 
    res.status(HTTP_CODES.OK).json({ success: true, project: updated });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted){
        res.status(HTTP_CODES.NOT_FOUND).json({ success: false, message: 'Not found' });
    }
    res.status(HTTP_CODES.OK).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
