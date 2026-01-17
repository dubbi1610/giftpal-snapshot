'use client';

import { Gift } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * AuthLayout - Shared layout for all authentication pages
 * 
 * Provides:
 * - Full-page gradient background (blue/purple/pink)
 * - Centered logo and wordmark
 * - Consistent spacing and visual style
 * 
 * Copy Deck:
 * - Logo: GiftPal with Gift icon
 * - Footer: "© 2024 GiftPal. All rights reserved."
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-glow">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gift<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Pal</span>
          </h1>
        </div>

        {/* Auth Card Container */}
        <div className="w-full">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>&copy; 2024 GiftPal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
