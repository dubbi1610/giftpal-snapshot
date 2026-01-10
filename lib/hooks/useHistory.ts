'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { GiftHistory } from '@/lib/types';

export function useHistory() {
  const api = useApi();
  return useQuery({
    queryKey: ['history'],
    queryFn: () => api.listHistory(),
    enabled: typeof window !== 'undefined',
  });
}

export function useHistoryByContact(contactId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['history', 'contact', contactId],
    queryFn: () => api.getHistoryByContact(contactId),
    enabled: typeof window !== 'undefined' && !!contactId,
  });
}

export function useHistoryByDirection(direction: 'given' | 'received') {
  const api = useApi();
  return useQuery({
    queryKey: ['history', 'direction', direction],
    queryFn: () => api.getHistoryByDirection(direction),
    enabled: typeof window !== 'undefined',
  });
}

export function useCreateHistory() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (history: Omit<GiftHistory, 'id' | 'createdAt'>) => {
      return Promise.resolve(api.createHistory(history));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['history', 'contact', data.contactId] });
      queryClient.invalidateQueries({ queryKey: ['history', 'direction', data.direction] });
    },
  });
}

export function useUpdateHistory() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<GiftHistory, 'id' | 'createdAt'>> }) => {
      return Promise.resolve(api.updateHistory(id, updates));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['history', 'contact', data.contactId] });
        queryClient.invalidateQueries({ queryKey: ['history', 'direction', data.direction] });
      }
    },
  });
}

export function useDeleteHistory() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(api.deleteHistory(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}
