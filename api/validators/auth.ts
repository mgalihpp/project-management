import type { NextFunction, Request, Response } from 'express';
import z from 'zod';
import HttpError from '../helpers/httpError';

// Define a Zod schema
export const authSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) => {
        const passwordRegex = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
        );
        return passwordRegex.test(val);
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      }
    ),
});

// Middleware to validate request with Zod
class AuthValidator {
  register(req: Request, res: Response, next: NextFunction) {
    const result = authSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }

    next()
  }
}

export default new AuthValidator();
