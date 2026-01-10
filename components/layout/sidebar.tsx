'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Gift,
  Heart,
  History,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/contacts', label: 'Contacts', icon: Users },
  { href: '/app/events', label: 'Events', icon: Calendar },
  { href: '/app/planner', label: 'Planner', icon: Gift },
  { href: '/app/wishlists', label: 'Wishlists', icon: Heart },
  { href: '/app/history', label: 'History', icon: History },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <h1 className="text-xl font-bold text-slate-900">GiftPal</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  {
                    'bg-slate-100 text-slate-900': isActive,
                    'text-slate-600 hover:bg-slate-50 hover:text-slate-900': !isActive,
                  }
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
