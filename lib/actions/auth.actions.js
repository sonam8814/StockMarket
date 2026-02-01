'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function signInWithEmail(data) {
  try {
    const headersList = await headers();
    
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: headersList,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Invalid email or password');
    }

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function signUpWithEmail(data) {
  try {
    const headersList = await headers();
    
    console.log('Creating account for:', data.email);
    
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      },
      headers: headersList,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Failed to create account');
    }

    console.log('Account created successfully');

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}