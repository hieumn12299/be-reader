import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ example: 'Kiếm Hiệp Truyền Kỳ' })
  @IsString()
  @MinLength(1, { message: 'Tên truyện không được để trống' })
  @MaxLength(200, { message: 'Tên truyện không được quá 200 ký tự' })
  title: string;

  @ApiProperty({ example: 'Một câu chuyện về kiếm khách lang thang...' })
  @IsString()
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  @MaxLength(5000, { message: 'Mô tả không được quá 5000 ký tự' })
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsUrl({}, { message: 'URL ảnh bìa không hợp lệ' })
  coverImage?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  mature?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['genre-id-1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];

  @ApiPropertyOptional({ type: [String], example: ['tag-id-1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
