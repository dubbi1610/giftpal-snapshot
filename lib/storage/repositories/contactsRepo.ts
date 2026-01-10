import type { Contact } from '@/lib/types';
import { getStorageItem, setStorageItem } from '../storage';
import { generateId } from '@/lib/utils/id';

const CONTACTS_KEY = 'giftpal:contacts';

export const contactsRepo = {
  getAll(): Contact[] {
    return getStorageItem<Contact[]>(CONTACTS_KEY) || [];
  },

  getById(id: string): Contact | null {
    const contacts = this.getAll();
    return contacts.find(c => c.id === id) || null;
  },

  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.getAll();
    const now = new Date().toISOString();
    const newContact: Contact = {
      ...contact,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    contacts.push(newContact);
    setStorageItem(CONTACTS_KEY, contacts);
    return newContact;
  },

  update(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Contact | null {
    const contacts = this.getAll();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem(CONTACTS_KEY, contacts);
    return contacts[index];
  },

  delete(id: string): boolean {
    const contacts = this.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    if (filtered.length === contacts.length) return false;
    setStorageItem(CONTACTS_KEY, filtered);
    return true;
  },
};
