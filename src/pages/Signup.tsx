"use client";

import { AuthSignupSplitScreen } from "@/components/ui/signup";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (data: any) => {
    try {
      const response = await api.post<{ token: string; user: { id: string; email: string; name: string; role: string } }>('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Save token & user details
      localStorage.setItem('aethera_token', response.token);
      localStorage.setItem('aethera_user', JSON.stringify(response.user));

      alert('Account successfully created!');
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Signup failed. Please try again.');
      throw error;
    }
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
