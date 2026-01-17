export type Relationship = 'family' | 'friend' | 'coworker' | 'acquaintance' | 'other';

export type GiftingStyle = 'practical' | 'thoughtful' | 'premium';

export type EventType = 'birthday' | 'anniversary' | 'holiday' | 'custom';

export type Recurrence = 'none' | 'yearly';

export type Priority = 'low' | 'med' | 'high';

export type GiftPlanStatus = 'planned' | 'purchased' | 'given';

export type GiftDirection = 'given' | 'received';

export interface UserProfile {
  id: string;
  name: string;
  defaultBudgetMin: number;
  defaultBudgetMax: number;
  giftingStyle: GiftingStyle;
  topRelationships: Relationship[];
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: Relationship;
  tags: string[];
  interests: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  contactId?: string;
  type: EventType;
  title: string;
  dateISO: string;
  recurrence: Recurrence;
  reminderOffsetsDays: number[];
  createdAt: string;
  updatedAt: string;
}

export interface GiftIdea {
  id: string;
  title: string;
  link?: string;
  priceMin?: number;
  priceMax?: number;
  notes?: string;
  priority: Priority;
}

export interface GiftPlan {
  id: string;
  contactId: string;
  eventId?: string;
  budgetMin: number;
  budgetMax: number;
  status: GiftPlanStatus;
  ideas: GiftIdea[];
  purchasedTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  ownerContactId?: string;
  title: string;
  description?: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  title: string;
  link?: string;
  priceMin?: number;
  priceMax?: number;
  priority: Priority;
  notes?: string;
}

export interface GiftHistory {
  id: string;
  direction: GiftDirection;
  contactId: string;
  eventId?: string;
  dateISO: string;
  amountMin: number;
  amountMax: number;
  notes?: string;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  type: 'upcoming_no_plan' | 'budget_guidance' | 'gift_ideas' | 'planning_backlog';
  title: string;
  description: string;
  priority: Priority;
  contactId?: string;
  eventId?: string;
  actionLabel: string;
  actionRoute: string;
}
