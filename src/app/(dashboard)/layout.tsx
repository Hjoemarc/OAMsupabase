import { requireAuth } from '@/features/auth/guards';
import { AccreditationStoreProvider } from '@/features/accreditations/context/store-context';
import { PortalSidebar } from '@/components/layout/portal-sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAuth();

  const displayName = auth.profile?.full_name || auth.user.email?.split('@')[0] || 'User';
  const userEmail = auth.user.email || 'user@oams.edu';
  const userRoles = auth.roles;

  return (
    <AccreditationStoreProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-[family-name:var(--font-body)] antialiased selection:bg-[#800000] selection:text-white">
        {/* Top 3px Institutional Maroon Accent Strip */}
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#800000] z-50 pointer-events-none" />

        {/* Left Fixed Portal Sidebar */}
        <PortalSidebar
          userEmail={userEmail}
          userName={displayName}
          roles={userRoles}
        />

        {/* Main Content Area (Offset by sidebar width on desktop) */}
        <div className="flex-1 md:pl-64 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
            {children}
          </main>

          {/* Institutional University Footer */}
          <footer className="mt-auto border-t border-[var(--border)] px-4 sm:px-6 lg:px-8 py-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-[var(--text-muted)] bg-[var(--surface)]">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-semibold text-[var(--foreground)]">ZPPSU</span>
              <span>·</span>
              <span>Online Accreditation Management System</span>
            </div>
            <div className="mt-2 sm:mt-0 font-[family-name:var(--font-display)] tracking-wide text-[11px] text-[var(--text-secondary)]">
              Un Sagwan, Un Layag · QA Accreditation Office
            </div>
          </footer>
        </div>
      </div>
    </AccreditationStoreProvider>
  );
}
