'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { register } from '../actions';
import { type AuthActionState } from '../schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
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
            placeholder="Dr. Jane Doe"
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
          Institutional email
        </label>
        <div className="mt-1.5">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="faculty@university.edu"
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
        <div className="mt-1.5">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
            placeholder="••••••••"
            aria-invalid={Boolean(state?.fieldErrors?.password)}
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
          />
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
        <div className="mt-1.5">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
            placeholder="••••••••"
            aria-invalid={Boolean(state?.fieldErrors?.confirmPassword)}
            aria-describedby={state?.fieldErrors?.confirmPassword ? 'confirm-error' : undefined}
          />
        </div>
        {state?.fieldErrors?.confirmPassword && (
          <p id="confirm-error" className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full justify-center"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </span>
        ) : (
          'Register for ZPPSU OAMS'
        )}
      </Button>

      <div className="text-center text-xs text-[var(--text-muted)] pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
