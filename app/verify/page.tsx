'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/app/(auth)/layout';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'recovery' for password reset, null for email verification
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      const supabase = createClient();
      
      try {
        // Supabase email links use hash fragments (#access_token=...&type=...)
        // Read hash from window.location inside useEffect to ensure it's current
        const tokenHash = typeof window !== 'undefined' ? window.location.hash : '';
        const hashParams = new URLSearchParams(tokenHash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('type') || type;

        // If we have tokens in the hash, exchange them for a session
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setStatus('error');
            setMessage('Invalid or expired verification link. Please request a new one.');
            return;
          }

          // Check if this is a password reset flow
          if (tokenType === 'recovery') {
            // Extract the token from hash for password reset
            const resetToken = accessToken;
            setStatus('success');
            setMessage('Reset link verified. Redirecting to password reset form...');
            setTimeout(() => {
              router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
            }, 1500);
            return;
          }

          // Email verification successful
          if (data.session) {
            setStatus('success');
            setMessage('Your email has been verified successfully. Redirecting...');
            setTimeout(() => {
              router.push('/onboarding');
            }, 1500);
            return;
          }
        }

        // Fallback: Check if we already have a valid session (in case of email verification)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !tokenType) {
          // Email verification via session (common flow)
          setStatus('success');
          setMessage('Your email has been verified successfully. Redirecting...');
          setTimeout(() => {
            router.push('/onboarding');
          }, 1500);
          return;
        }

        // No valid token or session found
        if (!accessToken && !session) {
          setStatus('error');
          setMessage('Invalid verification link.');
          return;
        }

        if (sessionError) {
          setStatus('error');
          setMessage('Invalid or expired verification link. Please request a new one.');
          return;
        }

        // Generic error
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    }

    verifyToken();
  }, [type, router, searchParams]);

  const getTitle = () => {
    if (status === 'loading') return 'Verifying...';
    if (status === 'error') return 'Verification failed';
    if (type === 'recovery' || searchParams.get('type') === 'recovery') {
      return 'Reset link verified';
    }
    return 'Email verified!';
  };

  const getSubtitle = () => {
    if (status === 'loading') return 'Please wait while we verify your link.';
    if (status === 'error') return '';
    if (type === 'recovery' || searchParams.get('type') === 'recovery') {
      return 'Your reset link is valid. Redirecting to password reset form...';
    }
    return 'Your email has been verified successfully. Redirecting...';
  };

  return (
    <AuthLayout>
      <AuthCard
        title={getTitle()}
        subtitle={getSubtitle()}
      >
        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
            <p className="text-sm text-slate-500">Please wait...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <FormSuccess message={message || 'Verification successful!'} />
            {!(type === 'recovery' || searchParams.get('type') === 'recovery') && (
              <Button
                variant="gradient"
                className="w-full mt-4"
                onClick={() => router.push('/login')}
              >
                Continue
              </Button>
            )}
          </>
        )}

        {status === 'error' && (
          <>
            <FormError message={message || 'Verification failed.'} />
            <Button
              variant="gradient"
              className="w-full mt-4"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard
          title="Check your email"
          subtitle="Verifying..."
        >
          <div className="text-center py-4">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    }>
      <VerifyContent />
    </Suspense>
  );
}
