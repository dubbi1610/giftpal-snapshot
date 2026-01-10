'use client';

import Link from 'next/link';
import Image from 'next/image';
import { brandAssets } from '@/lib/brand';
import { Ribbon } from '@/components/ui/Ribbon';
import { Bow } from '@/components/ui/Bow';
import { RibbonDivider } from '@/components/ui/RibbonDivider';

/**
 * Landing Page - Ribbon & Bow Gift-Wrapping Theme
 * Flowing, organic design with ribbons wrapping content (no boxes)
 */
export default function Home() {

  const features = [
    {
      title: 'Never Forget',
      description: 'Track all birthdays, anniversaries, and special events in one place',
      ribbonColor: '#FF6B9D',
    },
    {
      title: 'Budget Smart',
      description: 'Set budgets and track spending to give thoughtful gifts without breaking the bank',
      ribbonColor: '#A78BFA',
    },
    {
      title: 'Plan Gifts',
      description: 'Save gift ideas, track what you gave, and remember what others gave you',
      ribbonColor: '#F59E0B',
    },
    {
      title: 'Share Wishlists',
      description: 'Create wishlists and share them privately with friends and family',
      ribbonColor: '#FF6B9D',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full px-6 md:px-8 py-6 bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={brandAssets.logo}
              alt="GiftPal"
              width={120}
              height={40}
              priority
            />
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[var(--brand-primary)] rounded-xl px-6 py-2.5 text-white font-semibold text-sm hover:opacity-90 transition-opacity min-h-[40px] flex items-center justify-center shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Flowing Ribbon Background */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-[var(--brand-primary-light)]/20 via-[var(--brand-secondary-light)]/15 to-[var(--brand-accent-light)]/20">
        {/* Flowing ribbon decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 rotate-12 opacity-20">
            <Ribbon color="#FF6B9D" width={400} height={120} direction="diagonal-right" />
          </div>
          <div className="absolute bottom-40 -right-20 -rotate-12 opacity-20">
            <Ribbon color="#A78BFA" width={500} height={140} direction="diagonal-left" />
          </div>
          <div className="absolute top-1/2 left-1/4 rotate-45 opacity-15">
            <Ribbon color="#F59E0B" width={300} height={100} direction="curved" />
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col items-center gap-12 text-center">
            {/* Bow accent */}
            <div className="flex items-center justify-center mb-4">
              <Bow color="#FF6B9D" size={100} className="opacity-70" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 max-w-5xl leading-tight">
              The gift planning app that grows with you
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl leading-relaxed font-medium">
              Never forget a birthday, anniversary, or special event. Plan thoughtful gifts with budgets, wishlists, and gift history—all in one place.
            </p>
            
            {/* Ribbon-wrapped CTAs */}
            <div className="relative mt-8 flex flex-col sm:flex-row items-center gap-6">
              {/* Ribbon wrapping the buttons */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-30">
                <Ribbon color="#FF6B9D" width={300} height={60} direction="horizontal" />
              </div>
              
              <Link
                href="/signup"
                className="relative bg-[var(--brand-primary)] rounded-xl px-10 py-5 text-white font-bold text-lg w-full sm:w-auto min-h-[56px] flex items-center justify-center hover:opacity-90 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 z-10"
              >
                Get Started Free
                <div className="absolute -top-2 right-4">
                  <Bow color="#FFFFFF" size={30} className="opacity-60" />
                </div>
              </Link>
              <Link
                href="/signin"
                className="bg-white border-2 border-gray-300 rounded-xl px-10 py-5 text-gray-700 font-bold text-lg w-full sm:w-auto min-h-[56px] flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all shadow-lg z-10"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ribbon Divider */}
      <RibbonDivider color="#FF6B9D" flipped={false} />

      {/* Add Anything Section - Flowing Layout */}
      <section className="bg-white py-20 md:py-28 relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-20">
            {/* Bow decoration */}
            <div className="flex items-center justify-center mb-6">
              <Bow color="#A78BFA" size={80} className="opacity-60" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Add anything from any store
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create wishlists, track events, and plan gifts all in one place. Eliminate guesswork with our universal gift registry.
            </p>
          </div>

          {/* Flowing feature layout - no boxes */}
          <div className="relative space-y-16 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="relative">
                  {/* Flowing ribbon wrapping each feature */}
                  <div className={`absolute ${isEven ? '-left-8 top-0' : '-right-8 top-0'} opacity-30`}>
                    <Ribbon 
                      color={feature.ribbonColor} 
                      width={200} 
                      height={100} 
                      direction={isEven ? 'diagonal-left' : 'diagonal-right'}
                      className="transform rotate-12"
                    />
                  </div>
                  
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 relative z-10`}>
                    {/* Icon/Bow */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--brand-primary-light)]/30 to-[var(--brand-primary)]/10 flex items-center justify-center shadow-lg">
                          <Bow color={feature.ribbonColor} size={50} className="opacity-80" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content wrapped in flowing ribbon path */}
                    <div className={`flex-1 ${isEven ? 'text-left' : 'text-right md:text-left'}`}>
                      <div className="relative">
                        {/* Subtle ribbon background */}
                        <div className="absolute inset-0 opacity-5">
                          <Ribbon 
                            color={feature.ribbonColor} 
                            width={400} 
                            height={150} 
                            direction="curved"
                          />
                        </div>
                        
                        <div className="relative z-10">
                          <h3 className="text-3xl font-bold mb-4 text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connecting ribbon between features */}
                  {index < features.length - 1 && (
                    <div className="flex items-center justify-center my-12 opacity-20">
                      <Ribbon 
                        color={feature.ribbonColor} 
                        width={100} 
                        height={60} 
                        direction="diagonal-right"
                        className="transform rotate-90"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ribbon Divider */}
      <RibbonDivider color="#A78BFA" flipped={true} />

      {/* Celebrate Section - Ribbon Wrapped */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-accent)]">
        {/* Multiple flowing ribbons */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 rotate-12 opacity-20">
            <Ribbon color="#FFFFFF" width={300} height={100} direction="diagonal-right" />
          </div>
          <div className="absolute bottom-20 right-20 -rotate-12 opacity-20">
            <Ribbon color="#FFFFFF" width={400} height={120} direction="diagonal-left" />
          </div>
          <div className="absolute top-1/2 left-1/3 rotate-45 opacity-15">
            <Ribbon color="#FFFFFF" width={250} height={90} direction="curved" />
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Large bow centerpiece */}
            <div className="flex items-center justify-center mb-8">
              <Bow color="#FFFFFF" size={120} className="opacity-90" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Celebrate Every Moment!
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed font-medium">
              Create a GiftPal account today and never forget an important gift again. Join thousands who make gift-giving effortless.
            </p>
            <p className="text-lg text-white/90 mb-12">
              Some restrictions apply.
            </p>
            
            {/* Ribbon-wrapped CTAs */}
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-40">
                <Ribbon color="#FFFFFF" width={350} height={80} direction="horizontal" />
              </div>
              
              <Link
                href="/signup"
                className="relative bg-white text-[var(--brand-primary)] rounded-xl px-12 py-6 text-lg font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 min-h-[60px] flex items-center justify-center z-10"
              >
                Get Started
                <div className="absolute -top-2 right-2">
                  <Bow color="#FF6B9D" size={25} className="opacity-80" />
                </div>
              </Link>
              <Link
                href="/signin"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-xl px-12 py-6 text-lg font-bold hover:bg-white/30 transition-all min-h-[60px] flex items-center justify-center shadow-xl z-10"
              >
                Find a Registry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Ribbon Divider */}
      <RibbonDivider color="#F59E0B" flipped={false} />

      {/* Final CTA Section - Organic Curved Background */}
      <section className="bg-white py-20 relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          {/* Organic curved container with ribbon wrapping */}
          <div className="relative max-w-4xl mx-auto">
            {/* Ribbon decorations */}
            <div className="absolute -top-12 left-1/4 opacity-20">
              <Ribbon color="#FF6B9D" width={200} height={80} direction="diagonal-left" className="transform -rotate-12" />
            </div>
            <div className="absolute -top-12 right-1/4 opacity-20">
              <Ribbon color="#A78BFA" width={200} height={80} direction="diagonal-right" className="transform rotate-12" />
            </div>
            
            {/* Curved background using SVG */}
            <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-16 shadow-2xl overflow-hidden">
              {/* Flowing ribbon background */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <Ribbon color="#FF6B9D" width={256} height={256} direction="curved" />
              </div>
              <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
                <Ribbon color="#A78BFA" width={256} height={256} direction="curved" className="transform rotate-180" />
              </div>
              
              <div className="relative z-10 text-center">
                {/* Bow accent */}
                <div className="flex items-center justify-center mb-6">
                  <Bow color="#FF6B9D" size={70} className="opacity-70" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Ready to never forget a gift again?
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-10">
                  Join GiftPal today and start planning thoughtful gifts effortlessly
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="relative bg-[var(--brand-primary)] rounded-xl px-10 py-5 text-white font-bold text-lg inline-block hover:opacity-90 transition-all shadow-xl hover:shadow-2xl min-h-[56px] flex items-center justify-center transform hover:-translate-y-1"
                  >
                    Get Started Free
                    <div className="absolute -top-1 right-3">
                      <Bow color="#FFFFFF" size={20} className="opacity-70" />
                    </div>
                  </Link>
                  <Link
                    href="/signin"
                    className="bg-gray-900 rounded-xl px-10 py-5 text-white font-bold text-lg inline-block hover:bg-gray-800 transition-all shadow-xl min-h-[56px] flex items-center justify-center"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
