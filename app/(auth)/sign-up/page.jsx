"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import FooterLink from "@/components/forms/FooterLink";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      country: "US",
      experienceLevel: "beginner",
      investmentGoal: "long-term-growth",
      riskTolerance: "moderate",
    },
  });

  const onSubmit = async (data) => {
    console.log("=== SIGN UP FORM DATA ===", data);
    setLoading(true);

    try {
      if (!data.email || !data.password || !data.name) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const result = await signUpWithEmail({
        email: data.email,
        password: data.password,
        name: data.name,
        country: data.country,
        experienceLevel: data.experienceLevel,
        investmentGoal: data.investmentGoal,
        riskTolerance: data.riskTolerance,
      });

      console.log("=== SIGN UP RESULT ===", result);

      if (result.success) {
        toast.success("Account created! Please sign in.");
        router.push("/sign-in");
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("=== SIGN UP ERROR ===", error);
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
        <h2 className="text-3xl font-bold text-white">Create your account</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className="text-white">Country</Label>
          <select
            id="country"
            {...register("country", { required: "Country is required" })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="CN">China</option>
            <option value="BR">Brazil</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experienceLevel" className="text-white">Experience Level</Label>
          <select
            id="experienceLevel"
            {...register("experienceLevel", { required: "Experience level is required" })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-sm">{errors.experienceLevel.message}</p>
          )}
        </div>

        {/* Investment Goal */}
        <div className="space-y-2">
          <Label htmlFor="investmentGoal" className="text-white">Investment Goal</Label>
          <select
            id="investmentGoal"
            {...register("investmentGoal", { required: "Investment goal is required" })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="long-term-growth">Long-term Growth</option>
            <option value="income">Income Generation</option>
            <option value="preservation">Capital Preservation</option>
            <option value="speculation">Speculation</option>
          </select>
          {errors.investmentGoal && (
            <p className="text-red-500 text-sm">{errors.investmentGoal.message}</p>
          )}
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-2">
          <Label htmlFor="riskTolerance" className="text-white">Risk Tolerance</Label>
          <select
            id="riskTolerance"
            {...register("riskTolerance", { required: "Risk tolerance is required" })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          {errors.riskTolerance && (
            <p className="text-red-500 text-sm">{errors.riskTolerance.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-6"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Footer Link */}
      <FooterLink
        text="Already have an account?"
        linkText="Sign in"
        href="/sign-in"
      />
    </div>
  );
}