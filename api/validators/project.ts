import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import httpError from '../helpers/httpError';
import { ISO_DATE_REGEX } from '../helpers/isodate';

// Define a Zod schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Username is required'),
  description: z.string().min(1, 'Cognito Id is required'),
  startDate: z.string().regex(ISO_DATE_REGEX, 'date must be a valid ISO date'),
  endDate: z.string().regex(ISO_DATE_REGEX, 'date must be a valid ISO date'),
});

// Middleware to validate request with Zod

class ProjectValidator {
  createProject(req: Request, res: Response, next: NextFunction) {
    const result = projectSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors;
      return httpError.validationError(res, errors);
    }

    next();
  }
}

export default new ProjectValidator();
