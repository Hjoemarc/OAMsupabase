import { requireRole } from '@/features/auth/guards';
import { AccreditationTimeline } from '@/features/accreditations/components/accreditation-timeline';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Accreditation Timeline | ZPPSU OAMS',
  description: 'Program Accreditation Status & Validity Periods.',
};

export default async function CoordinatorTimelinePage() {
  await requireRole('coordinator');
  return <AccreditationTimeline />;
}
