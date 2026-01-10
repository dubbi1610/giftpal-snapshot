'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

/**
 * User Menu Component
 * Shows user name/avatar with dropdown menu
 */
export default function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get user display name
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  // Get user initials for avatar
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[var(--tertiary-bg)] transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-[var(--glass-border)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">{displayName}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/dashboard/settings');
            }}
            className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--tertiary-bg)] transition-colors"
          >
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
