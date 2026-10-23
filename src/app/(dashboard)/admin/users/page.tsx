import Link from 'next/link';
import { requireRole } from '@/features/auth/guards';
import { getUsersWithRoles } from '@/features/users/queries';
import { UserDirectory } from '@/features/users/components/user-directory';
import { ChevronLeft, Users, ShieldCheck, Award, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Personnel Directory | ZPPSU OAMS',
  description: 'Manage institutional accreditation personnel, approve pending accounts, and configure RBAC roles.',
};

export default async function AdminUsersPage() {
  const auth = await requireRole('admin');
  const { users, totalUsers, pendingCount, roleCounts } = await getUsersWithRoles();

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
          <Link href="/admin" className="hover:text-[var(--foreground)] transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Admin console</span>
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Personnel directory</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
              Personnel and role management
            </h1>
            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
              Provision institutional accreditation personnel, review pending registrations, and toggle RBAC roles
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-[var(--surface)] px-4 py-2 rounded-[var(--radius-control)] border border-[var(--border)] text-center shadow-2xs">
              <span className="block text-[11px] text-[var(--text-muted)]">Total personnel</span>
              <span className="block text-base font-semibold text-[var(--foreground)] tabular-nums">{totalUsers}</span>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-[var(--radius-control)] border border-amber-200 text-center shadow-2xs">
              <span className="block text-[11px] text-amber-800 font-medium">Pending approval</span>
              <span className="block text-base font-semibold text-amber-900 tabular-nums">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--radius-control)] bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Users className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Administrators</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--foreground)] tabular-nums">{roleCounts.admin}</span>
        </Card>

        <Card className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--radius-control)] bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Coordinators</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--foreground)] tabular-nums">{roleCounts.coordinator}</span>
        </Card>

        <Card className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--radius-control)] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Award className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Evaluators</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--foreground)] tabular-nums">{roleCounts.evaluator}</span>
        </Card>

        <Card className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--radius-control)] bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <GraduationCap className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Faculty leads</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--foreground)] tabular-nums">{roleCounts.faculty}</span>
        </Card>
      </div>

      {/* Interactive User Table */}
      <UserDirectory users={users} currentAdminId={auth.user.id} />
    </div>
  );
}
