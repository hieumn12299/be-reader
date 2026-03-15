import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword, comparePassword } from '../../shared/utils/hash.util';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException(this.i18n.t('auth.email_exists'));
    }

    // Hash password
    const passwordHash = await hashPassword(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.displayName,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException(this.i18n.t('auth.invalid_credentials'));
    }

    // Compare password
    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(this.i18n.t('auth.invalid_credentials'));
    }

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.displayName,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });

      // Verify user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException(this.i18n.t('auth.token_invalid'));
      }

      const tokens = await this.generateTokens(
        user.id,
        user.email,
        user.role,
        user.displayName,
      );

      return tokens;
    } catch {
      throw new UnauthorizedException(this.i18n.t('auth.token_expired'));
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            stories: true,
            followers: true,
            follows: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(this.i18n.t('auth.token_invalid'));
    }

    return user;
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    displayName: string,
  ) {
    const payload = { sub: userId, email, role, displayName };

    const accessSecret =
      this.configService.get<string>('app.jwt.accessSecret') ||
      'default-access-secret';
    const refreshSecret =
      this.configService.get<string>('app.jwt.refreshSecret') ||
      'default-refresh-secret';
    const accessExpiration =
      this.configService.get<string>('app.jwt.accessExpiration') || '15m';
    const refreshExpiration =
      this.configService.get<string>('app.jwt.refreshExpiration') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiration as `${number}m`,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiration as `${number}d`,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
