'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { GiftPlan } from '@/lib/types';

export function usePlans() {
  const api = useApi();
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => api.listPlans(),
    enabled: typeof window !== 'undefined',
  });
}

export function usePlan(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => api.getPlan(id),
    enabled: typeof window !== 'undefined' && !!id,
  });
}

export function usePlansByContact(contactId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['plans', 'contact', contactId],
    queryFn: () => api.getPlansByContact(contactId),
    enabled: typeof window !== 'undefined' && !!contactId,
  });
}

export function usePlansByEvent(eventId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['plans', 'event', eventId],
    queryFn: () => api.getPlansByEvent(eventId),
    enabled: typeof window !== 'undefined' && !!eventId,
  });
}

export function useCreatePlan() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: Omit<GiftPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      return Promise.resolve(api.createPlan(plan));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', 'contact', data.contactId] });
      if (data.eventId) {
        queryClient.invalidateQueries({ queryKey: ['plans', 'event', data.eventId] });
      }
    },
  });
}

export function useUpdatePlan() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<GiftPlan, 'id' | 'createdAt'>> }) => {
      return Promise.resolve(api.updatePlan(id, updates));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', variables.id] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['plans', 'contact', data.contactId] });
        if (data.eventId) {
          queryClient.invalidateQueries({ queryKey: ['plans', 'event', data.eventId] });
        }
      }
    },
  });
}

export function useDeletePlan() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(api.deletePlan(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}
