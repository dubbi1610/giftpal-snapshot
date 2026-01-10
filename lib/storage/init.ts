import { needsMigration, setStorageVersion, STORAGE_VERSION } from './storage';
import { userRepo } from './repositories/userRepo';
import { contactsRepo } from './repositories/contactsRepo';
import { eventsRepo } from './repositories/eventsRepo';
import { plansRepo } from './repositories/plansRepo';
import { wishlistsRepo, itemsRepo } from './repositories/wishlistsRepo';
import { historyRepo } from './repositories/historyRepo';
import { createSeedData } from '@/lib/mockData';
import { generateId } from '@/lib/utils/id';

export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (needsMigration()) {
    // Check if user exists - if not, seed data
    if (!userRepo.exists()) {
      const seedData = createSeedData();
      
      userRepo.set(seedData.user);
      seedData.contacts.forEach(c => contactsRepo.create(c));
      seedData.events.forEach(e => eventsRepo.create(e));
      seedData.plans.forEach(p => plansRepo.create(p));
      seedData.wishlists.forEach(w => wishlistsRepo.create(w));
      seedData.wishlistItems.forEach(item => itemsRepo.create(item));
      seedData.history.forEach(h => historyRepo.create(h));
    }
    
    setStorageVersion(STORAGE_VERSION);
  }
}
