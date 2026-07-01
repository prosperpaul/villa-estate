"use client";

import { useActionState } from "react";
import { signInAction } from "./actions";

export default function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signInAction, null);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Email
        </div>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="you@vilaestate.co"
          className="input"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            Password
          </span>
          <a href="#" className="text-xs text-fg-muted hover:text-brand">
            Forgot?
          </a>
        </div>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="input"
        />
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
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
