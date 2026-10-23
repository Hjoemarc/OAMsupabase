import { requireRole } from '@/features/auth/guards';
import { ComplianceTracker } from '@/features/criteria/components/compliance-tracker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Compliance Tracking | ZPPSU OAMS',
  description: 'Monitor accreditation compliance percentages and audit findings.',
};

export default async function AdminCompliancePage() {
  await requireRole('admin');
  return <ComplianceTracker />;
}
