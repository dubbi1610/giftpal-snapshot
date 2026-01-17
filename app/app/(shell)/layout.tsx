import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppLayoutClient } from '@/components/layout/app-layout-client';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      redirect('/login?redirect=/app');
    }

    return <AppLayoutClient>{children}</AppLayoutClient>;
  } catch (error: any) {
    // If there's an error (e.g., missing env vars), redirect to login
    console.error('App layout error:', error);
    redirect('/login?redirect=/app');
  }
}
