import { requireRole } from '@/features/auth/guards';
import { CrossWalkMatrix } from '@/features/crosswalk/components/crosswalk-matrix';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Multi-Agency Cross-Walk | ZPPSU OAMS',
  description: 'Map institutional evidence across AACCUP, CHED CMOs, ISO 9001, and PTC frameworks.',
};

export default async function CoordinatorCrossWalkPage() {
  await requireRole('coordinator');
  return <CrossWalkMatrix />;
}
