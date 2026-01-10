'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWishlist } from '@/lib/hooks/useWishlists';
import { useWishlistItems, useCreateWishlistItem, useUpdateWishlistItem, useDeleteWishlistItem } from '@/lib/hooks/useWishlists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Heart, Plus, Trash2, Edit2, Copy, Share2 } from 'lucide-react';
import type { WishlistItem, Priority } from '@/lib/types';
import { generateId } from '@/lib/utils/id';

export default function WishlistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wishlistId = params.id as string;
  const { data: wishlist, isLoading } = useWishlist(wishlistId);
  const { data: items = [] } = useWishlistItems(wishlistId);
  const createItem = useCreateWishlistItem();
  const updateItem = useUpdateWishlistItem();
  const deleteItem = useDeleteWishlistItem();
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    title: '',
    link: '',
    priceMin: '',
    priceMax: '',
    notes: '',
    priority: 'med' as Priority,
  });
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!wishlist) {
    return (
      <EmptyState
        title="Wishlist not found"
        description="The wishlist you're looking for doesn't exist"
        action={{
          label: 'Back to Wishlists',
          onClick: () => router.push('/app/wishlists'),
        }}
      />
    );
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/wishlist/${wishlist.shareToken}` : '';
  
  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({ title: '', link: '', priceMin: '', priceMax: '', notes: '', priority: 'med' });
    setShowItemModal(true);
  };

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      link: item.link || '',
      priceMin: item.priceMin?.toString() || '',
      priceMax: item.priceMax?.toString() || '',
      notes: item.notes || '',
      priority: item.priority,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemForm.title.trim()) return;

    if (editingItem) {
      updateItem.mutate({
        id: editingItem.id,
        updates: {
          ...itemForm,
          priceMin: itemForm.priceMin ? parseInt(itemForm.priceMin) : undefined,
          priceMax: itemForm.priceMax ? parseInt(itemForm.priceMax) : undefined,
        },
      });
    } else {
      createItem.mutate({
        wishlistId,
        item: {
          wishlistId,
          ...itemForm,
          priceMin: itemForm.priceMin ? parseInt(itemForm.priceMin) : undefined,
          priceMax: itemForm.priceMax ? parseInt(itemForm.priceMax) : undefined,
        },
      });
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem.mutate({ id: itemId, wishlistId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{wishlist.title}</h1>
          {wishlist.description && (
            <p className="text-sm text-slate-500 mt-1">{wishlist.description}</p>
          )}
        </div>
        <Button variant="secondary" onClick={() => router.push('/app/wishlists')}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={handleCopyLink} variant="secondary">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Share this link with others to let them view your wishlist
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist Items
            </CardTitle>
            <Button size="sm" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No items yet"
              description="Add items to this wishlist"
              action={{
                label: 'Add Item',
                onClick: handleAddItem,
              }}
            />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      {item.priceMin && item.priceMax && (
                        <p className="text-sm text-slate-500">
                          {formatCurrencyRange(item.priceMin, item.priceMax)}
                        </p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Link
                        </a>
                      )}
                      {item.notes && <p className="text-sm text-slate-600 mt-1">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.priority}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editingItem ? 'Edit Wishlist Item' : 'Add Wishlist Item'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowItemModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {editingItem ? 'Save' : 'Add'} Item
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <Input
              value={itemForm.title}
              onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
              placeholder="Item title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Link (optional)</label>
            <Input
              type="url"
              value={itemForm.link}
              onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Min ($)</label>
              <Input
                type="number"
                value={itemForm.priceMin}
                onChange={(e) => setItemForm({ ...itemForm, priceMin: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Max ($)</label>
              <Input
                type="number"
                value={itemForm.priceMax}
                onChange={(e) => setItemForm({ ...itemForm, priceMax: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <Select
              value={itemForm.priority}
              onChange={(e) => setItemForm({ ...itemForm, priority: e.target.value as Priority })}
            >
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
            <textarea
              value={itemForm.notes}
              onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              placeholder="Additional notes"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
