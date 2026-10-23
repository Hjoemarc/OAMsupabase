import { requireRole } from '@/features/auth/guards';
import { ReviewWorkbench } from '@/features/evaluations/components/review-workbench';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Review Management | ZPPSU OAMS',
  description: 'Manage evidence vetting, QA reviewer assignments, and revisions.',
};

export default async function AdminReviewsPage() {
  await requireRole('admin');
  return <ReviewWorkbench />;
}
