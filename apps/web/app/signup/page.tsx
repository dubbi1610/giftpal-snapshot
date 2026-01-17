'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/useAuth';
import { brandAssets } from '@/lib/brand';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Sign-Up Page - Supabase Auth sign up
 * Email/password signup with name
 */
export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0] as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      // Navigation happens in AuthProvider after successful signup
    } catch (error: any) {
      console.error('Sign-up error:', error);
      setSubmitError(error.message || 'Failed to create account. Please try again.');
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
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Create your account</h1>
            <p className="text-[var(--text-secondary)]">
              Start planning thoughtful gifts today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full glass-card rounded-2xl p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-left text-[var(--text-primary)]">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                className="glass-input w-full rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-h-[48px]"
                disabled={loading}
                autoCapitalize="words"
                autoCorrect="off"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1.5 text-left">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-left text-[var(--text-primary)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                className="glass-input w-full rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-h-[48px]"
                disabled={loading}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5 text-left">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-left text-[var(--text-primary)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                className="glass-input w-full rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none min-h-[48px]"
                disabled={loading}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5 text-left">{errors.password}</p>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full rounded-xl px-6 py-4 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:no-underline min-h-[48px] flex items-center justify-center"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-xs text-[var(--text-tertiary)] text-center leading-relaxed">
              By continuing, you agree to GiftPal's Terms of Service and Privacy Policy
            </p>
          </form>

          {/* Sign in link */}
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span className="text-sm">Already have an account?</span>
            <Link
              href="/signin"
              className="text-sm font-semibold text-[var(--brand-primary)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
