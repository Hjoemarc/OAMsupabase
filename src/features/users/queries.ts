import { type Database } from '../../types/database/index.ts';
import { type AppRole } from './schemas.ts';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];

export interface UserWithRoles {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  department: string | null;
  createdAt: string;
  roles: AppRole[];
  isPending: boolean;
}

export interface UsersOverview {
  users: UserWithRoles[];
  totalUsers: number;
  pendingCount: number;
  roleCounts: Record<AppRole, number>;
}

export function mapProfilesWithRoles(
  profiles: ProfileRow[],
  userRoles: UserRoleRow[]
): UserWithRoles[] {
  const rolesByUserId = new Map<string, AppRole[]>();

  for (const record of userRoles) {
    const existing = rolesByUserId.get(record.user_id) || [];
    existing.push(record.role);
    rolesByUserId.set(record.user_id, existing);
  }

  const mapped: UserWithRoles[] = profiles.map((profile) => {
    const roles = rolesByUserId.get(profile.id) || [];
    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      department: profile.department,
      createdAt: profile.created_at,
      roles,
      isPending: roles.length === 0,
    };
  });

  return mapped.sort((a, b) => {
    if (a.isPending !== b.isPending) {
      return a.isPending ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getUsersWithRoles(): Promise<UsersOverview> {
  const { requireRole } = await import('../auth/guards.ts');
  await requireRole('admin');

  const { createClient } = await import('../../lib/supabase/server.ts');
  const supabase = await createClient();

  const [profilesRes, rolesRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('user_roles').select('*'),
  ]);

  if (profilesRes.error) {
    throw new Error(`Failed to fetch profiles: ${profilesRes.error.message}`);
  }

  if (rolesRes.error) {
    throw new Error(`Failed to fetch roles: ${rolesRes.error.message}`);
  }

  const profiles = profilesRes.data ?? [];
  const userRoles = rolesRes.data ?? [];

  const users = mapProfilesWithRoles(profiles, userRoles);

  const roleCounts: Record<AppRole, number> = {
    admin: 0,
    coordinator: 0,
    evaluator: 0,
    faculty: 0,
  };

  for (const r of userRoles) {
    if (roleCounts[r.role] !== undefined) {
      roleCounts[r.role]++;
    }
  }

  const pendingCount = users.filter((u) => u.isPending).length;

  return {
    users,
    totalUsers: users.length,
    pendingCount,
    roleCounts,
  };
}
