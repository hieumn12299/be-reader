import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, string[]>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle validation errors from class-validator
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // class-validator sends message as array
        if (Array.isArray(responseObj.message)) {
          const details: Record<string, string[]> = {};
          for (const msg of responseObj.message) {
            if (typeof msg === 'string') {
              // Try to extract field name from validation message
              const field = msg.split(' ')[0] || 'general';
              if (!details[field]) details[field] = [];
              details[field].push(msg);
            }
          }

          errorResponse = {
            statusCode: status,
            message: 'Dữ liệu không hợp lệ',
            error: (responseObj.error as string) || 'Bad Request',
            details,
          };
        } else {
          errorResponse = {
            statusCode: status,
            message: (responseObj.message as string) || exception.message,
            error: (responseObj.error as string) || 'Error',
          };
        }
      } else {
        errorResponse = {
          statusCode: status,
          message: exception.message,
          error: 'Error',
        };
      }
    } else {
      // Unknown/unexpected errors
      this.logger.error(
        'Unexpected error',
        exception instanceof Error ? exception.stack : String(exception),
      );

      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi hệ thống, vui lòng thử lại sau',
        error: 'Internal Server Error',
      };
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
