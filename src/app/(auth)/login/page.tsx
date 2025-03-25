"use client";
import { LoginForm } from "@/components/auth/login-form";
import { CredentialType } from "@/lib/enum";
import { AuthContextProvider } from "@/providers/authContext-provider";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-200">
      <div className="w-full max-w-sm">
        <AuthContextProvider>
          <LoginForm type={CredentialType.Employee} />
        </AuthContextProvider>
      </div>
    </div>
    
  );
}
