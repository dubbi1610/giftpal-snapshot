import type {
  UserProfile,
  Contact,
  Event,
  GiftPlan,
  GiftIdea,
  Wishlist,
  WishlistItem,
  GiftHistory,
} from '@/lib/types';

export interface GiftPalAPI {
  // User
  getUser(): UserProfile | null;
  updateUser(updates: Partial<UserProfile>): UserProfile | null;
  deleteUser(): void;

  // Contacts
  listContacts(): Contact[];
  getContact(id: string): Contact | null;
  createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact;
  updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Contact | null;
  deleteContact(id: string): boolean;

  // Events
  listEvents(): Event[];
  getEvent(id: string): Event | null;
  getEventsByContact(contactId: string): Event[];
  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event;
  updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Event | null;
  deleteEvent(id: string): boolean;

  // Gift Plans
  listPlans(): GiftPlan[];
  getPlan(id: string): GiftPlan | null;
  getPlansByContact(contactId: string): GiftPlan[];
  getPlansByEvent(eventId: string): GiftPlan[];
  createPlan(plan: Omit<GiftPlan, 'id' | 'createdAt' | 'updatedAt'>): GiftPlan;
  updatePlan(id: string, updates: Partial<Omit<GiftPlan, 'id' | 'createdAt'>>): GiftPlan | null;
  deletePlan(id: string): boolean;

  // Wishlists
  listWishlists(): Wishlist[];
  getWishlist(id: string): Wishlist | null;
  getWishlistByToken(token: string): Wishlist | null;
  getWishlistsByContact(contactId: string): Wishlist[];
  createWishlist(wishlist: Omit<Wishlist, 'id' | 'shareToken' | 'createdAt' | 'updatedAt'>): Wishlist;
  updateWishlist(id: string, updates: Partial<Omit<Wishlist, 'id' | 'createdAt'>>): Wishlist | null;
  deleteWishlist(id: string): boolean;

  // Wishlist Items
  listWishlistItems(wishlistId: string): WishlistItem[];
  getWishlistItem(id: string): WishlistItem | null;
  createWishlistItem(item: Omit<WishlistItem, 'id'>): WishlistItem;
  updateWishlistItem(id: string, updates: Partial<Omit<WishlistItem, 'id'>>): WishlistItem | null;
  deleteWishlistItem(id: string): boolean;

  // Gift History
  listHistory(): GiftHistory[];
  getHistory(id: string): GiftHistory | null;
  getHistoryByContact(contactId: string): GiftHistory[];
  getHistoryByDirection(direction: 'given' | 'received'): GiftHistory[];
  createHistory(history: Omit<GiftHistory, 'id' | 'createdAt'>): GiftHistory;
  updateHistory(id: string, updates: Partial<Omit<GiftHistory, 'id' | 'createdAt'>>): GiftHistory | null;
  deleteHistory(id: string): boolean;

  // Export
  exportAll(): Record<string, any>;
  reset(): void;
}
