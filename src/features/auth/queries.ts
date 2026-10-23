import { type Database } from '../../types/database/index.ts';
import { type User } from '@supabase/supabase-js';

export type AppRole = Database['public']['Enums']['app_role'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface CurrentUserContext {
  user: User;
  profile: ProfileRow | null;
  roles: AppRole[];
  primaryRedirectPath: string;
}

export function resolvePrimaryDashboardPath(roles: AppRole[]): string {
  if (roles.includes('admin')) {
    return '/admin';
  }
  if (roles.includes('coordinator')) {
    return '/coordinator';
  }
  if (roles.includes('evaluator')) {
    return '/evaluator';
  }
  if (roles.includes('faculty')) {
    return '/faculty';
  }
  return '/pending-approval';
}

export async function getCurrentUserWithRoles(): Promise<CurrentUserContext | null> {
  const { createClient } = await import('../../lib/supabase/server');
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const [profileResult, rolesResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', user.id),
  ]);

  const profile = profileResult.data;
  const roles: AppRole[] = rolesResult.data ? rolesResult.data.map((r) => r.role) : [];

  return {
    user,
    profile,
    roles,
    primaryRedirectPath: resolvePrimaryDashboardPath(roles),
  };
}
