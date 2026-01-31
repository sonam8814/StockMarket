'use server';

import { auth } from '@/lib/auth';
import { inngest } from '@/lib/inngest/client';

export async function signInWithEmail(data) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    if (!result) {
      throw new Error('Invalid email or password');
    }

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function signUpWithEmail(data) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      },
    });

    if (!result) {
      throw new Error('Failed to create account');
    }

    // Trigger welcome email (we'll set up Inngest later)
    try {
      await inngest.send({
        name: 'app/user.signup',
        data: {
          email: data.email,
          name: data.fullName,
          userProfile: {
            country: data.country,
            investmentGoals: data.investmentGoals,
            riskTolerance: data.riskTolerance,
            preferredIndustry: data.preferredIndustry,
          },
        },
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail signup if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}