'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth/actions';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/app/(auth)/layout';

export default function SignupPage() {
  const router = useRouter();
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  
  const [state, formAction, pending] = useActionState(signUp, { error: null, success: false });

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    }

    setPasswordMatchError(null);
    formAction(formData);
  };

  // Redirect on success
  if (state?.success) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check your email"
          subtitle="We sent a confirmation link to finish setup."
        >
          <FormSuccess message="Please check your email and click the confirmation link to complete your registration." />
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
        title="Create your account"
        subtitle="Start organizing gifting with GiftPal."
      >
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              autoComplete="name"
              disabled={pending}
            />
          </div>

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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
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
            {pending ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-slate-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
              >
                Log in
              </Link>
            </span>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
