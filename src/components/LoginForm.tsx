"use client";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);
  const { pending } = useFormStatus();
  const { status } = useSession();
  const router = useRouter();

  // Redirect when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  return (
    <form action={formAction}>
      <div>
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <br />
        <div>
          <label htmlFor="Email">Email</label> &ensp;
          <input
            type="email"
            name="email"
            id="email"
            placeholder="user@domain.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label> &ensp;
          <input
            type="password"
            name="password"
            id="password"
            placeholder="secret123"
            required
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-3 bg-teal-200 rounded-xl"
        >
          {pending ? "Logging in..." : <strong>Log in</strong>}
        </button>
        <div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </form>
  );
};
