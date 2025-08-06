import { LoginForm } from "@/components/login-form";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  console.log("at LoginPage");
  return (
    <main>
      <LoginForm />
    </main>
  );
}
