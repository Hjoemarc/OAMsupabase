import { requireRole } from '@/features/auth/guards';
import { MockSurveyWorkspace } from '@/features/mock-survey/components/mock-survey-workspace';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mock Survey Simulation | ZPPSU OAMS',
  description: 'Simulated pre-accreditation mock audits, risk analysis, and finding promotion.',
};

export default async function EvaluatorMockSurveyPage() {
  await requireRole('evaluator');
  return <MockSurveyWorkspace />;
}
