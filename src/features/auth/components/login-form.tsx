'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login } from '../actions';
import { type AuthActionState } from '../schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && (
        <div
          role="alert"
          className="rounded-[var(--radius-control)] bg-red-50 border border-red-200 p-3.5 text-xs text-red-700"
        >
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>Authentication failed</span>
          </div>
          <p className="mt-1 text-red-600">{state.error}</p>
        </div>
      )}

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
            placeholder="coordinator@university.edu"
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
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-[var(--foreground)]"
          >
            Password
          </label>
        </div>
        <div className="mt-1.5">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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

      <Button
        type="submit"
        disabled={isPending}
        className="w-full justify-center"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </span>
        ) : (
          'Sign in to ZPPSU OAMS'
        )}
      </Button>

      <div className="text-center text-xs text-[var(--text-muted)] pt-2">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Register for access
        </Link>
      </div>
    </form>
  );
}
