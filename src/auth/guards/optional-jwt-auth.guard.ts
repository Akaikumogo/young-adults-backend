import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw error when no token is provided
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, just return undefined instead of throwing
    if (err || !user) {
      return undefined;
    }
    return user;
  }

  // Override canActivate to allow requests without tokens
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to activate the guard (will succeed if token is valid)
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // If token is missing or invalid, allow the request to continue
      // The user will just be undefined
      return true;
    }
  }
}

