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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify?type=recovery`,
  });

  if (error) {
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
