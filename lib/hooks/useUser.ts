'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { UserProfile } from '@/lib/types';

export function useUser() {
  const api = useApi();
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.getUser(),
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
