import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, string[]>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        errorResponse = {
          statusCode: status,
          message: (responseObj.message as string) || exception.message,
          error: (responseObj.error as string) || 'Error',
          ...(responseObj.details
            ? { details: responseObj.details as Record<string, string[]> }
            : {}),
        };
      } else {
        errorResponse = {
          statusCode: status,
          message: exception.message,
          error: 'Error',
        };
      }
    } else {
      this.logger.error(
        'Unexpected error',
        exception instanceof Error ? exception.stack : String(exception),
      );

      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('common.error.internal'),
        error: 'Internal Server Error',
      };
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
