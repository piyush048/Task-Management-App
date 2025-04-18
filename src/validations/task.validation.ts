import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
  dueDate: Joi.date().optional(),
  projectId: Joi.string().hex().length(24).required(),
  assignedTo: Joi.string().hex().length(24).optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
  dueDate: Joi.date().optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
});
