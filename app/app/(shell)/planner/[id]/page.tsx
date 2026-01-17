'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlan } from '@/lib/hooks/usePlans';
import { useUpdatePlan } from '@/lib/hooks/usePlans';
import { useContact } from '@/lib/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { formatCurrencyRange } from '@/lib/utils/money';
import { Gift, Plus, Trash2, Edit2, Save } from 'lucide-react';
import type { GiftIdea, GiftPlanStatus, Priority } from '@/lib/types';
import { generateId } from '@/lib/utils/id';

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  const { data: plan, isLoading } = usePlan(planId);
  const { data: contact } = useContact(plan?.contactId || '');
  const updatePlan = useUpdatePlan();
  const [editingIdea, setEditingIdea] = useState<GiftIdea | null>(null);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [ideaForm, setIdeaForm] = useState({
    title: '',
    link: '',
    priceMin: '',
    priceMax: '',
    notes: '',
    priority: 'med' as Priority,
  });

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!plan) {
    return (
      <EmptyState
        title="Plan not found"
        description="The plan you're looking for doesn't exist"
        action={{
          label: 'Back to Planner',
          onClick: () => router.push('/app/planner'),
        }}
      />
    );
  }

  const handleSavePlan = (updates: Partial<typeof plan>) => {
    updatePlan.mutate({ id: planId, updates });
  };

  const handleAddIdea = () => {
    setEditingIdea(null);
    setIdeaForm({ title: '', link: '', priceMin: '', priceMax: '', notes: '', priority: 'med' });
    setShowIdeaModal(true);
  };

  const handleEditIdea = (idea: GiftIdea) => {
    setEditingIdea(idea);
    setIdeaForm({
      title: idea.title,
      link: idea.link || '',
      priceMin: idea.priceMin?.toString() || '',
      priceMax: idea.priceMax?.toString() || '',
      notes: idea.notes || '',
      priority: idea.priority,
    });
    setShowIdeaModal(true);
  };

  const handleSaveIdea = () => {
    if (!ideaForm.title.trim()) return;

    const newIdea: GiftIdea = editingIdea
      ? { ...editingIdea, ...ideaForm, priceMin: ideaForm.priceMin ? parseInt(ideaForm.priceMin) : undefined, priceMax: ideaForm.priceMax ? parseInt(ideaForm.priceMax) : undefined }
      : {
          id: generateId(),
          ...ideaForm,
          priceMin: ideaForm.priceMin ? parseInt(ideaForm.priceMin) : undefined,
          priceMax: ideaForm.priceMax ? parseInt(ideaForm.priceMax) : undefined,
        };

    const updatedIdeas = editingIdea
      ? plan.ideas.map(i => i.id === editingIdea.id ? newIdea : i)
      : [...plan.ideas, newIdea];

    handleSavePlan({ ideas: updatedIdeas });
    setShowIdeaModal(false);
  };

  const handleDeleteIdea = (ideaId: string) => {
    handleSavePlan({ ideas: plan.ideas.filter(i => i.id !== ideaId) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gift Plan</h1>
          <p className="text-sm text-slate-500 mt-1">for {contact?.name || 'Unknown Contact'}</p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/app/planner')}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <Select
                value={plan.status}
                onChange={(e) => handleSavePlan({ status: e.target.value as GiftPlanStatus })}
              >
                <option value="planned">Planned</option>
                <option value="purchased">Purchased</option>
                <option value="given">Given</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget Min ($)</label>
                <Input
                  type="number"
                  value={plan.budgetMin}
                  onChange={(e) => handleSavePlan({ budgetMin: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget Max ($)</label>
                <Input
                  type="number"
                  value={plan.budgetMax}
                  onChange={(e) => handleSavePlan({ budgetMax: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {plan.status !== 'planned' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Purchased Total ($)</label>
                <Input
                  type="number"
                  value={plan.purchasedTotal || ''}
                  onChange={(e) => handleSavePlan({ purchasedTotal: parseInt(e.target.value) || undefined })}
                  placeholder="Enter total amount"
                />
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Budget Range</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrencyRange(plan.budgetMin, plan.budgetMax)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Gift Ideas
              </CardTitle>
              <Button size="sm" onClick={handleAddIdea}>
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {plan.ideas.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No gift ideas yet"
                description="Add gift ideas to this plan"
                action={{
                  label: 'Add Idea',
                  onClick: handleAddIdea,
                }}
              />
            ) : (
              <div className="space-y-3">
                {plan.ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{idea.title}</p>
                        {idea.priceMin && idea.priceMax && (
                          <p className="text-sm text-slate-500">
                            {formatCurrencyRange(idea.priceMin, idea.priceMax)}
                          </p>
                        )}
                        {idea.link && (
                          <a
                            href={idea.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Link
                          </a>
                        )}
                        {idea.notes && <p className="text-sm text-slate-600 mt-1">{idea.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{idea.priority}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditIdea(idea)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIdea(idea.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showIdeaModal}
        onClose={() => setShowIdeaModal(false)}
        title={editingIdea ? 'Edit Gift Idea' : 'Add Gift Idea'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowIdeaModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIdea}>
              {editingIdea ? 'Save' : 'Add'} Idea
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <Input
              value={ideaForm.title}
              onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
              placeholder="Gift idea title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Link (optional)</label>
            <Input
              type="url"
              value={ideaForm.link}
              onChange={(e) => setIdeaForm({ ...ideaForm, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Min ($)</label>
              <Input
                type="number"
                value={ideaForm.priceMin}
                onChange={(e) => setIdeaForm({ ...ideaForm, priceMin: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Max ($)</label>
              <Input
                type="number"
                value={ideaForm.priceMax}
                onChange={(e) => setIdeaForm({ ...ideaForm, priceMax: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <Select
              value={ideaForm.priority}
              onChange={(e) => setIdeaForm({ ...ideaForm, priority: e.target.value as Priority })}
            >
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
            <textarea
              value={ideaForm.notes}
              onChange={(e) => setIdeaForm({ ...ideaForm, notes: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              placeholder="Additional notes"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
