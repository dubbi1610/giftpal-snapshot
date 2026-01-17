'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HeroIllustration } from './HeroIllustration';

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-20 px-4 sm:py-32 min-h-[600px] flex items-center">
      {/* Subtle abstract overlay shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-300 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse-glow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-300 rounded-full blur-3xl translate-x-1/4 -translate-y-1/2 animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Illustration */}
          <div className="order-2 lg:order-1 flex items-center justify-center min-h-[400px]">
            <HeroIllustration />
          </div>

          {/* Right side - Tagline and CTAs */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-8">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl leading-tight animate-slide-up">
              Never forget a{' '}
              <span className="text-white inline-block animate-bounce-slow">gift</span>{' '}
              <span className="text-white">again</span>
            </h1>
            <p className="text-xl text-white/95 sm:text-2xl max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              GiftPal handles the mental load so you can focus on the joy of giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-scale-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <Button
                variant="purple"
                size="lg"
                onClick={() => router.push('/onboarding')}
                className="shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 font-semibold animate-bounce-slow hover:animate-none"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="lg"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const element = document.getElementById('features');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 font-semibold"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
