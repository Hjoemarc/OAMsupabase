'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/features/auth/guards';
import {
  toggleUserRoleSchema,
  validateRoleMutationPolicy,
  type UserRoleActionState,
} from './schemas';

export async function mutateUserRole(
  _prevState: UserRoleActionState,
  formData: FormData
): Promise<UserRoleActionState> {
  const auth = await requireRole('admin');

  const raw = {
    targetUserId: formData.get('targetUserId'),
    role: formData.get('role'),
    intent: formData.get('intent'),
  };

  const parsed = toggleUserRoleSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message || 'Invalid role update payload';
    return { error: issue };
  }

  const { targetUserId, role, intent } = parsed.data;

  const policy = validateRoleMutationPolicy({
    actorUserId: auth.user.id,
    targetUserId,
    role,
    intent,
  });

  if (!policy.allowed) {
    return { error: policy.reason };
  }

  const supabase = await createClient();

  if (intent === 'grant') {
    const { error } = await supabase.from('user_roles').insert({
      user_id: targetUserId,
      role,
    });

    if (error) {
      if (error.code === '23505') {
        // Unique violation: role already assigned
        return { success: `User already possesses the ${role} role.` };
      }
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', targetUserId)
      .eq('role', role);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');

  return {
    success: `Successfully ${intent === 'grant' ? 'granted' : 'revoked'} the ${role} role.`,
  };
}
