'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { login } from '../actions';
import { type AuthActionState } from '../schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

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

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state?.error && (
        <div
          role="alert"
          className="rounded-[var(--radius-control)] bg-red-50 border border-red-200 p-3.5 text-xs text-red-700"
        >
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>We could not log you in</span>
          </div>
          <p className="mt-1 text-red-600">{state.error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-[var(--foreground)]"
        >
          Email
        </label>
        <div className="mt-1.5">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="name@zppsu.edu.ph"
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
            autoComplete="current-password"
            required
            disabled={isPending}
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

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded-[3px] border-[var(--border-strong)] accent-[#800000]"
          />
          Remember me
        </label>
        <button
          type="button"
          title="Coming soon"
          className="text-[var(--text-muted)] hover:text-[#800000] hover:underline underline-offset-2 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 justify-center text-sm"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Logging in...</span>
          </span>
        ) : (
          'Log in'
        )}
      </Button>

      <div className="flex items-center gap-3 pt-1">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      {/* Placeholders only: not connected to any sign-in provider yet. */}
      <div className="grid grid-cols-4 gap-2">
        {SOCIAL_PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            type="button"
            title={`${provider.name} sign-in is coming soon`}
            aria-label={`Continue with ${provider.name} (coming soon)`}
            className="flex h-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] bg-white text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[#800000]"
          >
            {provider.icon}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-[var(--text-muted)] pt-2">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Sign up now
        </Link>
      </div>
    </form>
  );
}
