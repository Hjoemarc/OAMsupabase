import { requireRole } from '@/features/auth/guards';
import { ComplianceTracker } from '@/features/criteria/components/compliance-tracker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Compliance Tracking | ZPPSU OAMS',
  description: 'QA Coordinator compliance tracking across degree programs.',
};

export default async function CoordinatorCompliancePage() {
  await requireRole('coordinator');
  return <ComplianceTracker />;
}
