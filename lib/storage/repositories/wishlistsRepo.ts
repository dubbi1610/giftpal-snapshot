import type { Wishlist, WishlistItem } from '@/lib/types';
import { getStorageItem, setStorageItem } from '../storage';
import { generateId, generateShareToken } from '@/lib/utils/id';

const WISHLISTS_KEY = 'giftpal:wishlists';
const WISHLIST_ITEMS_KEY = 'giftpal:wishlist:items';

export const wishlistsRepo = {
  getAll(): Wishlist[] {
    return getStorageItem<Wishlist[]>(WISHLISTS_KEY) || [];
  },

  getById(id: string): Wishlist | null {
    const wishlists = this.getAll();
    return wishlists.find(w => w.id === id) || null;
  },

  getByToken(token: string): Wishlist | null {
    const wishlists = this.getAll();
    return wishlists.find(w => w.shareToken === token) || null;
  },

  getByContactId(contactId: string): Wishlist[] {
    return this.getAll().filter(w => w.ownerContactId === contactId);
  },

  create(wishlist: Omit<Wishlist, 'id' | 'shareToken' | 'createdAt' | 'updatedAt'>): Wishlist {
    const wishlists = this.getAll();
    const now = new Date().toISOString();
    const newWishlist: Wishlist = {
      ...wishlist,
      id: generateId(),
      shareToken: generateShareToken(),
      createdAt: now,
      updatedAt: now,
    };
    wishlists.push(newWishlist);
    setStorageItem(WISHLISTS_KEY, wishlists);
    return newWishlist;
  },

  update(id: string, updates: Partial<Omit<Wishlist, 'id' | 'createdAt'>>): Wishlist | null {
    const wishlists = this.getAll();
    const index = wishlists.findIndex(w => w.id === id);
    if (index === -1) return null;
    wishlists[index] = {
      ...wishlists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem(WISHLISTS_KEY, wishlists);
    return wishlists[index];
  },

  delete(id: string): boolean {
    const wishlists = this.getAll();
    const filtered = wishlists.filter(w => w.id !== id);
    if (filtered.length === wishlists.length) return false;
    setStorageItem(WISHLISTS_KEY, filtered);
    // Also delete all items for this wishlist
    itemsRepo.deleteByWishlistId(id);
    return true;
  },
};

export const itemsRepo = {
  getAll(): WishlistItem[] {
    return getStorageItem<WishlistItem[]>(WISHLIST_ITEMS_KEY) || [];
  },

  getById(id: string): WishlistItem | null {
    const items = this.getAll();
    return items.find(i => i.id === id) || null;
  },

  getByWishlistId(wishlistId: string): WishlistItem[] {
    return this.getAll().filter(i => i.wishlistId === wishlistId);
  },

  create(item: Omit<WishlistItem, 'id'>): WishlistItem {
    const items = this.getAll();
    const newItem: WishlistItem = {
      ...item,
      id: generateId(),
    };
    items.push(newItem);
    setStorageItem(WISHLIST_ITEMS_KEY, items);
    return newItem;
  },

  update(id: string, updates: Partial<Omit<WishlistItem, 'id'>>): WishlistItem | null {
    const items = this.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    setStorageItem(WISHLIST_ITEMS_KEY, items);
    return items[index];
  },

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    setStorageItem(WISHLIST_ITEMS_KEY, filtered);
    return true;
  },

  deleteByWishlistId(wishlistId: string): void {
    const items = this.getAll();
    const filtered = items.filter(i => i.wishlistId !== wishlistId);
    setStorageItem(WISHLIST_ITEMS_KEY, filtered);
  },
};
