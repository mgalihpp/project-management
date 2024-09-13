import { userSchema } from './../validators/user';
import { db } from '../configs/db';
import type { Request, Response } from 'express';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class UserController {
  async getUser(req: Request, res: Response) {
    try {
      delete (req.user as any)?.password;

      return httpResponse.success(res, HttpStatus.OK, req.user);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany();
      return httpResponse.success(res, HttpStatus.OK, users);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await db.user.findFirst({
        where: {
          userId: parseInt(req.params.userId),
        },
      });

      if (!user) {
        return httpError.notFound(res, 'User Not Found');
      }

      return httpResponse.success(res, HttpStatus.OK, user);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { teamId } = req.body;

      await db.user.update({
        where: {
          userId: req.user?.userId,
        },
        data: {
          teamId,
        },
      });

      return httpResponse.success(
        res,
        HttpStatus.OK,
        null,
        'Successfully Updated User'
      );
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }
}

export default new UserController();
