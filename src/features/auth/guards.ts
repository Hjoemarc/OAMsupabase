import { type Database } from '../../types/database/index.ts';
import {
  getCurrentUserWithRoles,
  resolvePrimaryDashboardPath,
  type CurrentUserContext,
  type AppRole,
} from './queries.ts';

export type { AppRole };

export type RoleAccessEvaluation =
  | { allowed: true }
  | { allowed: false; redirectTo: string };

export function evaluateRoleAccess(
  userRoles: AppRole[],
  requiredRole: AppRole
): RoleAccessEvaluation {
  if (userRoles.includes(requiredRole)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    redirectTo: resolvePrimaryDashboardPath(userRoles),
  };
}

export async function requireAuth(): Promise<CurrentUserContext> {
  const auth = await getCurrentUserWithRoles();
  const { redirect } = await import('next/navigation');

  if (!auth) {
    redirect('/login');
    throw new Error('Redirecting to /login');
  }

  if (auth.roles.length === 0) {
    redirect('/pending-approval');
    throw new Error('Redirecting to /pending-approval');
  }

  return auth;
}

export async function requireRole(requiredRole: AppRole): Promise<CurrentUserContext> {
  const auth = await requireAuth();
  const result = evaluateRoleAccess(auth.roles, requiredRole);

  if (!result.allowed) {
    const { redirect } = await import('next/navigation');
    redirect(result.redirectTo);
  }

  return auth;
}
