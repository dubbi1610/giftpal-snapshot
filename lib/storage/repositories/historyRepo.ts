import type { GiftHistory } from '@/lib/types';
import { getStorageItem, setStorageItem } from '../storage';
import { generateId } from '@/lib/utils/id';

const HISTORY_KEY = 'giftpal:history';

export const historyRepo = {
  getAll(): GiftHistory[] {
    return getStorageItem<GiftHistory[]>(HISTORY_KEY) || [];
  },

  getById(id: string): GiftHistory | null {
    const history = this.getAll();
    return history.find(h => h.id === id) || null;
  },

  getByContactId(contactId: string): GiftHistory[] {
    return this.getAll().filter(h => h.contactId === contactId);
  },

  getByDirection(direction: 'given' | 'received'): GiftHistory[] {
    return this.getAll().filter(h => h.direction === direction);
  },

  create(history: Omit<GiftHistory, 'id' | 'createdAt'>): GiftHistory {
    const allHistory = this.getAll();
    const now = new Date().toISOString();
    const newHistory: GiftHistory = {
      ...history,
      id: generateId(),
      createdAt: now,
    };
    allHistory.push(newHistory);
    setStorageItem(HISTORY_KEY, allHistory);
    return newHistory;
  },

  update(id: string, updates: Partial<Omit<GiftHistory, 'id' | 'createdAt'>>): GiftHistory | null {
    const allHistory = this.getAll();
    const index = allHistory.findIndex(h => h.id === id);
    if (index === -1) return null;
    allHistory[index] = { ...allHistory[index], ...updates };
    setStorageItem(HISTORY_KEY, allHistory);
    return allHistory[index];
  },

  delete(id: string): boolean {
    const allHistory = this.getAll();
    const filtered = allHistory.filter(h => h.id !== id);
    if (filtered.length === allHistory.length) return false;
    setStorageItem(HISTORY_KEY, filtered);
    return true;
  },
};
