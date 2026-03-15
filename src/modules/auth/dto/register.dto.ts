import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { REGEX } from 'src/shared/constants/regex';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('common.validation.invalid_email') })
  @IsNotEmpty({ message: i18nValidationMessage('common.validation.email_required') })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: i18nValidationMessage('common.validation.password_min') })
  @MaxLength(50, { message: i18nValidationMessage('common.validation.password_max') })
  @Matches(REGEX.PASSWORD_STRENGTH, {
    message: i18nValidationMessage('common.validation.password_strength'),
  })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2, { message: i18nValidationMessage('common.validation.display_name_min') })
  @MaxLength(50, { message: i18nValidationMessage('common.validation.display_name_max') })
  displayName: string;
}
