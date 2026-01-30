import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/user.service';
import { DepartmentsService } from '../../departments/department.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private departmentsService: DepartmentsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Check if this is a department head token
    if (payload.type === 'department' && payload.role === 'department_head') {
      const department = await this.departmentsService.findOne(payload.sub);
      if (!department || !department.is_active) {
        throw new UnauthorizedException();
      }
      return {
        _id: department._id,
        role: 'department_head',
        department_id: department._id,
        type: 'department',
        department: department,
      };
    }

    // Regular user authentication
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

