import { requireRole } from '@/features/auth/guards';

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('faculty');
  return <>{children}</>;
}
