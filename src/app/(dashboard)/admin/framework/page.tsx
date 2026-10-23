import { requireRole } from '@/features/auth/guards';
import { CriteriaFramework } from '@/features/criteria/components/criteria-framework';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Accreditation Framework | ZPPSU OAMS',
  description: 'Manage 10 AACCUP Standard Areas, Parameters, and Core Indicators.',
};

export default async function AdminFrameworkPage() {
  await requireRole('admin');
  return <CriteriaFramework />;
}
