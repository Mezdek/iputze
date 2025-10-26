import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQuery } from '@tanstack/react-query';

import type { RoomCollectionParams, RoomWithHotel } from '@/types';

export const useRooms = ({ hotelId }: RoomCollectionParams) => {
  return useQuery<RoomWithHotel[] | null>({
    queryKey: [queryKeys.rooms, hotelId],
    queryFn: async () => {
      const res = await api.get<RoomWithHotel[]>(
        getPath({ hotelId }).API.ROOMS
      );
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60 * 3,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
