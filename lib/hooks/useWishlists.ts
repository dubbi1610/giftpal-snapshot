'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import type { Wishlist, WishlistItem } from '@/lib/types';

export function useWishlists() {
  const api = useApi();
  return useQuery({
    queryKey: ['wishlists'],
    queryFn: () => api.listWishlists(),
    enabled: typeof window !== 'undefined',
  });
}

export function useWishlist(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['wishlists', id],
    queryFn: () => api.getWishlist(id),
    enabled: typeof window !== 'undefined' && !!id,
  });
}

export function useWishlistByToken(token: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['wishlists', 'token', token],
    queryFn: () => api.getWishlistByToken(token),
    enabled: typeof window !== 'undefined' && !!token,
  });
}

export function useWishlistsByContact(contactId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['wishlists', 'contact', contactId],
    queryFn: () => api.getWishlistsByContact(contactId),
    enabled: typeof window !== 'undefined' && !!contactId,
  });
}

export function useCreateWishlist() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wishlist: Omit<Wishlist, 'id' | 'shareToken' | 'createdAt' | 'updatedAt'>) => {
      return Promise.resolve(api.createWishlist(wishlist));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useUpdateWishlist() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Wishlist, 'id' | 'createdAt'>> }) => {
      return Promise.resolve(api.updateWishlist(id, updates));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['wishlists', variables.id] });
    },
  });
}

export function useDeleteWishlist() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(api.deleteWishlist(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useWishlistItems(wishlistId: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['wishlist-items', wishlistId],
    queryFn: () => api.listWishlistItems(wishlistId),
    enabled: typeof window !== 'undefined' && !!wishlistId,
  });
}

export function useCreateWishlistItem() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wishlistId, item }: { wishlistId: string; item: Omit<WishlistItem, 'id'> }) => {
      return Promise.resolve(api.createWishlistItem({ ...item, wishlistId }));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-items', variables.wishlistId] });
    },
  });
}

export function useUpdateWishlistItem() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<WishlistItem, 'id'>> }) => {
      return Promise.resolve(api.updateWishlistItem(id, updates));
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['wishlist-items', data.wishlistId] });
      }
    },
  });
}

export function useDeleteWishlistItem() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, wishlistId }: { id: string; wishlistId: string }) => {
      api.deleteWishlistItem(id);
      return Promise.resolve({ id, wishlistId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-items', data.wishlistId] });
    },
  });
}
