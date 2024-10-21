import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return matchRoles(requiredRoles, user?.role);
  }
}

/**
 * Checks if any of the required roles are included in the user's role array.
 *
 * @param {string[]} requiredRoles - An array of roles that are required.
 * @param {string[]} userRole - An array of roles that the user has.
 * @return {boolean} Returns true if any of the required roles are included in the user's role array, otherwise returns false.
 */
function matchRoles(requiredRoles: string[], userRole: string[]) {
  return requiredRoles.some((role: string) => userRole?.includes(role));
}
