"use client";

import { logout } from "@/lib/actions";

export const LogoutBtn = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition-colors ease-in"
      >
        Sign Out
      </button>
    </form>
  );
};
