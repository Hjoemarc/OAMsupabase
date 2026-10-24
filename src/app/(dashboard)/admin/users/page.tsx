import Link from 'next/link';
import { requireRole } from '@/features/auth/guards';
import { getUsersWithRoles } from '@/features/users/queries';
import { UserDirectory } from '@/features/users/components/user-directory';
import { ChevronLeft, Users, ShieldCheck, Award, GraduationCap } from 'lucide-react';
import { SummaryMetricCard } from '@/components/ui/summary-metric-card';

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryMetricCard
          label="Administrators"
          value={roleCounts.admin}
          subtext="System & QA directors"
          icon={Users}
          tone="purple"
        />

        <SummaryMetricCard
          label="Coordinators"
          value={roleCounts.coordinator}
          subtext="Program accreditation leads"
          icon={ShieldCheck}
          tone="amber"
        />

        <SummaryMetricCard
          label="Evaluators"
          value={roleCounts.evaluator}
          subtext="Accreditation audit team"
          icon={Award}
          tone="emerald"
        />

        <SummaryMetricCard
          label="Faculty leads"
          value={roleCounts.faculty}
          subtext="Area leads & submitters"
          icon={GraduationCap}
          tone="rose"
        />
      </div>

      {/* Interactive User Table */}
      <UserDirectory users={users} currentAdminId={auth.user.id} />
    </div>
  );
}
