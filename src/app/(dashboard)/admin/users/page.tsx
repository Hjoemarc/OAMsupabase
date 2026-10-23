import Link from 'next/link';
import { requireRole } from '@/features/auth/guards';
import { getUsersWithRoles } from '@/features/users/queries';
import { UserRoleTable } from '@/features/users/components/user-role-table';

export const instant = false;

export const metadata = {
  title: 'User & Role Directory | OAMS Administration',
  description: 'Manage institutional accreditation personnel, approve pending accounts, and configure RBAC roles.',
};

export default async function AdminUsersPage() {
  const auth = await requireRole('admin');
  const { users, totalUsers, pendingCount, roleCounts } = await getUsersWithRoles();

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/admin" className="hover:text-indigo-600 transition">
            &larr; Back to Admin Console
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-300 font-medium">User Directory</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personnel & Role Management
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Grant or revoke operational roles and approve pending registrations across academic departments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="block text-xs text-slate-500">Total Users</span>
              <span className="block text-lg font-bold text-slate-900 dark:text-white">{totalUsers}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <span className="block text-xs text-amber-600 dark:text-amber-400 font-medium">Pending Approval</span>
              <span className="block text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Administrators</span>
          <span className="text-sm font-bold text-purple-900 dark:text-purple-200">{roleCounts.admin}</span>
        </div>
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Coordinators</span>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-200">{roleCounts.coordinator}</span>
        </div>
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Evaluators</span>
          <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{roleCounts.evaluator}</span>
        </div>
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Faculty Leads</span>
          <span className="text-sm font-bold text-amber-900 dark:text-amber-200">{roleCounts.faculty}</span>
        </div>
      </div>

      {/* Interactive User Table */}
      <UserRoleTable users={users} currentAdminId={auth.user.id} />
    </div>
  );
}
