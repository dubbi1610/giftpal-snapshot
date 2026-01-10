import type {
  UserProfile,
  Contact,
  Event,
  GiftPlan,
  GiftHistory,
  Suggestion,
  Priority,
} from '@/lib/types';
import { isUpcoming, getDaysUntil } from '@/lib/utils/dates';
import { formatCurrencyRange } from '@/lib/utils/money';

export function generateSuggestions(
  userProfile: UserProfile | null,
  contacts: Contact[],
  events: Event[],
  plans: GiftPlan[],
  history: GiftHistory[]
): Suggestion[] {
  if (!userProfile) return [];

  const suggestions: Suggestion[] = [];

  // 1. Upcoming events with no plan (within 30 days)
  const upcomingEvents = events.filter(e => isUpcoming(e.dateISO, 30));
  upcomingEvents.forEach(event => {
    if (!event.contactId) return;
    const hasPlan = plans.some(p => p.eventId === event.id && p.status !== 'given');
    if (!hasPlan) {
      const contact = contacts.find(c => c.id === event.contactId);
      if (contact) {
        const days = getDaysUntil(event.dateISO);
        suggestions.push({
          id: `sug-${event.id}`,
          type: 'upcoming_no_plan',
          title: `${contact.name}'s ${event.title}`,
          description: `${days} days away, no gift plan yet`,
          priority: days <= 7 ? 'high' as Priority : days <= 14 ? 'med' as Priority : 'low' as Priority,
          contactId: event.contactId,
          eventId: event.id,
          actionLabel: 'Create Plan',
          actionRoute: `/app/planner/new?contactId=${event.contactId}&eventId=${event.id}`,
        });
      }
    }
  });

  // 2. Budget guidance based on history
  contacts.forEach(contact => {
    const contactHistory = history.filter(h => h.contactId === contact.id && h.direction === 'given');
    if (contactHistory.length >= 2) {
      const avgMin = contactHistory.reduce((sum, h) => sum + h.amountMin, 0) / contactHistory.length;
      const avgMax = contactHistory.reduce((sum, h) => sum + h.amountMax, 0) / contactHistory.length;
      const recommendedMin = Math.round(avgMin);
      const recommendedMax = Math.round(avgMax);
      const currentBudget = plans
        .filter(p => p.contactId === contact.id && p.status === 'planned')
        .map(p => (p.budgetMin + p.budgetMax) / 2);
      
      if (currentBudget.length === 0 || currentBudget[0] < recommendedMin || currentBudget[0] > recommendedMax) {
        suggestions.push({
          id: `sug-budget-${contact.id}`,
          type: 'budget_guidance',
          title: `Budget suggestion for ${contact.name}`,
          description: `Based on past gifts, consider ${formatCurrencyRange(recommendedMin, recommendedMax)}`,
          priority: 'med' as Priority,
          contactId: contact.id,
          actionLabel: 'View Contact',
          actionRoute: `/app/contacts/${contact.id}`,
        });
      }
    } else if (contactHistory.length === 0 && userProfile.topRelationships.includes(contact.relationship)) {
      // Suggest default budget for top relationships
      suggestions.push({
        id: `sug-budget-default-${contact.id}`,
        type: 'budget_guidance',
        title: `Budget for ${contact.name}`,
        description: `Consider ${formatCurrencyRange(userProfile.defaultBudgetMin, userProfile.defaultBudgetMax)} based on your preferences`,
        priority: 'low' as Priority,
        contactId: contact.id,
        actionLabel: 'View Contact',
        actionRoute: `/app/contacts/${contact.id}`,
      });
    }
  });

  // 3. Gift ideas based on interests and relationship
  contacts.forEach(contact => {
    const hasActivePlan = plans.some(p => p.contactId === contact.id && p.status === 'planned');
    if (!hasActivePlan && contact.interests.length > 0) {
      const interestExamples: Record<string, string[]> = {
        photography: ['Camera accessories', 'Photo printing service', 'Photography book'],
        cooking: ['Cookbook', 'Kitchen tools', 'Cooking class'],
        books: ['Book subscription', 'Reading light', 'Bookstore gift card'],
        technology: ['Tech gadget', 'Wireless charger', 'USB hub'],
        gaming: ['Game controller', 'Gaming mouse', 'Game gift card'],
        'craft-beer': ['Beer tasting set', 'Beer subscription', 'Brewery tour'],
        yoga: ['Yoga mat', 'Meditation app', 'Yoga props'],
        wellness: ['Spa gift card', 'Wellness journal', 'Essential oils'],
        travel: ['Travel guide', 'Luggage tag', 'Travel wallet'],
        coffee: ['Coffee beans', 'Coffee maker', 'Cafe gift card'],
        'management-books': ['Leadership book', 'Book subscription', 'Audiobook'],
        running: ['Running shoes', 'Fitness tracker', 'Running gear'],
        fashion: ['Clothing store gift card', 'Accessories', 'Styling service'],
        art: ['Art supplies', 'Art print', 'Museum membership'],
        music: ['Concert tickets', 'Music subscription', 'Vinyl record'],
        fitness: ['Gym bag', 'Resistance bands', 'Protein powder'],
        nutrition: ['Smoothie maker', 'Meal prep containers', 'Nutrition book'],
        sports: ['Sports gear', 'Game tickets', 'Team merchandise'],
        productivity: ['Planner', 'Desk organizer', 'Time tracker'],
        'tech-gadgets': ['Smart device', 'Cable organizer', 'Phone stand'],
        podcasts: ['Podcast microphone', 'Headphones', 'Podcast subscription'],
        gardening: ['Garden tools', 'Plant seeds', 'Garden book'],
        history: ['History book', 'Documentary subscription', 'Museum gift card'],
        'classical-music': ['Concert tickets', 'Classical album', 'Music subscription'],
        vintage: ['Vintage store gift card', 'Vintage accessories', 'Antique item'],
        sustainability: ['Eco-friendly products', 'Reusable items', 'Sustainable brand gift card'],
        baking: ['Baking tools', 'Baking cookbook', 'Ingredients subscription'],
        leadership: ['Leadership book', 'Course subscription', 'Coaching session'],
        philosophy: ['Philosophy book', 'Lecture series', 'Philosophy podcast subscription'],
        wine: ['Wine collection', 'Wine tasting', 'Wine storage'],
      };

      const suggestionsByInterest = contact.interests
        .map(interest => interestExamples[interest] || [])
        .flat()
        .slice(0, 3);

      if (suggestionsByInterest.length > 0) {
        suggestions.push({
          id: `sug-ideas-${contact.id}`,
          type: 'gift_ideas',
          title: `Gift ideas for ${contact.name}`,
          description: `Ideas based on interests: ${suggestionsByInterest.join(', ')}`,
          priority: userProfile.topRelationships.includes(contact.relationship) ? 'med' as Priority : 'low' as Priority,
          contactId: contact.id,
          actionLabel: 'Create Plan',
          actionRoute: `/app/planner/new?contactId=${contact.id}`,
        });
      }
    }
  });

  // 4. Planning backlog - contacts without common events
  contacts.forEach(contact => {
    const contactEvents = events.filter(e => e.contactId === contact.id);
    const hasBirthday = contactEvents.some(e => e.type === 'birthday');
    const hasAnniversary = contactEvents.some(e => e.type === 'anniversary');
    
    if (!hasBirthday && (contact.relationship === 'family' || contact.relationship === 'friend')) {
      suggestions.push({
        id: `sug-backlog-birthday-${contact.id}`,
        type: 'planning_backlog',
        title: `Add birthday for ${contact.name}`,
        description: 'Consider adding their birthday to never miss it',
        priority: 'low' as Priority,
        contactId: contact.id,
        actionLabel: 'Add Event',
        actionRoute: `/app/events/new?contactId=${contact.id}&type=birthday`,
      });
    }
  });

  // Sort by priority (high > med > low) and return top 12
  const priorityOrder: Record<Priority, number> = { high: 3, med: 2, low: 1 };
  return suggestions
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, 12);
}
