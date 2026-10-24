'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { register } from '../actions';
import { type AuthActionState } from '../schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const initialState: AuthActionState = {};

const SOCIAL_PROVIDERS = [
  {
    name: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8l4.01-3.1z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.96h-1.52c-1.49 0-1.96.93-1.96 1.88V12h3.34l-.53 3.47h-2.81v8.38A12 12 0 0 0 24 12z" />
      </svg>
    ),
  },
  {
    name: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" />
      </svg>
    ),
  },
  {
    name: 'Yahoo',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="#6001D2" d="M13.13 24h-3.4l.01-7.07L3.5 4.6h3.9l4.1 7.9 4.13-7.9h3.87l-6.38 12.33V24zM19.4 8.4a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z" />
      </svg>
    ),
  },
];

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [step, setStep] = useState<1 | 2>(1);

  // Controlled values for step validation & continuity
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const handleNextStep = () => {
    setStep1Error(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setStep1Error('Please enter your full name (at least 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setStep1Error('Please enter a valid email address.');
      return;
    }
    setStep(2);
  };

  return (
    <div className="space-y-6">
      {/* 2-Step Interactive Progress Stepper */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              step === 1
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {step === 2 && fullName && email ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '1'}
          </button>
          <div className="leading-tight">
            <span className="block text-xs font-semibold text-[var(--foreground)]">Details</span>
            <span className="block text-[10px] text-[var(--text-muted)]">Name & Email</span>
          </div>
        </div>

        <div className={`h-[2px] flex-1 mx-3 rounded-full transition-colors ${
          step === 2 ? 'bg-emerald-600' : 'bg-[var(--border)]'
        }`} />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              step === 2
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]'
            }`}
          >
            2
          </div>
          <div className="leading-tight">
            <span className="block text-xs font-semibold text-[var(--foreground)]">Password</span>
            <span className="block text-[10px] text-[var(--text-muted)]">Security Setup</span>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-5" noValidate>
        {state?.error && (
          <div
            role="alert"
            className="rounded-[var(--radius-control)] bg-red-50 border border-red-200 p-3.5 text-xs text-red-700"
          >
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Registration error</span>
            </div>
            <p className="mt-1 text-red-600">{state.error}</p>
          </div>
        )}

        {state?.success && (
          <div
            role="status"
            className="rounded-[var(--radius-control)] bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-700"
          >
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Check your email</span>
            </div>
            <p className="mt-1 text-emerald-600">{state.success}</p>
          </div>
        )}

        {step1Error && (
          <div
            role="alert"
            className="rounded-[var(--radius-control)] bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800"
          >
            <p>{step1Error}</p>
          </div>
        )}

        {/* STEP 1: Personal Details */}
        <div className={step === 1 ? 'space-y-4' : 'hidden'}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-medium text-[var(--foreground)]"
            >
              Full name
            </label>
            <div className="mt-1.5">
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                disabled={isPending}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="h-11 bg-white"
                aria-invalid={Boolean(state?.fieldErrors?.fullName)}
                aria-describedby={state?.fieldErrors?.fullName ? 'name-error' : undefined}
              />
            </div>
            {state?.fieldErrors?.fullName && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600">
                {state.fieldErrors.fullName[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[var(--foreground)]"
            >
              School email
            </label>
            <div className="mt-1.5">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@zppsu.edu.ph"
                className="h-11 bg-white"
                aria-invalid={Boolean(state?.fieldErrors?.email)}
                aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
              />
            </div>
            {state?.fieldErrors?.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full h-11 justify-center text-sm mt-2 flex items-center gap-2"
          >
            <span>Next: Set Password</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* STEP 2: Password & Credentials */}
        <div className={step === 2 ? 'space-y-4' : 'hidden'}>
          {/* Note: hidden input fields remain in DOM so Server Action receives fullName and email */}
          {step === 2 && (
            <div className="p-2.5 rounded-[var(--radius-control)] bg-[var(--surface-muted)] border border-[var(--border)] text-xs flex items-center justify-between">
              <div className="truncate">
                <span className="font-medium text-[var(--foreground)] block truncate">{fullName}</span>
                <span className="text-[11px] text-[var(--text-muted)] block truncate">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-medium text-[#800000] hover:underline shrink-0 ml-2"
              >
                Edit
              </button>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[var(--foreground)]"
            >
              Password
            </label>
            <div className="mt-1.5 relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-white pr-10"
                aria-invalid={Boolean(state?.fieldErrors?.password)}
                aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 px-3 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {state?.fieldErrors?.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-600">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-[var(--foreground)]"
            >
              Confirm password
            </label>
            <div className="mt-1.5 relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                disabled={isPending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-white pr-10"
                aria-invalid={Boolean(state?.fieldErrors?.confirmPassword)}
                aria-describedby={state?.fieldErrors?.confirmPassword ? 'confirm-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute inset-y-0 right-0 px-3 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {state?.fieldErrors?.confirmPassword && (
              <p id="confirm-error" className="mt-1.5 text-xs text-red-600">
                {state.fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isPending}
              className="h-11 px-3 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 justify-center text-sm"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </div>
        </div>

        {/* Social Options (Only on Step 1 for clean onboarding UX) */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-3 pt-1">
              <span className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>

            {/* Placeholders only: not connected to any sign-in provider yet */}
            <div className="grid grid-cols-4 gap-2">
              {SOCIAL_PROVIDERS.map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  title={`${provider.name} sign-up is coming soon`}
                  aria-label={`Sign up with ${provider.name} (coming soon)`}
                  className="flex h-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] bg-white text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[#800000]"
                >
                  {provider.icon}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="text-center text-xs text-[var(--text-muted)] pt-2">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
