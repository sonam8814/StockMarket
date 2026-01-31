'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import FooterLink from '@/components/forms/FooterLink';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import {
  INVESTMENT_GOALS,
  RISK_TOLERANCE_OPTIONS,
  PREFERRED_INDUSTRIES,
} from '@/lib/constants';

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: '',
      investmentGoals: '',
      riskTolerance: '',
      preferredIndustry: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const result = await signUpWithEmail(data);
      if (result.success) {
        toast.success('Account created successfully!');
        router.push('/');
      }
    } catch (e) {
      console.error(e);
      toast.error('Sign up failed', {
        description: e instanceof Error ? e.message : 'Failed to create account.',
      });
    }
  };

  return (
    <>
      <h1 className="form-title">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is required' }}
        />

        <InputField
          name="email"
          label="Email"
          placeholder="john@example.com"
          type="email"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Please enter a valid email',
            },
          }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
        />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required={true}
        />

        <SelectField
          name="investmentGoals"
          label="Investment Goals"
          placeholder="Select your investment goal"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required={true}
        />

        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk tolerance"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required={true}
        />

        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your preferred industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required={true}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <FooterLink
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
}