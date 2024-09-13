import type { Response } from 'express';
import { ZodIssue } from 'zod';
import HttpStatus from 'http-status-codes';

class HttpError {
  static sendError(
    res: Response,
    statusCode: number,
    message: string | string[] | ZodIssue[]
  ) {
    return res.status(statusCode).json({
      status: statusCode,
      success: false,
      message: message,
    });
  }

  static internalServerError(
    res: Response,
    message: string | string[] = 'Internal Server Error'
  ) {
    return this.sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  static badRequest(res: Response, message: string | string[] = 'Bad Request') {
    return this.sendError(res, HttpStatus.BAD_REQUEST, message);
  }

  static notFound(res: Response, message: string | string[] = 'Not Found') {
    return this.sendError(res, HttpStatus.NOT_FOUND, message);
  }

  static validationError(res: Response, message: ZodIssue[]) {
    return this.sendError(res, HttpStatus.BAD_REQUEST, message);
  }

  static unauthorized(
    res: Response,
    message: string | string[] = 'Unauthorized'
  ) {
    return this.sendError(res, HttpStatus.UNAUTHORIZED, message);
  }

  // You can add more error types (e.g., unauthorized, forbidden, etc.) if needed
}

export default HttpError;
