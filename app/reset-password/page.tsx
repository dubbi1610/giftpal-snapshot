'use client';

import { useActionState, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updatePassword } from '@/lib/auth/actions';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/app/(auth)/layout';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  
  const [state, formAction, pending] = useActionState(updatePassword, { error: null, success: false });

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    }

    setPasswordMatchError(null);
    if (token) {
      formData.append('token', token);
    }
    formAction(formData);
  };

  // Redirect on success
  if (state?.success) {
    return (
      <AuthLayout>
        <AuthCard
          title="Password updated!"
          subtitle="Your password has been updated successfully."
        >
          <FormSuccess message="Password updated successfully! Redirecting to login..." />
          <Button
            variant="gradient"
            className="w-full mt-4"
            onClick={() => router.push('/login')}
          >
            Go to login
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Set new password"
        subtitle="Choose a secure password for your account."
      >
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={pending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={pending}
            />
          </div>

          <FormError message={passwordMatchError || state?.error} />

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={pending}
          >
            {pending ? 'Updating...' : 'Update password'}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Back to login
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard
          title="Set new password"
          subtitle="Choose a secure password for your account."
        >
          <div className="text-center py-4">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}