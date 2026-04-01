import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    await this.usersService.updateLastLogin(user._id);

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const login = (loginDto.login ?? loginDto.email ?? '').trim();
    if (!login) {
      throw new BadRequestException('Email yoki telefon kiriting');
    }
    const user = await this.validateUser(login, loginDto.password);
    const payload = { email: user.email, sub: user._id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenExpiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
        'your-refresh-secret',
      expiresIn: refreshTokenExpiresIn,
    } as any);

    return {
      token: accessToken,
      refresh_token: refreshToken,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const user = await this.usersService.create({
      ...registerStudentDto,
      role: 'student' as any,
    });

    const payload = { email: user.email, sub: user._id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenExpiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
        'your-refresh-secret',
      expiresIn: refreshTokenExpiresIn,
    } as any);

    return {
      token: accessToken,
      refresh_token: refreshToken,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
          'your-refresh-secret',
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.is_active) {
        throw new UnauthorizedException();
      }

      const newPayload = {
        email: user.email,
        sub: user._id,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload);

      const refreshTokenExpiresIn =
        this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret:
          this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
          'your-refresh-secret',
        expiresIn: refreshTokenExpiresIn,
      } as any);

      return {
        token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    return {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      last_login: user.last_login,
    };
  }
}
