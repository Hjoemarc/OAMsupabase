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
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-[family-name:var(--font-body)] antialiased selection:bg-[var(--accent)] selection:text-white">
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
        </div>
      </div>
    </AccreditationStoreProvider>
  );
}
