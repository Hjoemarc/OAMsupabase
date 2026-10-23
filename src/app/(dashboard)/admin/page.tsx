import { requireRole } from '@/features/auth/guards';
import { getUsersWithRoles } from '@/features/users/queries';
import { AdminOverview } from '@/features/accreditations/components/admin-overview';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Administrator Workspace | ZPPSU OAMS',
  description: 'Executive QA administration, personnel role management, and institutional accreditation framework.',
};

export default async function AdminDashboardPage() {
  const auth = await requireRole('admin');
  const { totalUsers, pendingCount } = await getUsersWithRoles();
  const adminEmail = auth.profile?.full_name || auth.user.email || 'admin@oams.edu';

  return (
    <AdminOverview
      totalUsers={totalUsers}
      pendingCount={pendingCount}
      adminEmail={adminEmail}
    />
  );
}
