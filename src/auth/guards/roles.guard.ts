import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has required role
    if (user?.role && requiredRoles.includes(user.role)) {
      return true;
    }
    
    // Check if it's a department head (they can access department_head endpoints)
    if (user?.role === 'department_head' && requiredRoles.includes('department_head')) {
      return true;
    }
    
    return false;
  }
}

