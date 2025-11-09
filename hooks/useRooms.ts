import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys, STALE_TIME } from '@/lib/shared/constants/querries';
import type { RoomCollectionParams, RoomWithContext } from '@/types';

export const useRooms = ({ hotelId }: RoomCollectionParams) => {
  return useQuery<RoomWithContext[] | null>({
    queryKey: queryKeys.rooms(hotelId),
    queryFn: async () => {
      const res = await api.get<RoomWithContext[]>(
        getPath({ hotelId }).API.ROOMS
      );
      return res;
    },
    staleTime: STALE_TIME.STABLE,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
