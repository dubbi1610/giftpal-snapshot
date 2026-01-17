'use client';

import { useRouter } from 'next/navigation';
import { useWishlists } from '@/lib/hooks/useWishlists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Heart, Plus } from 'lucide-react';

export default function WishlistsPage() {
  const router = useRouter();
  const { data: wishlists = [], isLoading } = useWishlists();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wishlists</h1>
          <p className="text-sm text-slate-500 mt-1">Manage wishlists and share them with others</p>
        </div>
        <Button onClick={() => router.push('/app/wishlists/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Wishlist
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Wishlists</CardTitle>
        </CardHeader>
        <CardContent>
          {wishlists.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No wishlists yet"
              description="Create a wishlist to share gift ideas"
              action={{
                label: 'New Wishlist',
                onClick: () => router.push('/app/wishlists/new'),
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishlists.map((wishlist) => (
                <div
                  key={wishlist.id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/app/wishlists/${wishlist.id}`)}
                >
                  <h3 className="font-medium text-slate-900 mb-1">{wishlist.title}</h3>
                  {wishlist.description && (
                    <p className="text-sm text-slate-500 mb-2">{wishlist.description}</p>
                  )}
                  <p className="text-xs text-slate-400">Click to view</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
