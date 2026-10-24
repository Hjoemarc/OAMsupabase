import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { logout } from '@/features/auth/actions';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/layout/brand-mark';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pending Role Assignment | ZPPSU OAMS',
  description: 'Your account is pending role provision by an institutional accreditation administrator.',
};

export default async function PendingApprovalPage() {
  const userContext = await getCurrentUserWithRoles();

  if (!userContext) {
    redirect('/login');
  }

  if (userContext.roles.length > 0) {
    redirect(userContext.primaryRedirectPath);
  }

  const displayName = userContext.profile?.full_name || userContext.user.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="w-full max-w-lg space-y-6 bg-[var(--surface)] p-8 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs text-center">
        <div className="flex flex-col items-center">
          <BrandMark variant="seal" size={64} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">
            <Clock className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Pending Administrator Approval</span>
          </div>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] font-[family-name:var(--font-display)]">
          Account pending assignment
        </h1>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Welcome, <span className="font-semibold text-[var(--foreground)]">{displayName}</span>.
          Your account has been registered, but you have not yet been assigned an institutional accreditation role.
        </p>

        <div className="rounded-[var(--radius-control)] bg-[var(--surface-muted)] p-4 border border-[var(--border)] text-left text-xs space-y-2 text-[var(--text-secondary)]">
          <p className="font-medium text-[var(--foreground)] text-xs">
            Administrative provisioning steps
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)] text-[11px]">
            <li>An institutional Super Administrator or QA Director must grant your role.</li>
            <li>Supported roles: <code className="text-[var(--foreground)] bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">admin</code>, <code className="text-[var(--foreground)] bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">coordinator</code>, <code className="text-[var(--foreground)] bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">evaluator</code>, or <code className="text-[var(--foreground)] bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">faculty</code>.</li>
            <li>Once approved, you will gain immediate access to your workspace.</li>
          </ul>
        </div>

        <form action={logout} className="pt-2">
          <Button
            type="submit"
            variant="outline"
            className="w-full text-xs font-medium"
          >
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
