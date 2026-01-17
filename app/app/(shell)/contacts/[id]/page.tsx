'use client';

import { useRouter, useParams } from 'next/navigation';
import { useContact } from '@/lib/hooks/useContacts';
import { useEventsByContact } from '@/lib/hooks/useEvents';
import { usePlansByContact } from '@/lib/hooks/usePlans';
import { useHistoryByContact } from '@/lib/hooks/useHistory';
import { useWishlistsByContact } from '@/lib/hooks/useWishlists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort, getRelativeDateLabel, isUpcoming } from '@/lib/utils/dates';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Calendar, Gift, History, Heart, Plus } from 'lucide-react';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;
  const { data: contact, isLoading } = useContact(contactId);
  const { data: events = [] } = useEventsByContact(contactId);
  const { data: plans = [] } = usePlansByContact(contactId);
  const { data: history = [] } = useHistoryByContact(contactId);
  const { data: wishlists = [] } = useWishlistsByContact(contactId);

  const upcomingEvents = events.filter(e => isUpcoming(e.dateISO, 365));

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!contact) {
    return (
      <EmptyState
        title="Contact not found"
        description="The contact you're looking for doesn't exist"
        action={{
          label: 'Back to Contacts',
          onClick: () => router.push('/app/contacts'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{contact.relationship}</Badge>
            {contact.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          {contact.interests.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {contact.interests.map(interest => (
                  <Badge key={interest} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
          {contact.notes && (
            <p className="mt-3 text-sm text-slate-600">{contact.notes}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push(`/app/events/new?contactId=${contactId}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button onClick={() => router.push(`/app/planner/new?contactId=${contactId}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming events"
                description="Add events to track important dates"
                action={{
                  label: 'Add Event',
                  onClick: () => router.push(`/app/events/new?contactId=${contactId}`),
                }}
              />
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/events/${event.id}`)}
                  >
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-500">{getRelativeDateLabel(event.dateISO)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Gift Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No gift plans"
                description="Create a gift plan for this contact"
                action={{
                  label: 'Create Plan',
                  onClick: () => router.push(`/app/planner/new?contactId=${contactId}`),
                }}
              />
            ) : (
              <div className="space-y-3">
                {plans.slice(0, 5).map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/planner/${plan.id}`)}
                  >
                    <p className="font-medium text-slate-900 mb-1">Plan #{plan.id.slice(-6)}</p>
                    <p className="text-sm text-slate-500">
                      {formatCurrencyRange(plan.budgetMin, plan.budgetMax)} • {plan.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Gift History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No gift history"
              description="Log gifts to track your giving history"
            />
          ) : (
            <div className="space-y-3">
              {history
                .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
                .slice(0, 10)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.direction === 'given' ? 'Given' : 'Received'} Gift
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatCurrencyRange(item.amountMin, item.amountMax)} • {formatDateShort(item.dateISO)}
                      </p>
                      {item.notes && <p className="text-sm text-slate-600 mt-1">{item.notes}</p>}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {wishlists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wishlists.map((wishlist) => (
                <div
                  key={wishlist.id}
                  className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/app/wishlists/${wishlist.id}`)}
                >
                  <p className="font-medium text-slate-900">{wishlist.title}</p>
                  {wishlist.description && <p className="text-sm text-slate-500 mt-1">{wishlist.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
