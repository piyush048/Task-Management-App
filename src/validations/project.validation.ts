import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  members: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  members: Joi.array().items(Joi.string().hex().length(24)).optional(),
});
