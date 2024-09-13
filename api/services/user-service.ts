import type { User } from '@prisma/client';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../configs/db';
import httpError from '../helpers/httpError';

class UserService {
  verifyTokenAndGetUser(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload as User);
        }
      });
    });
  }
  async checkUniqueUsername(res: Response, username: string) {
    try {
      return await db.user
        .count({ where: { username } })
        .then((count) => count > 0);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }
}

export default new UserService();
