'use client';

import Link from 'next/link';

/**
 * Wishlists Page - Placeholder for Phase 6
 * Shows empty state until wishlists CRUD is implemented
 */
export default function WishlistsPage() {
  return (
    <div className="p-6 md:p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-4">
            <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-block text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-hero mb-3 text-[var(--text-primary)]">Wishlists</h1>
            <p className="text-body text-[var(--text-secondary)]">
              Create and share lists of things you'd love to receive
            </p>
          </div>

          {/* Empty State */}
          <div className="glass-card rounded-2xl p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-title mb-4 text-[var(--text-primary)]">No wishlists yet</h2>
            <p className="text-body text-[var(--text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
              Create your first wishlist and share it privately with friends and family so they know exactly what to get you.
            </p>
            <button
              onClick={() => console.log('Create wishlist - coming in Phase 6')}
              className="glass-button inline-block rounded-xl px-6 py-3 text-white font-medium hover:no-underline min-h-[44px] flex items-center justify-center mx-auto"
            >
              Create Your First Wishlist
            </button>
          </div>

          {/* Coming Soon Info */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mt-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--text-primary)]">Coming Soon</h3>
            <ul className="text-body text-[var(--text-secondary)] space-y-2 list-none space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Create wishlists with items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Add price ranges and links</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Share via private links (read-only)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>View shared wishlists from others</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
