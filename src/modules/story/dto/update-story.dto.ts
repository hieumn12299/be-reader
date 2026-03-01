import { PartialType } from '@nestjs/swagger';
import { CreateStoryDto } from './create-story.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StoryStatus } from '@prisma/client';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {
  @ApiPropertyOptional({ enum: StoryStatus })
  @IsOptional()
  @IsEnum(StoryStatus, { message: 'Trạng thái truyện không hợp lệ' })
  status?: StoryStatus;
}
