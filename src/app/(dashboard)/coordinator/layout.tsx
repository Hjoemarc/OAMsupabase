import { requireRole } from '@/features/auth/guards';

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('coordinator');
  return <>{children}</>;
}
