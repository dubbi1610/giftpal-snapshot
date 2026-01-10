'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/lib/hooks/useEvents';
import { useContacts } from '@/lib/hooks/useContacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort, getRelativeDateLabel, isUpcoming } from '@/lib/utils/dates';
import { Calendar, Plus } from 'lucide-react';
import type { EventType } from '@/lib/types';

export default function EventsPage() {
  const router = useRouter();
  const { data: events = [], isLoading } = useEvents();
  const { data: contacts = [] } = useContacts();
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');

  const filteredEvents = events.filter(event => {
    const matchesContact = contactFilter === 'all' || event.contactId === contactFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesContact && matchesType;
  }).sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());

  const upcomingEvents = filteredEvents.filter(e => isUpcoming(e.dateISO, 365));
  const pastEvents = filteredEvents.filter(e => !isUpcoming(e.dateISO, 365));

  const getContactName = (contactId?: string) => {
    if (!contactId) return 'No contact';
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown';
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500 mt-1">Manage birthdays, anniversaries, and other events</p>
        </div>
        <Button onClick={() => router.push('/app/events/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Events</CardTitle>
            <div className="flex gap-3">
              <Select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
              >
                <option value="all">All Contacts</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="holiday">Holiday</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={events.length === 0 ? 'No events yet' : 'No events match your filters'}
              description={
                events.length === 0
                  ? 'Add events to keep track of important dates'
                  : 'Try adjusting your filters'
              }
              action={
                events.length === 0
                  ? {
                      label: 'New Event',
                      onClick: () => router.push('/app/events/new'),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-8">
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming</h2>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/app/events/${event.id}`)}
                      >
                        <div>
                          <p className="font-medium text-slate-900">{event.title}</p>
                          <p className="text-sm text-slate-500">
                            {getContactName(event.contactId)} • {getRelativeDateLabel(event.dateISO)}
                          </p>
                        </div>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Past</h2>
                  <div className="space-y-3">
                    {pastEvents.slice(0, 20).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors cursor-pointer opacity-60"
                        onClick={() => router.push(`/app/events/${event.id}`)}
                      >
                        <div>
                          <p className="font-medium text-slate-900">{event.title}</p>
                          <p className="text-sm text-slate-500">
                            {getContactName(event.contactId)} • {formatDateShort(event.dateISO)}
                          </p>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
