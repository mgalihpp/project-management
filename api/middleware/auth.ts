import type { NextFunction, Request, Response } from 'express';
import HttpError from '../helpers/httpError';
import userService from '../services/user-service';

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth_header = req.headers['authorization'];
  const token = auth_header && auth_header.split(' ')[1];

  if (!token) {
    return HttpError.unauthorized(res);
  }

  try {
    const user = await userService.verifyTokenAndGetUser(token);
    req.user = user;
    next();
  } catch (error) {
    HttpError.internalServerError(res);
  }
};
