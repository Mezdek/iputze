import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { ImageCollectionParams, ImageResponse } from '@/types';

export const useImages = ({ hotelId, taskId }: ImageCollectionParams) => {
  return useQuery<ImageResponse[] | null>({
    queryKey: queryKeys.taskImages(hotelId, taskId),
    queryFn: async () => {
      const res = await api.get<ImageResponse[]>(
        getPath({ hotelId, taskId }).API.IMAGES
      );
      return res;
    },
  });
};
