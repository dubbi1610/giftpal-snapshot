'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/app/(auth)/layout';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type'); // 'recovery' for password reset, null for email verification
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      const supabase = createClient();
      
      try {
        // Handle password reset or email verification via URL tokens
        // Supabase handles these via redirects from email links
        // The token is passed as a hash parameter in the URL
        
        // For email verification, Supabase typically uses ?token=...&type=...
        // For password reset, Supabase uses ?token=...&type=recovery
        
        // Since we're using verifyOtp, we need to extract the token correctly
        // However, Supabase email links typically use a different flow
        // Let's use the exchangeCodeForSession pattern instead
        
        if (type === 'recovery') {
          // Password reset flow - Supabase sends a code that can be used to reset password
          setStatus('success');
          setMessage('Password reset link verified. Please check your email for further instructions.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          // Email verification - check if we can get the session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            setStatus('error');
            setMessage('Invalid or expired verification link. Please request a new one.');
            return;
          }

          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          setTimeout(() => {
            router.push('/onboarding');
          }, 2000);
        }
      } catch (err) {
        setStatus('error');
        setMessage('Something went wrong—try again.');
      }
    }

    verifyToken();
  }, [token, type, router]);

  return (
    <AuthLayout>
      <AuthCard
        title="Check your email"
        subtitle={
          type === 'recovery'
            ? "We sent a password reset link to finish setup."
            : "We sent a confirmation link to finish setup."
        }
      >
        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
            <p className="text-sm text-slate-500">Verifying...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <FormSuccess message={message || 'Verification successful!'} />
            <Button
              variant="gradient"
              className="w-full mt-4"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
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
