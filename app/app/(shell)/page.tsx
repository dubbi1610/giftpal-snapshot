'use client';

import { useRouter } from 'next/navigation';
import { useEvents } from '@/lib/hooks/useEvents';
import { usePlans } from '@/lib/hooks/usePlans';
import { useHistory } from '@/lib/hooks/useHistory';
import { useSuggestions } from '@/lib/hooks/useSuggestions';
import { useUser } from '@/lib/hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort, getRelativeDateLabel, isUpcoming } from '@/lib/utils/dates';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Plus, Calendar, Gift, History, Sparkles } from 'lucide-react';
import Link from 'next/link';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: history = [], isLoading: historyLoading } = useHistory();
  const { data: suggestions = [], isLoading: suggestionsLoading } = useSuggestions();

  const upcomingEvents = events
    .filter(e => isUpcoming(e.dateISO, 30))
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    .slice(0, 6);

  const activePlans = plans
    .filter(p => p.status === 'planned' || p.status === 'purchased')
    .slice(0, 5);

  const recentHistory = history
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    .slice(0, 8);

  const topSuggestions = suggestions.slice(0, 6);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      <div>
        {userLoading ? (
          <>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back! Here&apos;s what&apos;s coming up for you.
            </p>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Personalized Gift Idea
            </CardTitle>
            <CardDescription>
              {user?.name ? `Personalized suggestions for ${firstName}` : 'Personalized suggestions for you'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {suggestionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : topSuggestions.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No suggestions yet"
                description={`Add contacts and events to get personalized gift suggestions${firstName !== 'there' ? `, ${firstName}` : ''}`}
              />
            ) : (
              <div className="space-y-3">
                {topSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-medium text-slate-900 mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{suggestion.description}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(suggestion.actionRoute)}
                    >
                      {suggestion.actionLabel}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Events in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming events"
                description={`Add events to keep track of important dates${firstName !== 'there' ? `, ${firstName}` : ''}`}
                action={{
                  label: 'Add Event',
                  onClick: () => router.push('/app/events/new'),
                }}
              />
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/events/${event.id}`)}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{event.title}</p>
                      <p className="text-sm text-slate-500">{getRelativeDateLabel(event.dateISO)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Active Gift Plans
            </CardTitle>
            <CardDescription>Plans in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {plansLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activePlans.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No active plans"
                description={`Create a gift plan to start organizing your gifts${firstName !== 'there' ? `, ${firstName}` : ''}`}
                action={{
                  label: 'Create Plan',
                  onClick: () => router.push('/app/planner/new'),
                }}
              />
            ) : (
              <div className="space-y-3">
                {activePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/planner/${plan.id}`)}
                  >
                    <p className="font-medium text-slate-900 mb-1">Plan #{plan.id.slice(-6)}</p>
                    <p className="text-sm text-slate-500">
                      Budget: {formatCurrencyRange(plan.budgetMin, plan.budgetMax)} • Status: {plan.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent History
            </CardTitle>
            <CardDescription>Recently given and received gifts</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentHistory.length === 0 ? (
              <EmptyState
                icon={History}
                title="No gift history"
                description={`Start logging gifts to track your giving${firstName !== 'there' ? `, ${firstName}` : ''}`}
                action={{
                  label: 'Log Gift',
                  onClick: () => router.push('/app/history'),
                }}
              />
            ) : (
              <div className="space-y-3">
                {recentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/history`)}
                  >
                    <p className="font-medium text-slate-900 mb-1">
                      {item.direction === 'given' ? 'Given' : 'Received'} Gift
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatCurrencyRange(item.amountMin, item.amountMax)} • {formatDateShort(item.dateISO)}
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="secondary" onClick={() => router.push('/app/contacts/new')} className="h-20 flex-col">
              <Plus className="h-5 w-5 mb-2" />
              Add Contact
            </Button>
            <Button variant="secondary" onClick={() => router.push('/app/events/new')} className="h-20 flex-col">
              <Plus className="h-5 w-5 mb-2" />
              New Event
            </Button>
            <Button variant="secondary" onClick={() => router.push('/app/planner/new')} className="h-20 flex-col">
              <Plus className="h-5 w-5 mb-2" />
              New Plan
            </Button>
            <Button variant="secondary" onClick={() => router.push('/app/wishlists/new')} className="h-20 flex-col">
              <Plus className="h-5 w-5 mb-2" />
              New Wishlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
