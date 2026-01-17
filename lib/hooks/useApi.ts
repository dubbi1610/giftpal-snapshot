'use client';

import { useMemo } from 'react';
import { createLocalApi } from '@/lib/api/localApi';
import type { GiftPalAPI } from '@/lib/api/interface';

let apiInstance: GiftPalAPI | null = null;

export function useApi(): GiftPalAPI {
  return useMemo(() => {
    if (!apiInstance) {
      apiInstance = createLocalApi();
    }
    return apiInstance;
  }, []);
}
