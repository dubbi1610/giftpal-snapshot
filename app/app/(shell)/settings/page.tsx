'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useUpdateUser } from '@/lib/hooks/useUser';
import { useApi } from '@/lib/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { downloadJSON } from '@/lib/utils/download';
import { Settings, Download, RotateCcw, User } from 'lucide-react';
import type { GiftingStyle } from '@/lib/types';
import { resetStorage } from '@/lib/storage/storage';
import { createSeedData } from '@/lib/mockData';
import { userRepo } from '@/lib/storage/repositories/userRepo';
import { contactsRepo } from '@/lib/storage/repositories/contactsRepo';
import { eventsRepo } from '@/lib/storage/repositories/eventsRepo';
import { plansRepo } from '@/lib/storage/repositories/plansRepo';
import { wishlistsRepo, itemsRepo } from '@/lib/storage/repositories/wishlistsRepo';
import { historyRepo } from '@/lib/storage/repositories/historyRepo';

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();
  const api = useApi();
  const [showResetModal, setShowResetModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    defaultBudgetMin: 25,
    defaultBudgetMax: 150,
    giftingStyle: 'thoughtful' as GiftingStyle,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        defaultBudgetMin: user.defaultBudgetMin,
        defaultBudgetMax: user.defaultBudgetMax,
        giftingStyle: user.giftingStyle,
      });
    }
  }, [user]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!user) {
    return null;
  }

  const handleExport = () => {
    const data = api.exportAll();
    downloadJSON(data, `giftpal-export-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleReset = () => {
    resetStorage();
    const seedData = createSeedData();
    userRepo.set(seedData.user);
    seedData.contacts.forEach(c => contactsRepo.create(c));
    seedData.events.forEach(e => eventsRepo.create(e));
    seedData.plans.forEach(p => plansRepo.create(p));
    seedData.wishlists.forEach(w => wishlistsRepo.create(w));
    seedData.wishlistItems.forEach(item => itemsRepo.create(item));
    seedData.history.forEach(h => historyRepo.create(h));
    router.push('/app');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Budget Min ($)</label>
                <Input
                  type="number"
                  value={formData.defaultBudgetMin}
                  onChange={(e) => setFormData({ ...formData, defaultBudgetMin: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Budget Max ($)</label>
                <Input
                  type="number"
                  value={formData.defaultBudgetMax}
                  onChange={(e) => setFormData({ ...formData, defaultBudgetMax: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gifting Style</label>
              <Select
                value={formData.giftingStyle}
                onChange={(e) => setFormData({ ...formData, giftingStyle: e.target.value as GiftingStyle })}
              >
                <option value="practical">Practical</option>
                <option value="thoughtful">Thoughtful</option>
                <option value="premium">Premium</option>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export or reset your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Export Data</h3>
            <p className="text-sm text-slate-500 mb-4">
              Download all your data as a JSON file for backup or transfer
            </p>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Reset Demo Data</h3>
            <p className="text-sm text-slate-500 mb-4">
              Clear all data and reset to demo data. This action cannot be undone.
            </p>
            <Button variant="danger" onClick={() => setShowResetModal(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset Data
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to reset all data? This will clear everything and load demo data. You will be redirected to the dashboard.
        </p>
      </Modal>
    </div>
  );
}
