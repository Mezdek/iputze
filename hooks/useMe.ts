import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { MeResponse } from '@/types';

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const res = await api.get<MeResponse>(getPath().API.ME);
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
