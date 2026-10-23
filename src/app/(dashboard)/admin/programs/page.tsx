import { requireRole } from '@/features/auth/guards';
import { ProgramCatalog } from '@/features/accreditations/components/program-catalog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Program Management | ZPPSU OAMS',
  description: 'Manage Academic Colleges, Departments, and Degree Programs.',
};

export default async function AdminProgramsPage() {
  await requireRole('admin');
  return <ProgramCatalog />;
}
