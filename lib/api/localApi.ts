import type { GiftPalAPI } from './interface';
import { userRepo } from '@/lib/storage/repositories/userRepo';
import { contactsRepo } from '@/lib/storage/repositories/contactsRepo';
import { eventsRepo } from '@/lib/storage/repositories/eventsRepo';
import { plansRepo } from '@/lib/storage/repositories/plansRepo';
import { wishlistsRepo, itemsRepo } from '@/lib/storage/repositories/wishlistsRepo';
import { historyRepo } from '@/lib/storage/repositories/historyRepo';
import { resetStorage } from '@/lib/storage/storage';

export function createLocalApi(): GiftPalAPI {
  return {
    // User
    getUser: () => userRepo.get(),
    createUser: (user) => {
      userRepo.set(user);
      return user;
    },
    updateUser: (updates) => userRepo.update(updates),
    deleteUser: () => userRepo.delete(),

    // Contacts
    listContacts: () => contactsRepo.getAll(),
    getContact: (id) => contactsRepo.getById(id),
    createContact: (contact) => contactsRepo.create(contact),
    updateContact: (id, updates) => contactsRepo.update(id, updates),
    deleteContact: (id) => contactsRepo.delete(id),

    // Events
    listEvents: () => eventsRepo.getAll(),
    getEvent: (id) => eventsRepo.getById(id),
    getEventsByContact: (contactId) => eventsRepo.getByContactId(contactId),
    createEvent: (event) => eventsRepo.create(event),
    updateEvent: (id, updates) => eventsRepo.update(id, updates),
    deleteEvent: (id) => eventsRepo.delete(id),

    // Gift Plans
    listPlans: () => plansRepo.getAll(),
    getPlan: (id) => plansRepo.getById(id),
    getPlansByContact: (contactId) => plansRepo.getByContactId(contactId),
    getPlansByEvent: (eventId) => plansRepo.getByEventId(eventId),
    createPlan: (plan) => plansRepo.create(plan),
    updatePlan: (id, updates) => plansRepo.update(id, updates),
    deletePlan: (id) => plansRepo.delete(id),

    // Wishlists
    listWishlists: () => wishlistsRepo.getAll(),
    getWishlist: (id) => wishlistsRepo.getById(id),
    getWishlistByToken: (token) => wishlistsRepo.getByToken(token),
    getWishlistsByContact: (contactId) => wishlistsRepo.getByContactId(contactId),
    createWishlist: (wishlist) => wishlistsRepo.create(wishlist),
    updateWishlist: (id, updates) => wishlistsRepo.update(id, updates),
    deleteWishlist: (id) => wishlistsRepo.delete(id),

    // Wishlist Items
    listWishlistItems: (wishlistId) => itemsRepo.getByWishlistId(wishlistId),
    getWishlistItem: (id) => itemsRepo.getById(id),
    createWishlistItem: (item) => itemsRepo.create(item),
    updateWishlistItem: (id, updates) => itemsRepo.update(id, updates),
    deleteWishlistItem: (id) => itemsRepo.delete(id),

    // Gift History
    listHistory: () => historyRepo.getAll(),
    getHistory: (id) => historyRepo.getById(id),
    getHistoryByContact: (contactId) => historyRepo.getByContactId(contactId),
    getHistoryByDirection: (direction) => historyRepo.getByDirection(direction),
    createHistory: (history) => historyRepo.create(history),
    updateHistory: (id, updates) => historyRepo.update(id, updates),
    deleteHistory: (id) => historyRepo.delete(id),

    // Export
    exportAll: () => {
      return {
        user: userRepo.get(),
        contacts: contactsRepo.getAll(),
        events: eventsRepo.getAll(),
        plans: plansRepo.getAll(),
        wishlists: wishlistsRepo.getAll(),
        wishlistItems: itemsRepo.getAll(),
        history: historyRepo.getAll(),
      };
    },

    reset: () => {
      resetStorage();
    },
  };
}
