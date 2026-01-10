'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { Contact } from '@/lib/types';

export function useContacts() {
  const api = useApi();
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.listContacts(),
    enabled: typeof window !== 'undefined',
  });
}

export function useContact(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => api.getContact(id),
    enabled: typeof window !== 'undefined' && !!id,
  });
}

export function useCreateContact() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
      return Promise.resolve(api.createContact(contact));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Contact, 'id' | 'createdAt'>> }) => {
      return Promise.resolve(api.updateContact(id, updates));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contacts', variables.id] });
    },
  });
}

export function useDeleteContact() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(api.deleteContact(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
