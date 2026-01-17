'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/auth/actions';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/app/(auth)/layout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(resetPassword, { error: null, success: false });

  if (state?.success) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check your email"
          subtitle="We sent a password reset link to your email address."
        >
          <FormSuccess message="If an account with that email exists, we've sent password reset instructions." />
          <Button
            variant="gradient"
            className="w-full mt-4"
            onClick={() => router.push('/login')}
          >
            Back to login
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        subtitle="We'll email you a secure reset link."
      >
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={pending}
            />
          </div>

          <FormError message={state?.error} />

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={pending}
          >
            {pending ? 'Sending...' : 'Send reset link'}
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
