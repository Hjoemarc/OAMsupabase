import { requireRole } from '@/features/auth/guards';
import { AccreditationTimeline } from '@/features/accreditations/components/accreditation-timeline';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Accreditation Timeline | ZPPSU OAMS',
  description: 'Program Accreditation Status, Validity Periods, and Survey Schedule.',
};

export default async function AdminTimelinePage() {
  await requireRole('admin');
  return <AccreditationTimeline />;
}
