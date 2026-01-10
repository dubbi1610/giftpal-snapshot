'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { UserProfile } from '@/lib/types';

export function useUser() {
  const api = useApi();
  return useQuery({
    queryKey: ['user'],
    queryFn: () => Promise.resolve(api.getUser()),
    enabled: typeof window !== 'undefined',
    staleTime: Infinity,
    retry: false,
  });
}

export function useCreateUser() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: UserProfile) => {
      return Promise.resolve(api.createUser(user));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUpdateUser() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      return Promise.resolve(api.updateUser(updates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
