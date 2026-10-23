import { requireRole } from '@/features/auth/guards';
import { AssignmentChecklist } from '@/features/evidence/components/assignment-checklist';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Assignments | ZPPSU OAMS',
  description: 'Assigned accreditation standards, parameters, and self-survey tasks.',
};

export default async function FacultyAssignmentsPage() {
  await requireRole('faculty');
  return <AssignmentChecklist />;
}
