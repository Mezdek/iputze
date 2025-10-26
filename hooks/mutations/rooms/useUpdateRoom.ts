import { api, useMutationWithToast } from '@lib/client';
import { ClientError, ErrorCodes, getPath, queryKeys } from '@lib/shared';
import type { Room } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { ApiError, type RoomParams, type RoomUpdateBody } from '@/types';

export const useUpdateRoom = ({ hotelId, roomId }: RoomParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: RoomUpdateBody): Promise<Room> => {
      try {
        const res = await api.patch<Room>(
          getPath({ hotelId, roomId }).API.ROOM,
          data
        );
        return res;
      } catch (error: unknown) {
        if (error instanceof ApiError && error.isConflict()) {
          throw new ClientError('room', ErrorCodes.room.CREATION.DUPLICATE);
        }
        throw new ClientError('room', ErrorCodes.room.UNKNOWN, error);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] }),
  });
};
