"use client";
import { authenticate } from "@/lib/actions";
import { useActionState } from "react";

export const LoginForm = () => {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <main className="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-2xl text-center font-bold text-slate-700">
            Admin Login
          </h1>
          <form className="space-y-4" action={formAction}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="john@example.com"
                required={true}
                className={inputBoxClsName}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="******"
                required={true}
                className={inputBoxClsName}
              />
            </div>

            {errorMessage && (
              <p className="text-red-600 text-lg text-center py-2">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-600 px-5 py-3 mt-4 text-center text-xl font-bold text-white hover:bg-amber-800 focus:ring-4 focus:ring-amber-300 focus:outline-none"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

const inputBoxClsName =
  "block w-full pl-2 font-mono text-sm rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-amber-800 focus:ring-amber-700";
