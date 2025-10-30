import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQuery } from '@tanstack/react-query';

import type { ImageCollectionParams, ImageResponse } from '@/types';

export const useImages = ({ hotelId, taskId }: ImageCollectionParams) => {
  return useQuery<ImageResponse[] | null>({
    queryKey: [queryKeys.images, hotelId, taskId],
    queryFn: async () => {
      const res = await api.get<ImageResponse[]>(
        getPath({ hotelId, taskId }).API.IMAGES
      );
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
