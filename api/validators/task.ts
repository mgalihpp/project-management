import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import HttpError from '../helpers/httpError';

export const ISO_DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/;
export const ISO_DATETIME_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  tags: z.string().min(1, 'Tags is required'),
  startDate: z.string().regex(ISO_DATE_REGEX, 'date must be a valid ISO date'),
  dueDate: z.string().regex(ISO_DATE_REGEX, 'date must be a valid ISO date'),
  points: z.string().min(1, 'Points is required').optional(),
  projectId: z.union([
    z.string().min(1, 'Project Id is required'),
    z.number().min(1, 'Project Id is required'),
  ]),
  authorUserId: z.union([
    z.string().min(1, 'Author User Id is required'),
    z.number().min(1, 'Author User Id is required'),
  ]),
  assignedUserId: z.union([
    z.string().min(1, 'Assigned User Id is required'),
    z.number().min(1, 'Assigned User Id is required'),
  ]),
});

class TaskValidator {
  getTask(req: Request, res: Response, next: NextFunction) {
    const result = z
      .object({
        projectId: taskSchema.shape.projectId,
      })
      .safeParse(req.query);
    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }

    next();
  }

  createTask(req: Request, res: Response, next: NextFunction) {
    const result = taskSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }

    next();
  }

  updateTask(req: Request, res: Response, next: NextFunction) {
    const result1 = z
      .object({
        taskId: z.union([
          z.string().min(1, 'TaskId is required'),
          z.number().min(1, 'TaskId is required'),
        ]),
      })
      .safeParse(req.params);
    const result2 = z
      .object({ status: taskSchema.shape.status })
      .safeParse(req.body);
    if (!result1.success || !result2.success) {
      const errors = [
        ...(result1.error ? result1.error.errors : []),
        ...(result2.error ? result2.error.errors : []),
      ];
      return HttpError.validationError(res, errors);
    }

    next();
  }

  getUserTasks(req: Request, res: Response, next: NextFunction) {
    const result = z
      .object({
        userId: z.string(),
      })
      .safeParse(req.params);
    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }

    next();
  }
}

export default new TaskValidator();
