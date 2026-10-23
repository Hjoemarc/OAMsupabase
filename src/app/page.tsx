import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';

export const instant = false;

export default async function RootPage() {
  const auth = await getCurrentUserWithRoles();

  if (!auth) {
    redirect('/login');
  }

  redirect(auth.primaryRedirectPath);
}
