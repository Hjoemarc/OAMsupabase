import { requireRole } from '@/features/auth/guards';
import { EvidenceVault } from '@/features/evidence/components/evidence-vault';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Document Management | ZPPSU OAMS',
  description: 'Evidence document repository, artifact versioning, and verification statuses.',
};

export default async function FacultyDocumentsPage() {
  await requireRole('faculty');
  return <EvidenceVault />;
}
