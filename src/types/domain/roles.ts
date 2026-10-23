export type AppRole = 'admin' | 'coordinator' | 'evaluator' | 'faculty';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  department: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleRecord {
  id: string;
  userId: string;
  role: AppRole;
  createdAt: string;
}

export interface UserSessionState {
  user: {
    id: string;
    email: string;
  } | null;
  profile: UserProfile | null;
  roles: AppRole[];
}
