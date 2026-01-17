'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateContact } from '@/lib/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { Relationship } from '@/lib/types';

export default function NewContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createContact = useCreateContact();
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'friend' as Relationship,
    tags: [] as string[],
    interests: [] as string[],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createContact.mutate(formData, {
      onSuccess: () => {
        router.push('/app/contacts');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Contact</h1>
        <p className="text-sm text-slate-500 mt-1">Add a new contact to your gift planning</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter contact name"
                required
              />
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-slate-700 mb-2">
                Relationship
              </label>
              <Select
                id="relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value as Relationship })}
              >
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="coworker">Coworker</option>
                <option value="acquaintance">Acquaintance</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-slate-700 mb-2">
                Interests (comma-separated)
              </label>
              <Input
                id="interests"
                value={formData.interests.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interests: e.target.value.split(',').map(i => i.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g., photography, cooking, books"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                placeholder="Additional notes about this contact"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/app/contacts')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createContact.isPending}>
                {createContact.isPending ? 'Creating...' : 'Create Contact'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
