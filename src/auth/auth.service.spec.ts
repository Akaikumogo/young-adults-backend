import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    _id: 'user-id-123',
    full_name: 'Test User',
    email: 'test@example.com',
    phone: '+998901234567',
    password: '$2b$10$hashedpassword',
    role: 'admin',
    is_active: true,
    toObject: function () {
      return { ...this, password: undefined };
    },
  };

  beforeEach(async () => {
    const mockUsersService = {
      findByLogin: jest.fn(),
      updateLastLogin: jest.fn().mockResolvedValue(undefined),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'REFRESH_TOKEN_EXPIRES_IN') return '30d';
        if (key === 'REFRESH_TOKEN_SECRET') return 'test-refresh-secret';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token and user when credentials are valid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        _id: mockUser._id,
        full_name: mockUser.full_name,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        is_active: mockUser.is_active,
      });

      const loginDto: LoginDto = { login: 'test@example.com', password: 'password123' };
      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('refresh_token', 'mock-jwt-token');
      expect(result.user).toMatchObject({
        _id: mockUser._id,
        full_name: mockUser.full_name,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findByLogin.mockResolvedValue(null);

      await expect(
        service.validateUser('unknown@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const inactiveUser = { ...mockUser, is_active: false };
      usersService.findByLogin.mockResolvedValue(inactiveUser as any);
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
