import type { Event } from '@/lib/types';
import { getStorageItem, setStorageItem } from '../storage';
import { generateId } from '@/lib/utils/id';

const EVENTS_KEY = 'giftpal:events';

export const eventsRepo = {
  getAll(): Event[] {
    return getStorageItem<Event[]>(EVENTS_KEY) || [];
  },

  getById(id: string): Event | null {
    const events = this.getAll();
    return events.find(e => e.id === id) || null;
  },

  getByContactId(contactId: string): Event[] {
    return this.getAll().filter(e => e.contactId === contactId);
  },

  create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const events = this.getAll();
    const now = new Date().toISOString();
    const newEvent: Event = {
      ...event,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    events.push(newEvent);
    setStorageItem(EVENTS_KEY, events);
    return newEvent;
  },

  update(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Event | null {
    const events = this.getAll();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem(EVENTS_KEY, events);
    return events[index];
  },

  delete(id: string): boolean {
    const events = this.getAll();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    setStorageItem(EVENTS_KEY, filtered);
    return true;
  },
};
