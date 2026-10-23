import { requireRole } from '@/features/auth/guards';
import { CycleManager } from '@/features/accreditations/components/cycle-manager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Accreditation Cycles | ZPPSU OAMS',
  description: 'Manage formal accreditation cycles, academic years, and survey campaigns.',
};

export default async function AdminCyclesPage() {
  await requireRole('admin');
  return <CycleManager />;
}
