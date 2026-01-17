'use client';

/**
 * Auth Provider Component
 * Provides authentication state and methods to all child components
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import * as authService from './auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: { email: string; password: string; name?: string }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle auth events
      if (event === 'SIGNED_IN') {
        // User signed in - redirect to dashboard if on public pages
        if (pathname === '/signin' || pathname === '/signup') {
          router.push('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        // User signed out - redirect to landing page if on protected pages
        if (pathname?.startsWith('/dashboard')) {
          router.push('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const signUp = useCallback(
    async (data: { email: string; password: string; name?: string }) => {
      const result = await authService.signUp(data);

      if (result.error) {
        throw result.error;
      }

      if (result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        router.push('/onboarding/welcome');
      } else {
        // Email confirmation required
        router.push('/signup/confirm-email');
      }
    },
    [router]
  );

  const signIn = useCallback(
    async (data: { email: string; password: string }) => {
      const result = await authService.signIn(data);

      if (result.error) {
        throw result.error;
      }

      if (result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        router.push('/dashboard');
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    const { error } = await authService.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setSession(null);
    router.push('/');
  }, [router]);

  const sendMagicLink = useCallback(async (email: string) => {
    const { error } = await authService.sendMagicLink(email);

    if (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await authService.resetPassword(email);

    if (error) {
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendMagicLink,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
