'use client';

import { useParams } from 'next/navigation';
import { useWishlistByToken } from '@/lib/hooks/useWishlists';
import { useWishlistItems } from '@/lib/hooks/useWishlists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Heart } from 'lucide-react';

export default function SharedWishlistPage() {
  const params = useParams();
  const token = params.token as string;
  const { data: wishlist, isLoading } = useWishlistByToken(token);
  const { data: items = [] } = useWishlistItems(wishlist?.id || '');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <EmptyState
          icon={Heart}
          title="Wishlist not found"
          description="This wishlist link is invalid or has been deleted"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{wishlist.title}</h1>
          {wishlist.description && (
            <p className="text-sm text-slate-500">{wishlist.description}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No items yet"
                description="This wishlist is empty"
              />
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        {item.priceMin && item.priceMax && (
                          <p className="text-sm text-slate-500 mt-1">
                            {formatCurrencyRange(item.priceMin, item.priceMax)}
                          </p>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                          >
                            View Link
                          </a>
                        )}
                        {item.notes && (
                          <p className="text-sm text-slate-600 mt-2">{item.notes}</p>
                        )}
                      </div>
                      <Badge variant="outline">{item.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Shared via GiftPal</p>
        </div>
      </div>
    </div>
  );
}
