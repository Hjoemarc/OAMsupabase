import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCurrentUserWithRoles } from '@/features/auth/queries';
import { RegisterForm } from '@/features/auth/components/register-form';
import { BrandMark } from '@/components/layout/brand-mark';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign Up | ZPPSU OAMS',
  description: 'Create your account to access your accreditation workspace.',
};

export default async function RegisterPage() {
  const userContext = await getCurrentUserWithRoles();

  if (userContext) {
    redirect(userContext.primaryRedirectPath);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] bg-[var(--background)]">
      {/* Campus photo panel */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#800000] text-white">
        {/* Photo sits in a 16:9 frame so the whole campus view shows, then fades into maroon */}
        <div aria-hidden className="absolute inset-x-0 top-0 aspect-[16/9]">
          <Image
            src="/brand/campus.jpeg"
            alt=""
            fill
            priority
            sizes="58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4d0000]/60 via-transparent to-[#800000]" />
        </div>
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[#D97706]" />

        <header className="relative z-10 flex items-center gap-3 p-10">
          <BrandMark variant="seal" size={48} priority />
          <div className="leading-tight">
            <span className="block font-[family-name:var(--font-display)] text-lg font-semibold tracking-wide">
              ZPPSU
            </span>
            <span className="block text-xs text-white/85">
              Zamboanga Peninsula Polytechnic State University
            </span>
          </div>
        </header>

        <div className="relative z-10 p-10 pb-12 max-w-2xl space-y-4">
          <span className="inline-block h-1 w-12 rounded-full bg-[#D97706]" />
          <h1 className="font-[family-name:var(--font-display)] text-4xl xl:text-5xl font-semibold leading-[1.05] tracking-tight">
            Online Accreditation
            <br />
            Management System
          </h1>
          <p className="text-base text-white/90 leading-relaxed max-w-md">
            Join your department leads and accreditation team to manage programs and submit evidence.
          </p>
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.2em] text-[#FCD34D]">
            Un Sagwan, Un Layag
          </p>
        </div>
      </section>

      {/* Sign up panel */}
      <main className="flex flex-col min-h-screen lg:min-h-0">
        <div className="lg:hidden h-[3px] bg-[#800000]" />

        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm space-y-7">
            <div className="space-y-4">
              <BrandMark variant="seal" size={56} priority className="lg:hidden" />
              <div className="space-y-1.5">
                <h2 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                  Sign up
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Create your account with your school credentials.
                </p>
              </div>
            </div>

            <div>
              <RegisterForm />
            </div>
          </div>
        </div>

        <footer className="px-6 pb-6 text-center text-xs text-[var(--text-muted)]">
          ZPPSU Quality Assurance Office
        </footer>
      </main>
    </div>
  );
}
