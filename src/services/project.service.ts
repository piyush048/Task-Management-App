import { Project, IProject } from '@/models';
import { redisClient, logger, publishToQueue } from '@/config';
import { updateRedisProject } from '@/utils';
import { ErrorMessages } from '@/common';

export const createProject = async (data: Partial<IProject>): Promise<IProject> => {
  const exitingProject = await Project.findOne({ name: data.name });
  if (exitingProject) {
    logger.error(ErrorMessages.PROJECT_EXISTS);
    throw new Error(ErrorMessages.PROJECT_EXISTS);
  }
  const project = new Project(data);
  const saved = await project.save();
  logger.info('Project created in MongoDB');

  await redisClient.set(`project:${saved._id}`, JSON.stringify(saved));
  logger.info('Project saved in Redis');
  // publishToQueue('project_logs', { type: 'PROJECT_CREATED', data: saved });
  
  return saved;
};

export const getAllProjects = async (): Promise<IProject[]> => {
  return await Project.find();
};

export const getProjectById = async (id: string): Promise<IProject | null> => {
  const cacheKey = `project:${id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const project = await Project.findById(id);
  if (project) await redisClient.set(cacheKey, JSON.stringify(project));
  return project;
};

export const updateProject = async (id: string, updates: Partial<IProject>): Promise<IProject | null> => {
  const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
  await updateRedisProject(`project:${id}`,updates);
  logger.info('Project updated in Redis');
  // if (updated) {
    
  //   publishToQueue('project_logs', { type: 'PROJECT_UPDATED', data: updated });
  // }
  return updated;
};

export const deleteProject = async (id: string): Promise<IProject | null> => {
  const deleted = await Project.findByIdAndDelete(id);
  if (deleted) {
    await redisClient.del(`project:${id}`);
    logger.info('Project deleted from Redis');
    // publishToQueue('project_logs', { type: 'PROJECT_DELETED', data: deleted });
  }
  return deleted;
};
