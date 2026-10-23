import { requireRole } from '@/features/auth/guards';

export default async function EvaluatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('evaluator');
  return <>{children}</>;
}
