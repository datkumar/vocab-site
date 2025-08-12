import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const adminActions = [
    {
      title: "Add New Word",
      description: "Add a new word to the vocabulary database",
      href: "/admin/new-word",
      icon: "➕",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      title: "Manage Words",
      description: "Edit or delete existing words",
      href: "#",
      icon: "✏️",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      title: "Import Words",
      description: "Import words from a file",
      href: "#",
      icon: "📁",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      title: "Statistics",
      description: "View vocabulary statistics and insights",
      href: "#",
      icon: "📊",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Manage your vocabulary database from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Words
          </h3>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Added This Week
          </h3>
          <p className="text-3xl font-bold text-green-600">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Categories
          </h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {adminActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${action.color}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{action.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// export default function AdminHomePage() {
//   return (
//     <main className="container max-w-6xl pt-2">
//       <Link href="/admin/new-word">
//         <button className="flex items-center gap-2 cursor-pointer bg-slate-50 text-amber-700 text-lg px-4 py-3 rounded-lg hover:bg-slate-100 transition shadow">
//           <img src="/ic-plus.svg" alt="plus icon" width={24} height={24} />
//           <span>Add New Word</span>
//         </button>
//       </Link>
//     </main>
//   );
// }
