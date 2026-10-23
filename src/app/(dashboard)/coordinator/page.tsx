import { requireRole } from '@/features/auth/guards';
import { CoordinatorOverview } from '@/features/accreditations/components/coordinator-overview';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Coordinator Workspace | ZPPSU OAMS',
  description: 'Program accreditation management, cycle scheduling, and area lead assignments.',
};

export default async function CoordinatorDashboardPage() {
  const auth = await requireRole('coordinator');
  const userEmail = auth.user.email ?? 'coordinator@oams.edu';

  return <CoordinatorOverview coordinatorEmail={userEmail} />;
}
