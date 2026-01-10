'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/lib/hooks/useApi';
import { generateId } from '@/lib/utils/id';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Relationship, GiftingStyle } from '@/lib/types';
import { Gift } from 'lucide-react';
import { z } from 'zod';

const onboardingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  defaultBudgetMin: z.coerce.number().min(0),
  defaultBudgetMax: z.coerce.number().min(0),
  giftingStyle: z.enum(['practical', 'thoughtful', 'premium']),
  topRelationships: z.array(z.enum(['family', 'friend', 'coworker'])).min(1, 'Select at least one relationship'),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const api = useApi();
  const [formData, setFormData] = useState({
    name: '',
    defaultBudgetMin: 25,
    defaultBudgetMax: 150,
    giftingStyle: 'thoughtful' as GiftingStyle,
    topRelationships: [] as Relationship[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleRelationship = (rel: Relationship) => {
    const current = formData.topRelationships;
    if (current.includes(rel)) {
      setFormData({ ...formData, topRelationships: current.filter(r => r !== rel) });
    } else {
      setFormData({ ...formData, topRelationships: [...current, rel] });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onboardingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const user = {
      id: generateId(),
      name: result.data.name,
      defaultBudgetMin: result.data.defaultBudgetMin,
      defaultBudgetMax: result.data.defaultBudgetMax,
      giftingStyle: result.data.giftingStyle,
      topRelationships: result.data.topRelationships,
      createdAt: new Date().toISOString(),
    };
    api.updateUser(user as any);
    router.push('/app');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-6 w-6 text-slate-900" />
            <CardTitle className="text-2xl">Welcome to GiftPal</CardTitle>
          </div>
          <CardDescription>Let&apos;s set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="defaultBudgetMin" className="block text-sm font-medium text-slate-700 mb-2">
                  Default Budget Min ($)
                </label>
                <Input
                  id="defaultBudgetMin"
                  type="number"
                  value={formData.defaultBudgetMin}
                  onChange={(e) => setFormData({ ...formData, defaultBudgetMin: parseInt(e.target.value) || 0 })}
                  className={errors.defaultBudgetMin ? 'border-red-500' : ''}
                />
                {errors.defaultBudgetMin && (
                  <p className="mt-1 text-sm text-red-600">{errors.defaultBudgetMin}</p>
                )}
              </div>
              <div>
                <label htmlFor="defaultBudgetMax" className="block text-sm font-medium text-slate-700 mb-2">
                  Default Budget Max ($)
                </label>
                <Input
                  id="defaultBudgetMax"
                  type="number"
                  value={formData.defaultBudgetMax}
                  onChange={(e) => setFormData({ ...formData, defaultBudgetMax: parseInt(e.target.value) || 0 })}
                  className={errors.defaultBudgetMax ? 'border-red-500' : ''}
                />
                {errors.defaultBudgetMax && (
                  <p className="mt-1 text-sm text-red-600">{errors.defaultBudgetMax}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="giftingStyle" className="block text-sm font-medium text-slate-700 mb-2">
                Gifting Style
              </label>
              <Select
                id="giftingStyle"
                value={formData.giftingStyle}
                onChange={(e) => setFormData({ ...formData, giftingStyle: e.target.value as GiftingStyle })}
                className={errors.giftingStyle ? 'border-red-500' : ''}
              >
                <option value="practical">Practical</option>
                <option value="thoughtful">Thoughtful</option>
                <option value="premium">Premium</option>
              </Select>
              {errors.giftingStyle && (
                <p className="mt-1 text-sm text-red-600">{errors.giftingStyle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Top Relationships (select at least one)
              </label>
              <div className="flex flex-wrap gap-3">
                {(['family', 'friend', 'coworker'] as Relationship[]).map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => toggleRelationship(rel)}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      formData.topRelationships.includes(rel)
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {rel.charAt(0).toUpperCase() + rel.slice(1)}
                  </button>
                ))}
              </div>
              {errors.topRelationships && (
                <p className="mt-1 text-sm text-red-600">{errors.topRelationships}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" size="lg">
                Get Started
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
