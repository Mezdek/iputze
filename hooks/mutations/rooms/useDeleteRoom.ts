import { api } from '@lib/client';
import { ClientError, ErrorCodes, getPath, queryKeys } from '@lib/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, type RoomParams } from '@/types';

export const useDeleteRoom = ({ hotelId, roomId }: RoomParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<null> => {
      try {
        const res = await api.delete<null>(
          getPath({ hotelId, roomId }).API.ROOM
        );
        return res;
      } catch (error: unknown) {
        if (error instanceof ApiError && error.isBadRequest()) {
          throw new ClientError('room', ErrorCodes.room.DELETION.HAS_TASKS);
        }
        throw new ClientError('room', ErrorCodes.room.UNKNOWN, error);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] }),
  });
};
