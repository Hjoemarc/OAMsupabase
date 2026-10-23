import { requireRole } from '@/features/auth/guards';
import { EvaluatorOverview } from '@/features/evaluations/components/evaluator-overview';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Evaluator Workspace | ZPPSU OAMS',
  description: 'Evidence verification, compliance auditing, scoring rubrics, and formal audit findings.',
};

export default async function EvaluatorDashboardPage() {
  const auth = await requireRole('evaluator');
  const userEmail = auth.user.email ?? 'evaluator@oams.edu';

  return <EvaluatorOverview evaluatorEmail={userEmail} />;
}
