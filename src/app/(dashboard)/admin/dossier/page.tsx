import { requireRole } from '@/features/auth/guards';
import { SSRDossierCompiler } from '@/features/reports/components/ssr-dossier-compiler';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SSR & Exhibit Dossier Compiler | ZPPSU OAMS',
  description: 'Compile self-survey reports and authenticated digital exhibit dossiers for accreditation audit teams.',
};

export default async function AdminDossierPage() {
  await requireRole('admin');
  return <SSRDossierCompiler />;
}
