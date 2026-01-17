'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/useAuth';
import { brandAssets } from '@/lib/brand';

/**
 * Sign In Page - Supabase Auth sign in
 * Email/password and magic link authentication
 */
export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, sendMagicLink } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleEmailPasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn({ email, password });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await sendMagicLink(email);
      setSuccess('Check your email for the magic link to sign in.');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-6 md:p-8">
      <main className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center gap-8 text-center py-8 md:py-12">
          {/* Logo */}
          <Link href="/" className="mb-4">
            <Image
              src={brandAssets.logo}
              alt="GiftPal"
              width={140}
              height={46}
              priority
            />
          </Link>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 max-w-md w-full">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome back</h1>
            <p className="text-[var(--text-secondary)]">
              Sign in to continue to GiftPal
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={magicLinkMode ? handleMagicLink : handleEmailPasswordSignIn}
            className="w-full glass-card rounded-2xl p-8 space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-left text-[var(--text-primary)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-h-[48px]"
                disabled={loading}
                required
                autoCapitalize="none"
                autoComplete="email"
              />
            </div>

            {!magicLinkMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-left text-[var(--text-primary)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-h-[48px]"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4">
                <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {!magicLinkMode && (
              <div className="flex items-center justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm font-medium text-[var(--brand-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full rounded-xl px-6 py-4 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:no-underline min-h-[48px] flex items-center justify-center"
            >
              {loading
                ? magicLinkMode
                  ? 'Sending...'
                  : 'Signing in...'
                : magicLinkMode
                ? 'Send magic link'
                : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMagicLinkMode(!magicLinkMode);
                setError(null);
                setSuccess(null);
              }}
              className="w-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {magicLinkMode
                ? 'Use password instead'
                : 'Sign in with magic link instead'}
            </button>
          </form>

          {/* Sign up link */}
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span className="text-sm">Don't have an account?</span>
            <Link
              href="/signup"
              className="text-sm font-semibold text-[var(--brand-primary)] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
