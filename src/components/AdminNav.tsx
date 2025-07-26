"use client";
import { logout } from "@/lib/actions";
import { useSession } from "next-auth/react";
// import { useFormStatus } from "react-dom";

// Separate button component to handle form submission state
// function LogoutButton() {
//   const { pending } = useFormStatus();

//   return (
//     <button
//       type="submit"
//       disabled={pending}
//       className={`px-4 py-2 ${
//         pending ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
//       } text-white rounded transition-colors`}
//     >
//       {pending ? "Logging out..." : "Log out"}
//     </button>
//   );
// }

export default function AdminNav() {
  const { status, data: session } = useSession();

  console.log("Auth Status:", status);
  console.log("Session Data:", session);

  return (
    <nav className="p-4 bg-slate-100">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        {status === "loading" ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          status === "authenticated" && (
            <div className="flex items-center gap-4">
              <span className="text-sm"> {session?.user?.email}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Log out
                </button>
              </form>
            </div>
          )
        )}
      </div>
    </nav>
  );
}
