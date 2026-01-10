import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UserMenu from '@/components/dashboard/UserMenu';

/**
 * Dashboard Layout
 * Protects all dashboard routes with authentication
 * Server-side auth check with automatic redirect to signin if not authenticated
 */
export default async function DashboardLayout({
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
    redirect('/signin');
  }

  return (
    <div className="min-h-screen gradient-primary">
      {/* Top Bar */}
      <header className="w-full px-6 md:px-8 py-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">GiftPal</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
