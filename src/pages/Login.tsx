"use client";

import { AuthFormSplitScreen } from "@/components/ui/login";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const handleLogin = async (data: any) => {
    console.log("Form submitted with:", data);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Login feature coming soon!");
  };

  return (
    <AuthFormSplitScreen
      logo={
        <div className="flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-2 text-[#6F6F6F] hover:text-black transition-colors text-sm font-inter group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          <Link to="/" className="font-instrument text-4xl tracking-tighter hover:opacity-80 transition-opacity">
            Aethera<sup className="text-sm">®</sup>
          </Link>
        </div>
      }
      title="Welcome to your health portal"
      description="Access your personalized medical records, appointments, and wellness insights with Aethera."
      imageSrc="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
      imageAlt="Modern medical facility interior"
      onSubmit={handleLogin}
      forgotPasswordHref="#"
      createAccountHref="/signup"
    />
  );
}
