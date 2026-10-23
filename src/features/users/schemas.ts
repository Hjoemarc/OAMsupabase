import { z } from 'zod';
import { type Database } from '../../types/database/index.ts';

export type AppRole = Database['public']['Enums']['app_role'];

export const ALL_APP_ROLES = ['admin', 'coordinator', 'evaluator', 'faculty'] as const;

export const toggleUserRoleSchema = z.object({
  targetUserId: z.string().uuid('Invalid user identifier'),
  role: z.enum(ALL_APP_ROLES, {
    message: 'Invalid operational role provided',
  }),
  intent: z.enum(['grant', 'revoke'], {
    message: 'Intent must be either grant or revoke',
  }),
});

export type ToggleUserRoleInput = z.infer<typeof toggleUserRoleSchema>;

export type RoleMutationPolicyResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export function validateRoleMutationPolicy(params: {
  actorUserId: string;
  targetUserId: string;
  role: AppRole;
  intent: 'grant' | 'revoke';
}): RoleMutationPolicyResult {
  if (
    params.actorUserId === params.targetUserId &&
    params.role === 'admin' &&
    params.intent === 'revoke'
  ) {
    return {
      allowed: false,
      reason: 'You cannot revoke your own admin role.',
    };
  }

  return { allowed: true };
}

export type UserRoleActionState = {
  error?: string;
  success?: string;
};
