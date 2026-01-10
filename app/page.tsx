'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { initializeStorage } from '@/lib/storage/init';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    initializeStorage();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/app');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
