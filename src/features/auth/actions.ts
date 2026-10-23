'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema, type AuthActionState } from './schemas';
import { getCurrentUserWithRoles, resolvePrimaryDashboardPath } from './queries';

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  const userContext = await getCurrentUserWithRoles();
  const targetPath = userContext ? userContext.primaryRedirectPath : resolvePrimaryDashboardPath([]);

  redirect(targetPath);
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (data.user && !data.session) {
    return {
      success: 'Account created! Please check your email inbox to confirm your email before signing in.',
    };
  }

  const userContext = await getCurrentUserWithRoles();
  const targetPath = userContext ? userContext.primaryRedirectPath : resolvePrimaryDashboardPath([]);

  redirect(targetPath);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
