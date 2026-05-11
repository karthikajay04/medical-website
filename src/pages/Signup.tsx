"use client";

import { AuthSignupSplitScreen } from "@/components/ui/signup";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const handleSignup = async (data: any) => {
    console.log("Signup submitted with:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Signup feature coming soon!");
  };

  return (
    <AuthSignupSplitScreen
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
      title="Join our care network"
      description="Create an account to manage your health records and book appointments online."
      imageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
      imageAlt="Doctors collaborating in a modern clinic"
      onSubmit={handleSignup}
      loginHref="/login"
    />
  );
}
