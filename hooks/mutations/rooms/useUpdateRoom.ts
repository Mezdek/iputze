import type { Room } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import { ClientError } from '@/lib/shared/errors/client/ClientError';
import { ErrorCodes } from '@/lib/shared/errors/client/errorCodes';
import type { RoomParams, RoomUpdateBody } from '@/types';
import { ApiError } from '@/types';

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
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms(hotelId) }),
  });
};
