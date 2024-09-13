import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import httpError from '../helpers/httpError';

// Define a Zod schema
export const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  cognitoId: z.string().min(1, 'Cognito Id is required'),
  profilePictureUrl: z.string().url('Must be a valid URL'),
  teamId: z.string().optional(),
});

// Middleware to validate request with Zod
class UserValidator {
  createUser(req: Request, res: Response, next: NextFunction) {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors;
      return httpError.validationError(res, errors);
    }

    next();
  }

  findUser(req: Request, res: Response, next: NextFunction) {
    const result = z
      .object({ cognitoId: userSchema.shape.cognitoId })
      .safeParse(req.params);
    if (!result.success) {
      const errors = result.error.errors;
      return httpError.validationError(res, errors);
    }

    next();
  }
}

export default new UserValidator();
