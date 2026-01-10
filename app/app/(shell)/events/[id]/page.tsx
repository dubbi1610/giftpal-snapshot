'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/lib/hooks/useEvents';
import { useContact } from '@/lib/hooks/useContacts';
import { usePlansByEvent } from '@/lib/hooks/usePlans';
import { useDeleteEvent } from '@/lib/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { formatDateLong, getRelativeDateLabel } from '@/lib/utils/dates';
import { Calendar, Gift, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { data: event, isLoading } = useEvent(eventId);
  const { data: contact } = useContact(event?.contactId || '');
  const { data: plans = [] } = usePlansByEvent(eventId);
  const deleteEvent = useDeleteEvent();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!event) {
    return (
      <EmptyState
        title="Event not found"
        description="The event you're looking for doesn't exist"
        action={{
          label: 'Back to Events',
          onClick: () => router.push('/app/events'),
        }}
      />
    );
  }

  const handleDelete = () => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        router.push('/app/events');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Badge variant="secondary">{event.type}</Badge>
            {contact && <span className="text-sm text-slate-600">for {contact.name}</span>}
          </div>
          <p className="mt-2 text-sm text-slate-500">{formatDateLong(event.dateISO)}</p>
          <p className="mt-1 text-sm text-slate-500">{getRelativeDateLabel(event.dateISO)}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push(`/app/planner/new?eventId=${eventId}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

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
              description="Create a gift plan for this event"
              action={{
                label: 'Create Plan',
                onClick: () => router.push(`/app/planner/new?eventId=${eventId}`),
              }}
            />
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/app/planner/${plan.id}`)}
                >
                  <p className="font-medium text-slate-900 mb-1">Plan #{plan.id.slice(-6)}</p>
                  <p className="text-sm text-slate-500">Status: {plan.status}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteEvent.isPending}>
              {deleteEvent.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this event? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
