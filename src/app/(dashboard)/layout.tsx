import Link from 'next/link';
import { requireAuth } from '@/features/auth/guards';
import { logout } from '@/features/auth/actions';

export const instant = false;

const ROLE_LABELS: Record<string, string> = {
  admin: 'Super Admin',
  coordinator: 'QA Coordinator',
  evaluator: 'Auditor / Evaluator',
  faculty: 'Area Faculty Lead',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  coordinator: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  evaluator: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  faculty: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAuth();

  const displayName = auth.profile?.full_name || auth.user.email;
  const userRoles = auth.roles;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <Link
                href={auth.primaryRedirectPath}
                className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white group"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm shadow-sm group-hover:bg-indigo-700 transition">
                  OA
                </span>
                <div className="leading-tight">
                  <span className="block text-base font-bold">OAMS</span>
                  <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    Accreditation Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Workspace Switcher Navigation */}
            <nav
              aria-label="Workspace Switcher"
              className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
            >
              {userRoles.map((role) => (
                <Link
                  key={role}
                  href={`/${role}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition shadow-none hover:shadow-xs"
                >
                  {ROLE_LABELS[role] ?? role}
                </Link>
              ))}
            </nav>

            {/* User Session Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                  {displayName}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  {userRoles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${ROLE_COLORS[role] ?? ''}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs transition"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Workspace Switcher Bar */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspaces:
          </span>
          {userRoles.map((role) => (
            <Link
              key={role}
              href={`/${role}`}
              className="shrink-0 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {ROLE_LABELS[role] ?? role}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Online Accreditation Management System (OAMS) &bull; Institutional Quality Assurance Portal
      </footer>
    </div>
  );
}
