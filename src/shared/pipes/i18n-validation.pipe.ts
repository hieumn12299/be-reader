import {
  Injectable,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { HttpStatus } from '../constants/response';

/**
 * Custom validation pipe that uses i18n for error messages.
 * Inject via APP_PIPE provider in AppModule.
 */
@Injectable()
export class I18nValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const details: Record<string, string[]> = {};
        for (const error of errors) {
          const field = error.property;
          const messages = error.constraints
            ? Object.values(error.constraints)
            : [this.i18n.t('common.validation.invalid_value')];
          details[field] = messages;
        }
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.i18n.t('common.validation.validation_failed'),
          error: this.i18n.t('common.validation.invalid_data'),
          details,
        });
      },
    });
  }
}
