"use client";

import { useActionState } from "react";
import { studioSignUpAction } from "./actions";

export default function StudioSignUpForm() {
  const [state, action, pending] = useActionState(studioSignUpAction, null);

  return (
    <form action={action} className="mt-8 space-y-4">
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
          Studio email
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
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
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
        {pending ? "Creating studio account…" : "Create studio account"}
      </button>
    </form>
  );
}
