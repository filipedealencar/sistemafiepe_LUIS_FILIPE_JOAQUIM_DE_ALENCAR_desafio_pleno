import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateQuery =
  (schema: ZodType<any>) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      (req as any).validatedQuery = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
