'use client';

import Link from 'next/link';

/**
 * Contacts Page - Placeholder for Phase 4
 * Shows empty state until contacts CRUD is implemented
 */
export default function ContactsPage() {
  return (
    <div className="p-6 md:p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-4">
            <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-block text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-hero mb-3 text-[var(--text-primary)]">Contacts</h1>
            <p className="text-body text-[var(--text-secondary)]">
              Manage the people you buy gifts for
            </p>
          </div>

          {/* Empty State */}
          <div className="glass-card rounded-2xl p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-title mb-4 text-[var(--text-primary)]">No contacts yet</h2>
            <p className="text-body text-[var(--text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
              Add your first contact to start planning gifts. You can import from your phone or add manually.
            </p>
            <button
              onClick={() => console.log('Add contact - coming in Phase 4')}
              className="glass-button inline-block rounded-xl px-6 py-3 text-white font-medium hover:no-underline min-h-[44px] flex items-center justify-center mx-auto"
            >
              Add Your First Contact
            </button>
          </div>

          {/* Coming Soon Info */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mt-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--text-primary)]">Coming Soon</h3>
            <ul className="text-body text-[var(--text-secondary)] space-y-2 list-none space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Add and edit contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Import from your phone contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Tag relationships (friend, family, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--system-blue)] mt-0.5">•</span>
                <span>Add interests and notes</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
