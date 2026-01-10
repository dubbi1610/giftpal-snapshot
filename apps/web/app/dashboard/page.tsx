'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';

/**
 * Dashboard - Main screen after onboarding
 * Shows user's dashboard with quick actions and upcoming events
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Get user name from auth metadata or email
  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'there';

  const quickActions = [
    {
      title: 'Add Contact',
      description: 'Add someone new to your gift list',
      href: '/dashboard/contacts',
    },
    {
      title: 'Add Event',
      description: 'Create a new event to remember',
      href: '/dashboard/events',
    },
    {
      title: 'Create Wishlist',
      description: "Share what you'd like to receive",
      href: '/dashboard/wishlists',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-[var(--text-secondary)]">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-10 py-8 md:py-12">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-hero mb-3 text-[var(--text-primary)]">
              Hey {userName}!
            </h1>
            <p className="text-body text-[var(--text-secondary)]">
              Let's plan some thoughtful gifts
            </p>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-title mb-6 text-[var(--text-primary)]">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="glass-card rounded-2xl p-6 md:p-8 text-center hover-lift hover:no-underline group"
                >
                  <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{action.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-title mb-6 text-[var(--text-primary)]">Upcoming Events</h2>
            <div className="glass-card rounded-2xl p-10 md:p-12 text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">No upcoming events yet</h3>
              <p className="text-body text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Add your first contact and event to get started
              </p>
              <Link
                href="/dashboard/events"
                className="glass-button inline-block rounded-xl px-6 py-3 text-white font-medium hover:no-underline min-h-[44px] flex items-center justify-center"
              >
                Add Your First Event
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
