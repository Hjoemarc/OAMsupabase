import { requireRole } from '@/features/auth/guards';
import { CQITracker } from '@/features/cqi/components/cqi-tracker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CQI Action Plan Tracker | ZPPSU OAMS',
  description: 'Continuous quality improvement post-accreditation action plan tracking and deficiency remediation.',
};

export default async function CoordinatorCQIPage() {
  await requireRole('coordinator');
  return <CQITracker />;
}
