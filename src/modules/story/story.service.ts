import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryFilterDto } from './dto/story-filter.dto';
import { generateUniqueSlug } from '../../shared/utils/slug.util';
import { I18nService } from 'nestjs-i18n';
import { Prisma, StoryStatus } from '@prisma/client';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async findAll(filterDto: StoryFilterDto) {
    const { page, limit, skip, sortBy, order, status, genreId, search } =
      filterDto;

    // Build where clause
    const where: Prisma.StoryWhereInput = {};

    if (status) {
      where.status = status;
    } else {
      // By default, only show published/completed stories (not DRAFT/HIDDEN)
      where.status = { in: [StoryStatus.PUBLISHED, StoryStatus.COMPLETED] };
    }

    if (genreId) {
      where.genres = { some: { genreId } };
    }

    if (search) {
      where.title = { contains: search };
    }

    // Build orderBy
    const orderBy: Prisma.StoryOrderByWithRelationInput = {};
    const sortField = sortBy || 'createdAt';
    if (
      sortField === 'viewCount' ||
      sortField === 'title' ||
      sortField === 'createdAt'
    ) {
      orderBy[sortField] = order?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          genres: {
            include: {
              genre: true,
            },
          },
          _count: {
            select: {
              chapters: true,
              likes: true,
              bookmarks: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.story.count({ where }),
    ]);

    return {
      message: this.i18n.t('story.list_success'),
      data: stories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        genres: {
          include: { genre: true },
        },
        tags: {
          include: { tag: true },
        },
        chapters: {
          where: { status: 'PUBLISHED' },
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            orderIndex: true,
            wordCount: true,
            publishedAt: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            likes: true,
            bookmarks: true,
            comments: true,
          },
        },
      },
    });

    if (!story) {
      throw new NotFoundException(this.i18n.t('story.not_found'));
    }

    return { data: story };
  }

  async create(dto: CreateStoryDto, authorId: string) {
    const slug = generateUniqueSlug(dto.title);

    const story = await this.prisma.story.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        coverImage: dto.coverImage,
        mature: dto.mature || false,
        authorId,
        genres: dto.genreIds
          ? {
              create: dto.genreIds.map((genreId) => ({
                genreId,
              })),
            }
          : undefined,
        tags: dto.tagIds
          ? {
              create: dto.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        genres: {
          include: { genre: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    return {
      message: this.i18n.t('story.created'),
      data: story,
    };
  }

  async update(id: string, dto: UpdateStoryDto, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException(this.i18n.t('story.not_found'));
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(this.i18n.t('story.not_author'));
    }

    // Handle genre updates
    const genreUpdate = dto.genreIds
      ? {
          deleteMany: {},
          create: dto.genreIds.map((genreId) => ({ genreId })),
        }
      : undefined;

    // Handle tag updates
    const tagUpdate = dto.tagIds
      ? {
          deleteMany: {},
          create: dto.tagIds.map((tagId) => ({ tagId })),
        }
      : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { genreIds: _genreIds, tagIds: _tagIds, ...updateData } = dto;

    // Set publishedAt when publishing for the first time
    if (dto.status === StoryStatus.PUBLISHED && !story.publishedAt) {
      (updateData as Prisma.StoryUncheckedUpdateInput).publishedAt = new Date();
    }

    const updated = await this.prisma.story.update({
      where: { id },
      data: {
        ...updateData,
        genres: genreUpdate,
        tags: tagUpdate,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        genres: {
          include: { genre: true },
        },
      },
    });

    return {
      message: this.i18n.t('story.updated'),
      data: updated,
    };
  }

  async remove(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException(this.i18n.t('story.not_found'));
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(this.i18n.t('story.not_author'));
    }

    // Soft delete — set status to HIDDEN
    await this.prisma.story.update({
      where: { id },
      data: { status: StoryStatus.HIDDEN },
    });

    return {
      message: this.i18n.t('story.deleted'),
      data: null,
    };
  }
}
