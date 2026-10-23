import Link from 'next/link';
import { requireRole } from '@/features/auth/guards';
import { getUsersWithRoles } from '@/features/users/queries';

export const instant = false;

export const metadata = {
  title: 'Administrator Workspace | OAMS',
  description: 'System administration, user role assignments, and institutional accreditation configuration.',
};

export default async function AdminDashboardPage() {
  const auth = await requireRole('admin');
  const { totalUsers, pendingCount } = await getUsersWithRoles();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 mb-2">
              System Administrator Console
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Quality Assurance Administration
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage users, assign accreditation roles, and configure institutional accreditation frameworks.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Authenticated as: <span className="font-semibold text-slate-700 dark:text-slate-300">{auth.profile?.full_name || auth.user.email}</span>
          </div>
        </div>
      </div>

      {/* Domain Responsibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: User & Role Directory */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                01
              </div>
              {pendingCount > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                  {pendingCount} Pending Approval
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {totalUsers} Active Personnel
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              User & Role Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Provision user accounts, review pending registrations, and toggle roles across <code>admin</code>, <code>coordinator</code>, <code>evaluator</code>, and <code>faculty</code>.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center justify-center w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs py-2.5 px-4 shadow-sm transition"
            >
              Open User Directory &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Frameworks */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              02
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Accreditation Frameworks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Configure accrediting body templates (e.g., PAASCU, AACCUP, CHED), rating scales, and scoring rubrics across departments.
            </p>
          </div>
          <div className="pt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Domain: Criteria & Standard Specs
          </div>
        </div>

        {/* Card 3: Compliance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
              03
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              System Audit & Compliance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor institutional access logs, document modification histories, and generate comprehensive accreditation executive summaries.
            </p>
          </div>
          <div className="pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Status: System Active & Healthy
          </div>
        </div>
      </div>
    </div>
  );
}
