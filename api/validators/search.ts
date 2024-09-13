import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import HttpError from '../helpers/httpError';

// Define a Zod schema
export const querySchema = z.object({
  query: z.string().min(1, 'query is required'),
});

// Middleware to validate request with Zod
class SearchValidator {
  search(req: Request, res: Response, next: NextFunction) {
    const result = querySchema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }

    next();
  }
}

export default new SearchValidator();
