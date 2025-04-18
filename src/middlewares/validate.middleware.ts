import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const validate = (schema: ObjectSchema): Middleware => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    next();
  };
};

export { validate };
