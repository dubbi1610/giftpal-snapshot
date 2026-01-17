'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { Event } from '@/lib/types';

export function useEvents() {
  const api = useApi();
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api.listEvents(),
    enabled: typeof window !== 'undefined',
  });
}

export function useEvent(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => api.getEvent(id),
    enabled: typeof window !== 'undefined' && !!id,
  });
}

export function useEventsByContact(contactId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['events', 'contact', contactId],
    queryFn: () => api.getEventsByContact(contactId),
    enabled: typeof window !== 'undefined' && !!contactId,
  });
}

export function useCreateEvent() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
      return Promise.resolve(api.createEvent(event));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      if (data.contactId) {
        queryClient.invalidateQueries({ queryKey: ['events', 'contact', data.contactId] });
      }
    },
  });
}

export function useUpdateEvent() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Event, 'id' | 'createdAt'>> }) => {
      return Promise.resolve(api.updateEvent(id, updates));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
      if (data?.contactId) {
        queryClient.invalidateQueries({ queryKey: ['events', 'contact', data.contactId] });
      }
    },
  });
}

export function useDeleteEvent() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(api.deleteEvent(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
