import type { Request, Response } from 'express';
import { db } from '../configs/db';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class ProjectController {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await db.project.findMany();
      return httpResponse.success(res, HttpStatus.OK, projects);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const { name, description, startDate, endDate } = req.body;

      await db.project.create({
        data: {
          name,
          description,
          startDate,
          endDate,
        },
      });

      return httpResponse.success(
        res,
        HttpStatus.CREATED,
        null,
        'Successfully created project'
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

export default new ProjectController();
