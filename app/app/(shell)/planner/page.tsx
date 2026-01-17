'use client';

import { useRouter } from 'next/navigation';
import { usePlans } from '@/lib/hooks/usePlans';
import { useContacts } from '@/lib/hooks/useContacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Gift, Plus } from 'lucide-react';
import { useState } from 'react';
import type { GiftPlanStatus } from '@/lib/types';

export default function PlannerPage() {
  const router = useRouter();
  const { data: plans = [], isLoading } = usePlans();
  const { data: contacts = [] } = useContacts();
  const [statusFilter, setStatusFilter] = useState<GiftPlanStatus | 'all'>('all');

  const filteredPlans = plans.filter(plan => {
    return statusFilter === 'all' || plan.status === statusFilter;
  });

  const getContactName = (contactId: string) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Gift Planner</h1>
          <p className="text-sm text-slate-500 mt-1">Plan and track your gift purchases</p>
        </div>
        <Button onClick={() => router.push('/app/planner/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Gift Plans</CardTitle>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as GiftPlanStatus | 'all')}
              className="max-w-xs"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="purchased">Purchased</option>
              <option value="given">Given</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlans.length === 0 ? (
            <EmptyState
              icon={Gift}
              title={plans.length === 0 ? 'No gift plans yet' : 'No plans match your filter'}
              description={
                plans.length === 0
                  ? 'Create a gift plan to start organizing your gifts'
                  : 'Try adjusting your filter'
              }
              action={
                plans.length === 0
                  ? {
                      label: 'New Plan',
                      onClick: () => router.push('/app/planner/new'),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/app/planner/${plan.id}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Plan for {getContactName(plan.contactId)}</p>
                    <p className="text-sm text-slate-500">
                      Budget: {formatCurrencyRange(plan.budgetMin, plan.budgetMax)} • {plan.ideas.length} ideas
                    </p>
                  </div>
                  <Badge variant={plan.status === 'given' ? 'secondary' : plan.status === 'purchased' ? 'outline' : 'default'}>
                    {plan.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
