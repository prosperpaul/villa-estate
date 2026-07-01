"use client";

import { useActionState, useState } from "react";
import { signUpAction } from "./actions";

export default function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signUpAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Full name
        </div>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          autoFocus
          placeholder="Léa Marchand"
          className="input"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Email
        </div>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@vilaestate.co"
          className="input"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Password
        </div>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg"
          >
            {showPassword ? (
              // eye-off icon
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.31 20.31 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.62 20.62 0 0 1-3.17 4.09M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22" />
              </svg>
            ) : (
              // eye icon
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>

      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
