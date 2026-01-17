import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppLayoutClient } from '@/components/layout/app-layout-client';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/app');
  }

  return <AppLayoutClient>{children}</AppLayoutClient>;
}
