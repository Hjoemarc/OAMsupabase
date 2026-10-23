import { requireRole } from '@/features/auth/guards';
import { RubricEvaluator } from '@/features/evaluations/components/rubric-evaluator';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Review Documents & Audits | ZPPSU OAMS',
  description: 'Auditor assessment of submitted evidence, score evaluation, and finding reports.',
};

export default async function EvaluatorReviewsPage() {
  await requireRole('evaluator');
  return <RubricEvaluator />;
}
