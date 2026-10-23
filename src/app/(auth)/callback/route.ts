import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserWithRoles, resolvePrimaryDashboardPath } from '@/features/auth/queries';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const userContext = await getCurrentUserWithRoles();
      const defaultRedirect = userContext
        ? userContext.primaryRedirectPath
        : resolvePrimaryDashboardPath([]);

      const targetPath =
        next && next.startsWith('/') && !next.startsWith('//')
          ? next
          : defaultRedirect;

      return NextResponse.redirect(new URL(targetPath, origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin));
}
