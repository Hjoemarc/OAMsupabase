import { requireRole } from '@/features/auth/guards';
import { FacultyOverview } from '@/features/evidence/components/faculty-overview';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Faculty Workspace | ZPPSU OAMS',
  description: 'Evidence submission, self-survey narration, and parameter compliance documentation.',
};

export default async function FacultyDashboardPage() {
  const auth = await requireRole('faculty');
  const userEmail = auth.user.email ?? 'faculty@oams.edu';

  return <FacultyOverview facultyEmail={userEmail} />;
}
