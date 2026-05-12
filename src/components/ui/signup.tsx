"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type SignupValues = z.infer<typeof signupSchema>;

export interface AuthSignupSplitScreenProps {
  logo: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  onSubmit: (data: SignupValues) => Promise<void>;
  loginHref: string;
}

export function AuthSignupSplitScreen({
  logo,
  title,
  description,
  imageSrc,
  imageAlt,
  onSubmit,
  loginHref,
}: AuthSignupSplitScreenProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: true,
    },
  });

  const handleFormSubmit = async (data: SignupValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants} className="mb-4">
              {logo}
            </motion.div>
            <motion.div variants={itemVariants} className="text-left">
              <h1 className="font-instrument text-4xl md:text-5xl font-medium tracking-tight mb-2 italic text-black/90">
                {title}
              </h1>
              <p className="font-inter text-base text-[#6F6F6F] max-sm">
                {description}
              </p>
            </motion.div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="font-inter"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            className="font-inter"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            className="font-inter"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal font-inter text-xs text-muted-foreground">
                            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 h-12 rounded-full font-inter" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </motion.div>
              </form>
            </Form>

            <motion.p
              variants={itemVariants}
              className="px-8 text-center text-sm text-muted-foreground font-inter"
            >
              Already have an account?{" "}
              <Link
                to={loginHref}
                className="font-medium text-[#C8A96B] hover:underline"
              >
                Sign in here
              </Link>
              .
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Image */}
      <div className="relative hidden w-1/2 md:block overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover grayscale-[0.2] hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="font-instrument text-4xl mb-4 italic text-white/90">"Healthcare is a human right, not a privilege."</h2>
          <p className="font-inter text-white/60 tracking-widest uppercase text-sm">— Health Advocacy</p>
        </div>
      </div>
    </div>
  );
}
