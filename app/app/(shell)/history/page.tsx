'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHistory, useCreateHistory } from '@/lib/hooks/useHistory';
import { useContacts } from '@/lib/hooks/useContacts';
import { useEvents } from '@/lib/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort } from '@/lib/utils/dates';
import { formatCurrencyRange } from '@/lib/utils/money';
import { History, Plus } from 'lucide-react';
import type { GiftDirection } from '@/lib/types';
import { getTodayISO } from '@/lib/utils/dates';

export default function HistoryPage() {
  const router = useRouter();
  const { data: history = [], isLoading } = useHistory();
  const { data: contacts = [] } = useContacts();
  const { data: events = [] } = useEvents();
  const createHistory = useCreateHistory();
  const [showModal, setShowModal] = useState(false);
  const [directionFilter, setDirectionFilter] = useState<GiftDirection | 'all'>('all');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    direction: 'given' as GiftDirection,
    contactId: '',
    eventId: '',
    dateISO: getTodayISO().split('T')[0],
    amountMin: 0,
    amountMax: 0,
    notes: '',
  });

  const filteredHistory = history.filter(item => {
    const matchesDirection = directionFilter === 'all' || item.direction === directionFilter;
    const matchesContact = contactFilter === 'all' || item.contactId === contactFilter;
    return matchesDirection && matchesContact;
  }).sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactId || !formData.dateISO) return;

    const dateISO = formData.dateISO ? new Date(formData.dateISO + 'T00:00:00').toISOString() : getTodayISO();
    
    createHistory.mutate({
      ...formData,
      eventId: formData.eventId || undefined,
      dateISO,
      amountMin: formData.amountMin || 0,
      amountMax: formData.amountMax || formData.amountMin || 0,
    }, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({
          direction: 'given',
          contactId: '',
          eventId: '',
          dateISO: getTodayISO().split('T')[0],
          amountMin: 0,
          amountMax: 0,
          notes: '',
        });
      },
    });
  };

  const contactEvents = formData.contactId
    ? events.filter(e => e.contactId === formData.contactId)
    : [];

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
          <h1 className="text-2xl font-bold text-slate-900">Gift History</h1>
          <p className="text-sm text-slate-500 mt-1">Track gifts you&apos;ve given and received</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Gift
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All History</CardTitle>
            <div className="flex gap-3">
              <Select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value as GiftDirection | 'all')}
              >
                <option value="all">All</option>
                <option value="given">Given</option>
                <option value="received">Received</option>
              </Select>
              <Select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
              >
                <option value="all">All Contacts</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <EmptyState
              icon={History}
              title={history.length === 0 ? 'No gift history yet' : 'No history matches your filters'}
              description={
                history.length === 0
                  ? 'Start logging gifts to track your giving history'
                  : 'Try adjusting your filters'
              }
              action={
                history.length === 0
                  ? {
                      label: 'Log Gift',
                      onClick: () => setShowModal(true),
                    }
                  : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDateShort(item.dateISO)}</TableCell>
                    <TableCell>
                      <Badge variant={item.direction === 'given' ? 'default' : 'secondary'}>
                        {item.direction}
                      </Badge>
                    </TableCell>
                    <TableCell>{getContactName(item.contactId)}</TableCell>
                    <TableCell>{formatCurrencyRange(item.amountMin, item.amountMax)}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Gift"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createHistory.isPending}>
              {createHistory.isPending ? 'Logging...' : 'Log Gift'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Direction *</label>
            <Select
              value={formData.direction}
              onChange={(e) => setFormData({ ...formData, direction: e.target.value as GiftDirection, eventId: '' })}
              required
            >
              <option value="given">Given</option>
              <option value="received">Received</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contact *</label>
            <Select
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Event (optional)</label>
              <Select
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
            <Input
              type="date"
              value={formData.dateISO}
              onChange={(e) => setFormData({ ...formData, dateISO: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount Min ($)</label>
              <Input
                type="number"
                value={formData.amountMin}
                onChange={(e) => setFormData({ ...formData, amountMin: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount Max ($)</label>
              <Input
                type="number"
                value={formData.amountMax}
                onChange={(e) => setFormData({ ...formData, amountMax: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              placeholder="Additional notes"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
