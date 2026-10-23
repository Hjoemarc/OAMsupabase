import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { logout } from '@/features/auth/actions';

export const instant = false;

export const metadata = {
  title: 'Pending Role Assignment | OAMS',
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 mb-2">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Pending Assignment
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Welcome, <span className="font-semibold text-slate-900 dark:text-slate-200">{displayName}</span>.
          Your account has been successfully created, but you have not yet been assigned an accreditation role.
        </p>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            Next Steps
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>An institutional Super Administrator or QA Director must assign your role.</li>
            <li>Supported roles: <code>admin</code>, <code>coordinator</code>, <code>evaluator</code>, or <code>faculty</code>.</li>
            <li>Once assigned, you will gain immediate access to your accreditation workspace.</li>
          </ul>
        </div>

        <form action={logout} className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
