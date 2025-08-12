import { LoginForm } from "@/components/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-900">
      <div className="max-w-md w-full mx-4">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/icon.svg"
              alt="Vocabinary Logo"
              height={40}
              width={40}
            />
            <h1 className="text-2xl font-serif font-bold text-white">
              Vocabinary
            </h1>
          </div>
        </div>

        {/* Login Form Card */}
        <LoginForm />
      </div>
    </div>
  );
}
