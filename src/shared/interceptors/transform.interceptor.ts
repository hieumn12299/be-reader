import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly i18n: I18nService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode: number = response.statusCode;

    return next.handle().pipe(
      map((responseData) => {
        // If controller already returned ApiResponse format, pass through
        if (
          responseData &&
          typeof responseData === 'object' &&
          'statusCode' in responseData &&
          'data' in responseData
        ) {
          return responseData as ApiResponse<T>;
        }

        // If response has meta (pagination), extract it
        if (
          responseData &&
          typeof responseData === 'object' &&
          'data' in responseData &&
          'meta' in responseData
        ) {
          const res = responseData as Record<string, unknown>;
          return {
            statusCode,
            message: (res.message as string) || this.i18n.t('common.success'),
            data: res.data as T,
            meta: res.meta as ApiResponse<T>['meta'],
          };
        }

        return {
          statusCode,
          message: this.i18n.t('common.success'),
          data: responseData as T,
        };
      }),
    );
  }
}
