'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

/**
 * Onboarding Complete Screen (5/5)
 * Final screen - ready to start
 */
export default function OnboardingComplete() {
  const router = useRouter();
  const { user } = useAuth();
  const currentStep = 4;
  const totalSteps = 5;

  useEffect(() => {
    // Mark onboarding as completed
    // Note: Profile onboarding status will be updated via Supabase Auth metadata
    // This is a client-side indicator only
    try {
      localStorage.setItem('onboarding_completed', 'true');
      // TODO: Update profile onboarding_completed in database via API
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  }, [user]);

  const handleGetStarted = () => {
    // Navigate to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-6 md:p-8">
      <main className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-10 text-center py-12 md:py-16">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[var(--system-blue)]'
                    : 'w-1.5 bg-[var(--system-gray-light)]'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-6 max-w-xl">
            <h1 className="text-hero text-[var(--text-primary)]">You're All Set!</h1>
            <p className="text-body text-[var(--text-secondary)] max-w-lg leading-relaxed">
              You're ready to start planning thoughtful gifts
            </p>
            <p className="text-sm text-[var(--text-tertiary)] max-w-md leading-relaxed">
              Start by adding your first contact, or explore the app to see how GiftPal works
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full max-w-md mt-6">
            <button
              onClick={handleGetStarted}
              className="glass-button rounded-xl px-8 py-4 text-white font-medium text-base w-full hover:no-underline min-h-[48px]"
            >
              Start Using GiftPal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
