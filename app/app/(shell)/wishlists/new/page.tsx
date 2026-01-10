'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateWishlist } from '@/lib/hooks/useWishlists';
import { useContacts } from '@/lib/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function NewWishlistPage() {
  const router = useRouter();
  const createWishlist = useCreateWishlist();
  const { data: contacts = [] } = useContacts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerContactId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createWishlist.mutate({
      ...formData,
      ownerContactId: formData.ownerContactId || undefined,
    }, {
      onSuccess: (wishlist) => {
        if (wishlist && typeof wishlist === 'object' && 'id' in wishlist) {
          router.push(`/app/wishlists/${(wishlist as { id: string }).id}`);
        } else {
          router.push('/app/wishlists');
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">Create a new wishlist</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Wishlist Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Wishlist title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                placeholder="Wishlist description"
              />
            </div>

            <div>
              <label htmlFor="ownerContactId" className="block text-sm font-medium text-slate-700 mb-2">
                Owner Contact (optional)
              </label>
              <Select
                id="ownerContactId"
                value={formData.ownerContactId}
                onChange={(e) => setFormData({ ...formData, ownerContactId: e.target.value })}
              >
                <option value="">No owner</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/app/wishlists')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createWishlist.isPending}>
                {createWishlist.isPending ? 'Creating...' : 'Create Wishlist'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
