import { requireRole } from '@/features/auth/guards';
import { ReviewWorkbench } from '@/features/evaluations/components/review-workbench';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Review Management | ZPPSU OAMS',
  description: 'QA Coordinator document reviews and revision requests.',
};

export default async function CoordinatorReviewsPage() {
  await requireRole('coordinator');
  return <ReviewWorkbench />;
}
