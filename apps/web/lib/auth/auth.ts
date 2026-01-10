/**
 * Authentication service for GiftPal
 * Handles Supabase Auth operations (signup, signin, signout, etc.)
 */

import { createClient } from '@/lib/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password?: string; // Optional for magic link
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name || '',
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  return {
    user: authData.user,
    session: authData.session,
    error,
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  const supabase = createClient();

  if (!data.password) {
    throw new Error('Password is required for email/password sign in');
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return {
    user: authData.user,
    session: authData.session,
    error,
  };
}

/**
 * Sign in with magic link (passwordless)
 */
export async function sendMagicLink(email: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  return { error };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  return { error };
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Reset password (sends reset email)
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { error };
}

/**
 * Update user password (when authenticated)
 */
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error };
}
