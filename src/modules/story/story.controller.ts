import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryFilterDto } from './dto/story-filter.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { JwtPayload } from '../../shared/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Stories')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  @ApiOperation({ summary: 'List stories with pagination and filters' })
  async findAll(@Query() filterDto: StoryFilterDto) {
    return this.storyService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single story by ID' })
  async findOne(@Param('id') id: string) {
    return this.storyService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new story (Author/Admin only)' })
  async create(@Body() dto: CreateStoryDto, @CurrentUser() user: JwtPayload) {
    return this.storyService.create(dto, user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a story (owner only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.storyService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a story (soft delete, owner only)' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.storyService.remove(id, user.sub);
  }
}
