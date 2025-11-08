import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { PublicHotel } from '@/types';

export const useHotels = () => {
  return useQuery<PublicHotel[] | null>({
    queryKey: [queryKeys.hotels],
    queryFn: async () => {
      const res = await api.get<PublicHotel[]>(getPath().API.HOTELS);
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
