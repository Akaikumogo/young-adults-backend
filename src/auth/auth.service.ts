import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { UserDocument } from '../users/schemas/user.schema';

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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Update last login
    await this.usersService.updateLastLogin((user as UserDocument)._id.toString());

    const { password: _, ...result } = (user as UserDocument).toObject();
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.login, loginDto.password);
    const payload = { email: user.email, sub: user._id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'your-refresh-secret',
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
    const { password: _, ...result } = (user as UserDocument).toObject();
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'your-refresh-secret',
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.is_active) {
        throw new UnauthorizedException();
      }

      const newPayload = { email: user.email, sub: (user as UserDocument)._id, role: user.role };

      const accessToken = this.jwtService.sign(newPayload);

      const refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'your-refresh-secret',
        expiresIn: refreshTokenExpiresIn,
      } as any);

      return {
        token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    const userDoc = user as UserDocument;
    return {
      _id: userDoc._id,
      full_name: userDoc.full_name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      avatar_url: userDoc.avatar_url,
      is_active: userDoc.is_active,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      last_login: userDoc.last_login,
    };
  }
}

