'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/lib/hooks/useContacts';
import { useEvents } from '@/lib/hooks/useEvents';
import { usePlans } from '@/lib/hooks/usePlans';
import { useHistory } from '@/lib/hooks/useHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyRange } from '@/lib/utils/money';
import { formatDateShort, isUpcoming } from '@/lib/utils/dates';
import { Users, Plus } from 'lucide-react';
import type { Relationship } from '@/lib/types';

export default function ContactsPage() {
  const router = useRouter();
  const { data: contacts = [], isLoading } = useContacts();
  const { data: events = [] } = useEvents();
  const { data: plans = [] } = usePlans();
  const { data: history = [] } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState<Relationship | 'all'>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelationship = relationshipFilter === 'all' || contact.relationship === relationshipFilter;
    return matchesSearch && matchesRelationship;
  });

  const getNextEvent = (contactId: string) => {
    const contactEvents = events
      .filter(e => e.contactId === contactId && isUpcoming(e.dateISO, 365))
      .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
    return contactEvents[0];
  };

  const getSuggestedBudget = (contactId: string) => {
    const contactHistory = history.filter(h => h.contactId === contactId && h.direction === 'given');
    if (contactHistory.length >= 2) {
      const avgMin = contactHistory.reduce((sum, h) => sum + h.amountMin, 0) / contactHistory.length;
      const avgMax = contactHistory.reduce((sum, h) => sum + h.amountMax, 0) / contactHistory.length;
      return { min: Math.round(avgMin), max: Math.round(avgMax) };
    }
    return null;
  };

  const getLastGift = (contactId: string) => {
    const contactHistory = history
      .filter(h => h.contactId === contactId)
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
    return contactHistory[0];
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
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your contacts and their gift preferences</p>
        </div>
        <Button onClick={() => router.push('/app/contacts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Contacts</CardTitle>
            <div className="flex gap-3">
              <Input
                type="search"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value as Relationship | 'all')}
              >
                <option value="all">All Relationships</option>
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="coworker">Coworker</option>
                <option value="acquaintance">Acquaintance</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <EmptyState
              icon={Users}
              title={contacts.length === 0 ? 'No contacts yet' : 'No contacts match your filters'}
              description={
                contacts.length === 0
                  ? 'Add your first contact to start organizing gifts'
                  : 'Try adjusting your search or filters'
              }
              action={
                contacts.length === 0
                  ? {
                      label: 'Add Contact',
                      onClick: () => router.push('/app/contacts/new'),
                    }
                  : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Next Event</TableHead>
                  <TableHead>Suggested Budget</TableHead>
                  <TableHead>Last Gift</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  const nextEvent = getNextEvent(contact.id);
                  const suggestedBudget = getSuggestedBudget(contact.id);
                  const lastGift = getLastGift(contact.id);

                  return (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => router.push(`/app/contacts/${contact.id}`)}
                    >
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{contact.relationship}</Badge>
                      </TableCell>
                      <TableCell>
                        {nextEvent ? (
                          <span className="text-sm">{formatDateShort(nextEvent.dateISO)}</span>
                        ) : (
                          <span className="text-sm text-slate-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {suggestedBudget ? (
                          <span className="text-sm">{formatCurrencyRange(suggestedBudget.min, suggestedBudget.max)}</span>
                        ) : (
                          <span className="text-sm text-slate-400">No history</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lastGift ? (
                          <span className="text-sm">
                            {formatCurrencyRange(lastGift.amountMin, lastGift.amountMax)} • {formatDateShort(lastGift.dateISO)}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
