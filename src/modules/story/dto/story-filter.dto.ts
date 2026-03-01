import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StoryStatus } from '@prisma/client';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

export class StoryFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: StoryStatus })
  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @ApiPropertyOptional({ description: 'Filter by genre ID' })
  @IsOptional()
  @IsString()
  genreId?: string;

  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;
}
