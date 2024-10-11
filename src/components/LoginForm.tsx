"use client";

import { authenticate } from "@/lib/actions-server-only";
import { useActionState } from "react";

export const LoginForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction}>
      <div>
        <h1>Admin Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
        />
        <button aria-disabled={isPending}>
          <strong>Log in</strong>
        </button>
        <div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </form>
  );
};
