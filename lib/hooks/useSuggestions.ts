'use client';

import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { useUser } from './useUser';
import { useContacts } from './useContacts';
import { useEvents } from './useEvents';
import { usePlans } from './usePlans';
import { useHistory } from './useHistory';
import { generateSuggestions } from '@/lib/personalization';

export function useSuggestions() {
  const api = useApi();
  const { data: user } = useUser();
  const { data: contacts = [] } = useContacts();
  const { data: events = [] } = useEvents();
  const { data: plans = [] } = usePlans();
  const { data: history = [] } = useHistory();

  return useQuery({
    queryKey: ['suggestions', user?.id, contacts.length, events.length, plans.length, history.length],
    queryFn: () => generateSuggestions(user || null, contacts, events, plans, history),
    enabled: typeof window !== 'undefined' && !!user,
  });
}
