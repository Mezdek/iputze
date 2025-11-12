import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { RoomParams, RoomWithContext } from '@/types';

export const useRoom = ({ roomId, hotelId }: RoomParams) => {
  return useQuery<RoomWithContext | null>({
    queryKey: queryKeys.room(hotelId, roomId),
    queryFn: async () => {
      const res = await api.get<RoomWithContext>(
        getPath({ hotelId, roomId }).API.ROOM
      );
      return res;
    },
  });
};
