'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { register } from '../actions';
import { type AuthActionState } from '../schemas';

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <div className="flex items-center gap-2 font-medium">
            <svg
              className="w-4 h-4 shrink-0 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span>Registration Error</span>
          </div>
          <p className="mt-1 text-xs">{state.error}</p>
        </div>
      )}

      {state?.success && (
        <div
          role="status"
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <div className="flex items-center gap-2 font-medium">
            <svg
              className="w-4 h-4 shrink-0 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Check Your Email</span>
          </div>
          <p className="mt-1 text-xs">{state.success}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Full Name
        </label>
        <div className="mt-1.5">
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            disabled={isPending}
            placeholder="Dr. Jane Doe"
            aria-invalid={Boolean(state?.fieldErrors?.fullName)}
            aria-describedby={state?.fieldErrors?.fullName ? 'name-error' : undefined}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 disabled:opacity-50 transition"
          />
        </div>
        {state?.fieldErrors?.fullName && (
          <p id="name-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.fullName[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Institutional Email
        </label>
        <div className="mt-1.5">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="faculty@university.edu"
            aria-invalid={Boolean(state?.fieldErrors?.email)}
            aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 disabled:opacity-50 transition"
          />
        </div>
        {state?.fieldErrors?.email && (
          <p id="email-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <div className="mt-1.5">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
            placeholder="••••••••"
            aria-invalid={Boolean(state?.fieldErrors?.password)}
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 disabled:opacity-50 transition"
          />
        </div>
        {state?.fieldErrors?.password && (
          <p id="password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Confirm Password
        </label>
        <div className="mt-1.5">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
            placeholder="••••••••"
            aria-invalid={Boolean(state?.fieldErrors?.confirmPassword)}
            aria-describedby={state?.fieldErrors?.confirmPassword ? 'confirm-error' : undefined}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 disabled:opacity-50 transition"
          />
        </div>
        {state?.fieldErrors?.confirmPassword && (
          <p id="confirm-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating Account...
          </span>
        ) : (
          'Register for OAMS'
        )}
      </button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
