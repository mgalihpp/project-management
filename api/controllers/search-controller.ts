import type { Request, Response } from 'express';
import { db } from '../configs/db';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class SearchController {
  async search(req: Request, res: Response) {
    const { query } = req.query;

    try {
      const tasks = await db.task.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query as string,
              },
              description: {
                contains: query as string,
              },
            },
          ],
        },
      });

      const projects = await db.project.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query as string,
              },
              description: {
                contains: query as string,
              },
            },
          ],
        },
      });

      const users = await db.user.findMany({
        where: {
          OR: [{ username: { contains: query as string } }],
        },
      });

      return httpResponse.success(
        res,
        HttpStatus.OK,
        { tasks, projects, users },
        'Search results retrieved successfully'
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

export default new SearchController();
