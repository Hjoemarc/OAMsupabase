import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { RegisterForm } from '@/features/auth/components/register-form';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Account | ZPPSU OAMS',
  description: 'Register for institutional accreditation access to ZPPSU OAMS.',
};

export default async function RegisterPage() {
  const userContext = await getCurrentUserWithRoles();

  if (userContext) {
    redirect(userContext.primaryRedirectPath);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="w-full max-w-md space-y-6 bg-[var(--surface)] p-8 rounded-[var(--radius-surface)] border border-[var(--border)] shadow-xs">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-control)] bg-[#7B1113] text-[#FEF3C7] shadow-2xs border border-[#580C0E] mb-3 font-semibold text-sm tracking-tight">
            ZP
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-semibold text-lg text-[var(--foreground)] font-[family-name:var(--font-display)]">
              ZPPSU OAMS
            </span>
            <Badge tone="neutral" size="sm">
              Personnel registration
            </Badge>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Create personnel account
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Register your institutional account for administrator approval
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
