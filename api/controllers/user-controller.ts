import { userSchema } from './../validators/user';
import { db } from '../configs/db';
import type { Request, Response } from 'express';
import httpResponse from '../helpers/httpResponse';
import HttpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany();
      httpResponse.success(res, HttpStatus.OK, users);
    } catch (error) {
      if (error instanceof Error) {
        HttpError.internalServerError(res, error.message);
      } else {
        HttpError.internalServerError(res);
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await db.user.findFirst({
        where: {
          cognitoId: req.params.cognitoId,
        },
      });

      if (!user) {
        HttpError.notFound(res, 'User Not Found');
      }

      httpResponse.success(res, HttpStatus.OK, user);
    } catch (error) {
      if (error instanceof Error) {
        HttpError.internalServerError(res, error.message);
      } else {
        HttpError.internalServerError(res);
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, cognitoId, profilePictureUrl, teamId } = req.body;

      await db.user.create({
        data: {
          username,
          cognitoId,
          profilePictureUrl,
          teamId,
        },
      });

      httpResponse.success(
        res,
        HttpStatus.CREATED,
        null,
        'Successfully created user'
      );
    } catch (error) {
      if (error instanceof Error) {
        HttpError.internalServerError(res, error.message);
      } else {
        HttpError.internalServerError(res);
      }
    }
  }
}

export default new UserController();
