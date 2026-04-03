'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: async () => {
            toast.success('Welcome back!');
            // Wait for cookie to be set
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = '/';
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Invalid email or password');
            setIsLoading(false);
          },
        },
      });

    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-yellow-400 text-3xl font-bold">Signalist</div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            disabled={isLoading}
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
            })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
            })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-6"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/sign-up" className="font-medium text-yellow-400 hover:text-yellow-500">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}