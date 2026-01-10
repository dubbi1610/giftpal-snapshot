'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/lib/hooks/useUser';
import { generateId } from '@/lib/utils/id';
import { seedDemoData } from '@/lib/storage/init';
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
  const createUser = useCreateUser();
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
    createUser.mutate(user, {
      onSuccess: () => {
        // Seed demo data after user is created
        setTimeout(() => {
          seedDemoData();
        }, 100);
        router.push('/app');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-glow">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            Welcome to <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">GiftPal</span>
          </h1>
          <p className="text-lg text-slate-600">Let&apos;s set up your profile to get started</p>
        </div>
        <Card className="w-full shadow-xl border-purple-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg border-b border-purple-100">
            <CardTitle className="text-2xl">Profile Setup</CardTitle>
            <CardDescription>Tell us about yourself to personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      formData.topRelationships.includes(rel)
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
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

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/')}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={createUser.isPending}
                className="shadow-glow"
              >
                {createUser.isPending ? 'Creating Profile...' : 'Get Started'}
              </Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
