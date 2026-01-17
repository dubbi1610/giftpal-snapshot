'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { useUser } from '@/lib/hooks/useUser';

interface TopBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function TopBar({ searchValue = '', onSearchChange, searchPlaceholder = 'Search...' }: TopBarProps) {
  const router = useRouter();
  const { data: user } = useUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 lg:ml-64">
      <div className="flex flex-1 items-center gap-4">
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Dropdown
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          }
          items={[
            {
              label: 'Contact',
              onClick: () => router.push('/app/contacts/new'),
            },
            {
              label: 'Event',
              onClick: () => router.push('/app/events/new'),
            },
            {
              label: 'Gift Plan',
              onClick: () => router.push('/app/planner/new'),
            },
            {
              label: 'Wishlist',
              onClick: () => router.push('/app/wishlists/new'),
            },
          ]}
          align="right"
        />
        <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
