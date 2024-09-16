import type { Request, Response } from 'express';
import { db } from '../configs/db';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class TaskController {
  async getTask(req: Request, res: Response) {
    try {
      const { projectId } = req.query;

      const tasks = await db.task.findMany({
        where: {
          projectId: parseInt(projectId as string),
        },
        include: {
          author: {
            select: {
              profilePictureUrl: true,
              username: true,
              teamId: true,
              userId: true,
              password: false,
            },
          },
          assignee: {
            select: {
              profilePictureUrl: true,
              username: true,
              teamId: true,
              userId: true,
              password: false,
            },
          },
          comments: true,
          attachments: true,
        },
      });

      if (!tasks) {
        return httpError.notFound(res, 'Tasks Not Found');
      }

      return httpResponse.success(res, HttpStatus.OK, tasks);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      } = req.body;

      await db.task.create({
        data: {
          id: Math.floor(Math.random() * 100000),
          title,
          description,
          status,
          priority,
          tags,
          startDate,
          dueDate,
          points,
          projectId,
          authorUserId,
          assignedUserId,
        },
      });

      return httpResponse.success(
        res,
        HttpStatus.CREATED,
        null,
        'Task created successfully'
      );
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      await db.task.update({
        where: {
          id: parseInt(taskId),
        },
        data: {
          status,
        },
      });

      return httpResponse.success(
        res,
        HttpStatus.OK,
        null,
        'Task updated successfully'
      );
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }

  async getUserTasks(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const tasks = await db.task.findMany({
        where: {
          OR: [
            {
              authorUserId: parseInt(userId),
            },
            {
              assignedUserId: parseInt(userId),
            },
          ],
        },
        include: {
          author: true,
          assignee: true,
        },
      });

      if (!tasks) {
        return httpError.notFound(res, 'Tasks not found');
      }

      return httpResponse.success(res, HttpStatus.OK, tasks);
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }
}

export default new TaskController();
