import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { RegisterForm } from '@/features/auth/components/register-form';
import { BrandMark } from '@/components/layout/brand-mark';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Account | ZPPSU OAMS',
  description: 'Register for institutional accreditation access to ZPPSU OAMS.',
};

export default async function RegisterPage() {
  const userContext = await getCurrentUserWithRoles();

  if (userContext) {
    redirect(userContext.primaryRedirectPath);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)]">
      {/* Left Brand Panel */}
      <div className="md:w-5/12 lg:w-4/12 bg-[#800000] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#660000]">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 opacity-5 pointer-events-none select-none">
          <BrandMark variant="seal" size={320} />
        </div>

        <div>
          <div className="flex items-center gap-3.5">
            <div className="p-1 bg-white/10 rounded-lg backdrop-blur-xs border border-white/15 shadow-sm">
              <BrandMark variant="seal" size={44} priority />
            </div>
            <div>
              <span className="block font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-[#FCD34D]">
                ZPPSU
              </span>
              <span className="block text-[11px] text-white/80 font-normal">
                Region IX · Zamboanga City
              </span>
            </div>
          </div>

          <div className="mt-12 md:mt-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              Personnel Provisioning
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-white">
              Institutional Accreditation Portal
            </h1>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Register as an Area Faculty Lead, Program Coordinator, or Accreditation Auditor to collaborate on institutional evaluations.
            </p>

            <div className="pt-2">
              <div className="w-12 h-0.5 bg-[#D97706] mb-4" />
              <BrandMark variant="tagline" size={150} className="filter drop-shadow-sm opacity-95" />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-0 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <span>ZPPSU Quality Assurance Office</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--foreground)] tracking-tight">
              Create personnel account
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Register with your institutional credentials. An administrator will review your account.
            </p>
          </div>

          <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
