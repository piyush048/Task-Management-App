import { Task, ITask } from '../models';
import { redisClient, logger, publishToQueue } from '../config';
import { ErrorMessages } from '../common';

const CACHE_EXPIRATION = 300;

export const createTask = async (data: Partial<ITask>): Promise<ITask> => {
  const task = new Task(data);
  const exitingTask = await Task.findOne({ title: data.title });
  if (exitingTask) {
    logger.error(ErrorMessages.TASK_EXISTS);
    throw new Error(ErrorMessages.TASK_EXISTS);
  }
  const saved = await task.save();
  publishToQueue('task_logs', { type: 'TASK_CREATED', data: saved });
  return saved;
};

export const getAllTasks = async (): Promise<ITask[]> => {
  return await Task.find();
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  const cacheKey = `task:${id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const task = await Task.findById(id);
  if (task) await redisClient.set(cacheKey, JSON.stringify(task), { EX: CACHE_EXPIRATION });
  return task;
};

export const updateTask = async (id: string, updates: Partial<ITask>): Promise<ITask | null> => {
  const updated = await Task.findByIdAndUpdate(id, updates, { new: true });
  if (updated) {
    await redisClient.del(`task:${id}`);
    publishToQueue('task_logs', { type: 'TASK_UPDATED', data: updated });
  }
  return updated;
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  const deleted = await Task.findByIdAndDelete(id);
  if (deleted) {
    await redisClient.del(`task:${id}`);
    publishToQueue('task_logs', { type: 'TASK_DELETED', data: deleted });
  }
  return deleted;
};
