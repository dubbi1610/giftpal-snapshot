import type { GiftPlan } from '@/lib/types';
import { getStorageItem, setStorageItem } from '../storage';
import { generateId } from '@/lib/utils/id';

const PLANS_KEY = 'giftpal:plans';

export const plansRepo = {
  getAll(): GiftPlan[] {
    return getStorageItem<GiftPlan[]>(PLANS_KEY) || [];
  },

  getById(id: string): GiftPlan | null {
    const plans = this.getAll();
    return plans.find(p => p.id === id) || null;
  },

  getByContactId(contactId: string): GiftPlan[] {
    return this.getAll().filter(p => p.contactId === contactId);
  },

  getByEventId(eventId: string): GiftPlan[] {
    return this.getAll().filter(p => p.eventId === eventId);
  },

  create(plan: Omit<GiftPlan, 'id' | 'createdAt' | 'updatedAt'>): GiftPlan {
    const plans = this.getAll();
    const now = new Date().toISOString();
    const newPlan: GiftPlan = {
      ...plan,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    plans.push(newPlan);
    setStorageItem(PLANS_KEY, plans);
    return newPlan;
  },

  update(id: string, updates: Partial<Omit<GiftPlan, 'id' | 'createdAt'>>): GiftPlan | null {
    const plans = this.getAll();
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) return null;
    plans[index] = {
      ...plans[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem(PLANS_KEY, plans);
    return plans[index];
  },

  delete(id: string): boolean {
    const plans = this.getAll();
    const filtered = plans.filter(p => p.id !== id);
    if (filtered.length === plans.length) return false;
    setStorageItem(PLANS_KEY, filtered);
    return true;
  },
};
