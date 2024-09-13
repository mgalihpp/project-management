import type { Request, Response } from 'express';

class httpResponse {
  static sendResponse<T>(
    res: Response,
    statusCode: number,
    success: boolean,
    data: T,
    message?: string
  ) {
    return res.status(statusCode).json({
      status: statusCode,
      success,
      message,
      data,
    });
  }

  // Method for sending success responses
  static success<T>(
    res: Response,
    statusCode: number,
    data: T,
    message?: string
  ): Response {
    return this.sendResponse(res, statusCode, true, data, message);
  }

  // Method for sending error responses
  static error(res: Response, statusCode: number, message: string): Response {
    return this.sendResponse(res, statusCode, false, null, message);
  }
}

export default httpResponse;
