'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeStorage } from '@/lib/storage/init';
import { createLocalApi } from '@/lib/api/localApi';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Button } from '@/components/ui/button';
import { Gift, Github } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      initializeStorage();
      // Check user directly from localStorage
      const api = createLocalApi();
      const currentUser = api.getUser();
      setUser(currentUser);
      setChecking(false);
      
      // If user exists, redirect
      if (currentUser) {
        setTimeout(() => router.push('/app'), 500);
      }
    }
  }, [router]);

  // Show loading only during initial check
  if (!mounted || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If user exists, show redirecting message (will redirect shortly)
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mx-auto" />
          <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm animate-slide-up">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 group-hover:bg-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Gift className="h-5 w-5 text-white group-hover:animate-wiggle" />
              </div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">GiftPal</span>
            </div>
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const element = document.getElementById('features');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-slate-700 hover:text-purple-600 hover:scale-110 transition-all duration-300"
              >
                Features
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const element = document.getElementById('features');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-slate-700 hover:text-purple-600 hover:scale-110 transition-all duration-300"
              >
                How It Works
              </button>
              <button
                className="text-sm font-medium text-slate-700 hover:text-purple-600 hover:scale-110 transition-all duration-300"
              >
                Pricing
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/app')}
                className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors hidden sm:block"
              >
                Log In
              </button>
              <Button 
                variant="purple" 
                onClick={() => router.push('/onboarding')}
                className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h2 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl animate-slide-up">
            Ready to Master Gift Giving?
          </h2>
          <p className="mb-10 text-xl text-slate-700 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Join thousands who never forget a gift again.
          </p>
          <Button
            variant="purple"
            size="lg"
            onClick={() => router.push('/onboarding')}
            className="shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 font-semibold animate-bounce-slow hover:animate-none"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">GiftPal</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-purple-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-purple-500 transition-colors">
                Terms
              </a>
              <a href="https://github.com/rohan2207/GIFTPAL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-500 transition-colors">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 GiftPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
