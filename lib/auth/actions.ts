'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Improve error messages for common cases
    if (error.message.includes('Invalid login credentials') || error.message.includes('email or password')) {
      return { error: 'Invalid email or password.', success: false };
    }
    return { error: error.message, success: false };
  }

  // Check if email is verified
  if (authData.user && !authData.user.email_confirmed_at) {
    return { error: 'Please confirm your email to continue.', success: false };
  }

  const redirectTo = formData.get('redirect') as string | null;
  revalidatePath('/', 'layout');
  redirect(redirectTo || '/app');
}

export async function signUp(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  };

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    // Improve error messages for common cases
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      return { error: 'An account with this email already exists.', success: false };
    }
    if (error.message.includes('Password')) {
      return { error: 'Password must be at least 6 characters.', success: false };
    }
    return { error: error.message, success: false };
  }

  // If session exists (email verification disabled), redirect to onboarding or app
  if (authData.session) {
    revalidatePath('/', 'layout');
    redirect('/onboarding');
  }

  // Otherwise, return success (will show verify message)
  return { success: true, error: null };
}

export async function resetPassword(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.', success: false };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify?type=recovery`,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // Always return success for security (don't reveal if email exists)
  return { success: true, error: null };
}

export async function updatePassword(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const token = formData.get('token') as string | null;

  // Validate password match
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.', success: false };
  }

  // Validate password length
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.', success: false };
  }

  // If we have a token, we need to set the session first
  if (token) {
    try {
      // Try to exchange the token for a session
      // Note: Supabase password reset tokens are typically already in the session after email link click
      // This is a fallback for cases where token is passed explicitly
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // Not needed for password reset flow
      });

      if (sessionError) {
        // If token is invalid, try getting current session (user may have clicked email link)
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        
        if (getSessionError || !session) {
          return { error: 'Invalid or expired reset link. Please request a new one.', success: false };
        }
      }
    } catch (err) {
      // Try to get current session instead
      const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
      
      if (getSessionError || !session) {
        return { error: 'Invalid or expired reset link. Please request a new one.', success: false };
      }
    }
  } else {
    // Check if we have a valid session (user clicked email link)
    const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
    
    if (getSessionError || !session) {
      return { error: 'Invalid or expired reset link. Please request a new one.', success: false };
    }
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    if (error.message.includes('Password')) {
      return { error: 'Password must be at least 6 characters.', success: false };
    }
    return { error: error.message, success: false };
  }

  return { success: true, error: null };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
