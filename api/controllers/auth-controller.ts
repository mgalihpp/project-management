import type { Request, Response } from 'express';
import { db } from '../configs/db';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../services/user-service';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await db.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return httpError.notFound(res, 'User Not Found');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return httpError.sendError(
          res,
          HttpStatus.BAD_REQUEST,
          'Invalid Credentials'
        );
      }

      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      return httpResponse.success(
        res,
        HttpStatus.OK,
        token,
        'Login Successfully'
      );
    } catch (error) {}
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const isUsernameTaken = await userService.checkUniqueUsername(
        res,
        username
      );

      if (isUsernameTaken) {
        return httpError.badRequest(res, 'Username already taken');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.user.create({
        data: {
          username,
          password: hashedPassword,
          profilePictureUrl: `https://avatar.vercel.sh/${username}`,
        },
      });

      const token = jwt.sign(newUser, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      return httpResponse.success(
        res,
        HttpStatus.CREATED,
        token,
        'Register Successfully'
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

export default new AuthController();
