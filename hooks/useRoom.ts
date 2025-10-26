import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Room } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import type { RoomParams } from '@/types';

export const useRoom = ({ roomId, hotelId }: RoomParams) => {
  return useQuery<Room | null>({
    queryKey: [queryKeys.room, hotelId, roomId],
    queryFn: async () => {
      const res = await api.get<Room>(getPath({ hotelId, roomId }).API.ROOM);
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60 * 3,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
