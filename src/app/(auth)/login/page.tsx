import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { LoginForm } from '@/features/auth/components/login-form';

export const instant = false;

export const metadata = {
  title: 'Sign In | OAMS Accreditation Portal',
  description: 'Sign in to access your accreditation workspace and evaluation records.',
};

export default async function LoginPage() {
  const userContext = await getCurrentUserWithRoles();

  if (userContext) {
    redirect(userContext.primaryRedirectPath);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 mb-3 font-bold text-lg tracking-wider">
            OAMS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Accreditation Management
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in with your institutional credentials
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
