import type { UserProfile } from '@/lib/types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../storage';

const USER_KEY = 'giftpal:user:profile';

export const userRepo = {
  get(): UserProfile | null {
    return getStorageItem<UserProfile>(USER_KEY);
  },

  set(user: UserProfile): void {
    setStorageItem(USER_KEY, user);
  },

  update(updates: Partial<UserProfile>): UserProfile | null {
    const current = this.get();
    if (!current) return null;
    const updated = { ...current, ...updates };
    this.set(updated);
    return updated;
  },

  delete(): void {
    removeStorageItem(USER_KEY);
  },

  exists(): boolean {
    return this.get() !== null;
  },
};
