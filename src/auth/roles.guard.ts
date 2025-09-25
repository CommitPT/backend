import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

export interface RequestUser {
  userId: string;
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const { user } = request;

    if (!user) return false; // User not authenticated, deny

    if (!requiredRoles || requiredRoles.length === 0) return true; // User is authenticated but auth required controllers

    return requiredRoles.includes(user.role); // User have a strict role for role required controllers
  }
}
