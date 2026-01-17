'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateEvent } from '@/lib/hooks/useEvents';
import { useContacts } from '@/lib/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { EventType, Recurrence } from '@/lib/types';

export default function NewEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createEvent = useCreateEvent();
  const { data: contacts = [] } = useContacts();
  const [formData, setFormData] = useState({
    contactId: searchParams.get('contactId') || '',
    type: (searchParams.get('type') as EventType) || 'birthday',
    title: '',
    dateISO: '',
    recurrence: 'yearly' as Recurrence,
    reminderOffsetsDays: [30, 7],
  });

  useEffect(() => {
    if (formData.contactId && formData.type && !formData.title) {
      const contact = contacts.find(c => c.id === formData.contactId);
      if (contact) {
        const typeLabels: Record<EventType, string> = {
          birthday: 'Birthday',
          anniversary: 'Anniversary',
          holiday: 'Holiday',
          custom: 'Custom Event',
        };
        setFormData(prev => ({ ...prev, title: `${contact.name}'s ${typeLabels[formData.type]}` }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contactId, formData.type, contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dateISO) return;

    createEvent.mutate({
      ...formData,
      contactId: formData.contactId || undefined,
      reminderOffsetsDays: formData.reminderOffsetsDays.map(d => parseInt(d.toString())),
    }, {
      onSuccess: () => {
        router.push('/app/events');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Event</h1>
        <p className="text-sm text-slate-500 mt-1">Add a new event to track</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contactId" className="block text-sm font-medium text-slate-700 mb-2">
                Contact (optional)
              </label>
              <Select
                id="contactId"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value, title: '' })}
              >
                <option value="">No contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                Event Type
              </label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType, title: '' })}
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="holiday">Holiday</option>
                <option value="custom">Custom</option>
              </Select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title"
                required
              />
            </div>

            <div>
              <label htmlFor="dateISO" className="block text-sm font-medium text-slate-700 mb-2">
                Date *
              </label>
              <Input
                id="dateISO"
                type="date"
                value={formData.dateISO}
                onChange={(e) => setFormData({ ...formData, dateISO: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="recurrence" className="block text-sm font-medium text-slate-700 mb-2">
                Recurrence
              </label>
              <Select
                id="recurrence"
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as Recurrence })}
              >
                <option value="none">None</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/app/events')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createEvent.isPending}>
                {createEvent.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
