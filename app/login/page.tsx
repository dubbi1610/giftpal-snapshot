'use client';

import { useActionState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth/actions';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/app/(auth)/layout';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [state, formAction, pending] = useActionState(signIn, { error: null as string | null, success: false });

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue planning gifts."
      >
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect || '/app'} />
          
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
              autoComplete="current-password"
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
            {pending ? 'Logging in...' : 'Log in'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              Forgot password?
            </Link>
            <span className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
              >
                Create account
              </Link>
            </span>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to continue planning gifts."
        >
          <div className="text-center py-4">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}
