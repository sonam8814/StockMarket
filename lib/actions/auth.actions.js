"use server";

import { cookies, headers } from "next/headers";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(userData) {
  console.log("=== SIGN UP ATTEMPT ===");
  console.log("Received data:", userData);

  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("referer")?.split("?")[0] || BETTER_AUTH_URL;

    console.log("Making request to:", `${BETTER_AUTH_URL}/api/auth/sign-up/email`);
    console.log("With origin:", origin);

    const response = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": origin,
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      }),
      credentials: "include",
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Response text:", responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return { success: false, error: `Server error: ${responseText || "Empty response"}` };
    }

    console.log("Parsed data:", data);

    if (response.ok && data.user) {
      console.log("✅ User created successfully");
      
      // Set the session cookie if provided
      if (data.session) {
        const cookieStore = await cookies();
        cookieStore.set("better-auth.session_token", data.session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
      
      return { success: true, data: data };
    } else {
      console.error("❌ Sign up failed:", data);
      return { 
        success: false, 
        error: data.error?.message || data.message || "Failed to create account" 
      };
    }
  } catch (error) {
    console.error("❌ Sign up exception:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInWithEmail(credentials) {
  console.log("=== SIGN IN ATTEMPT ===");
  console.log("Email:", credentials.email);

  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("referer")?.split("?")[0] || BETTER_AUTH_URL;

    console.log("Making request to:", `${BETTER_AUTH_URL}/api/auth/sign-in/email`);
    console.log("With origin:", origin);

    const response = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": origin,
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      credentials: "include",
    });

    console.log("Response status:", response.status);

    const responseText = await response.text();
    console.log("Response text:", responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return { success: false, error: `Server error: ${responseText || "Empty response"}` };
    }

    console.log("Parsed data:", data);

    if (response.ok && data.user) {
      console.log("✅ Sign in successful");
      
      // Set the session cookie
      if (data.session) {
        const cookieStore = await cookies();
        cookieStore.set("better-auth.session_token", data.session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
      
      return { success: true, data: data };
    } else {
      console.error("❌ Sign in failed:", data);
      return { 
        success: false, 
        error: data.error?.message || data.message || "Invalid credentials" 
      };
    }
  } catch (error) {
    console.error("❌ Sign in exception:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}