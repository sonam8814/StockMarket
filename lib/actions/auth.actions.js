'use server';

import { auth } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInWithEmail(data) {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!response || !response.user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Set the session cookie manually
    const cookieStore = await cookies();
    if (response.token) {
      cookieStore.set('better-auth.session_token', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    console.log('✅ Sign in successful:', response.user.email);
    return { success: true, user: response.user };
    
  } catch (error) {
    console.error('❌ Sign in error:', error);
    return { 
      success: false, 
      error: error.body?.message || error.message || 'Failed to sign in' 
    };
  }
}

export async function signUpWithEmail(data) {
  try {
    console.log('Creating account for:', data.email);

    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: 'Failed to create account' };
    }

    console.log('✅ Account created:', result.user?.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Sign up error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create account' 
    };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error('Sign out error:', error);
  }
  redirect('/sign-in');
}

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
}