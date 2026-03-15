import { HttpStatus } from '@nestjs/common';

/**
 * Response message constants — dùng thay cho hardcoded strings.
 * BẮT BUỘC sử dụng khi tạo response trong interceptors, filters, pipes.
 */
export enum ResponseMessageE {
  SUCCESS = 'Success',
  ERROR = 'Error',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  VALIDATION_FAILED = 'Validation failed',
  INVALID_VALUE = 'Invalid value',
}

/**
 * Re-export HttpStatus from @nestjs/common for convenience.
 * BẮT BUỘC dùng HttpStatus enum thay cho hardcoded status codes (400, 401, 500...).
 */
export { HttpStatus };
