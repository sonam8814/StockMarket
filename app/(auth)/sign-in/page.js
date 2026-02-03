"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import FooterLink from "@/components/forms/FooterLink";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("=== SIGN IN FORM DATA ===", data);
    setLoading(true);

    try {
      const result = await signInWithEmail({
        email: data.email,
        password: data.password,
      });

      console.log("=== SIGN IN RESULT ===", result);

      if (result.success) {
        toast.success("Welcome back!");
        router.push("/");
      } else {
        toast.error(result.error || "Failed to sign in");
      }
    } catch (error) {
      console.error("=== SIGN IN ERROR ===", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-yellow-400 text-3xl font-bold">Signalist</div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@jsmastery.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-6"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer Link */}
      <FooterLink
        text="Don't have an account?"
        linkText="Create an account"
        href="/sign-up"
      />
    </div>
  );
}