'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreatePlan } from '@/lib/hooks/usePlans';
import { useContacts } from '@/lib/hooks/useContacts';
import { useEvents } from '@/lib/hooks/useEvents';
import { useUser } from '@/lib/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import type { GiftPlanStatus } from '@/lib/types';

export default function NewPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createPlan = useCreatePlan();
  const { data: contacts = [] } = useContacts();
  const { data: events = [] } = useEvents();
  const { data: user } = useUser();
  const [formData, setFormData] = useState({
    contactId: searchParams.get('contactId') || '',
    eventId: searchParams.get('eventId') || '',
    budgetMin: user?.defaultBudgetMin || 25,
    budgetMax: user?.defaultBudgetMax || 150,
    status: 'planned' as GiftPlanStatus,
  });

  useEffect(() => {
    if (user && !searchParams.get('contactId')) {
      setFormData(prev => ({
        ...prev,
        budgetMin: user.defaultBudgetMin,
        budgetMax: user.defaultBudgetMax,
      }));
    }
  }, [user, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactId) return;

    createPlan.mutate({
      ...formData,
      eventId: formData.eventId || undefined,
      ideas: [],
    }, {
      onSuccess: (newPlan) => {
        if (newPlan && typeof newPlan === 'object' && 'id' in newPlan) {
          router.push(`/app/planner/${(newPlan as { id: string }).id}`);
        } else {
          router.push('/app/planner');
        }
      },
    });
  };

  const contactEvents = formData.contactId
    ? events.filter(e => e.contactId === formData.contactId)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Gift Plan</h1>
        <p className="text-sm text-slate-500 mt-1">Create a new gift plan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Plan Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contactId" className="block text-sm font-medium text-slate-700 mb-2">
                Contact *
              </label>
              <Select
                id="contactId"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value, eventId: '' })}
                required
              >
                <option value="">Select a contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </Select>
            </div>

            {contactEvents.length > 0 && (
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-slate-700 mb-2">
                  Event (optional)
                </label>
                <Select
                  id="eventId"
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                >
                  <option value="">No event</option>
                  {contactEvents.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetMin" className="block text-sm font-medium text-slate-700 mb-2">
                  Budget Min ($)
                </label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label htmlFor="budgetMax" className="block text-sm font-medium text-slate-700 mb-2">
                  Budget Max ($)
                </label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/app/planner')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPlan.isPending}>
                {createPlan.isPending ? 'Creating...' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
