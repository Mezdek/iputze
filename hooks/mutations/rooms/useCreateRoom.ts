import { api, useMutationWithToast } from '@lib/client';
import { ClientError, ErrorCodes, getPath, queryKeys } from '@lib/shared';
import type { Room } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import {
  ApiError,
  type RoomCollectionParams,
  type RoomCreationBody,
} from '@/types';

export const useCreateRoom = ({ hotelId }: RoomCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: RoomCreationBody): Promise<Room> => {
      try {
        const res = await api.post<Room>(getPath({ hotelId }).API.ROOMS, data);
        return res;
      } catch (error: unknown) {
        if (error instanceof ApiError && error.isBadRequest()) {
          throw new ClientError('room', ErrorCodes.room.CREATION.DUPLICATE);
        }
        throw new ClientError('room', ErrorCodes.room.UNKNOWN, error);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] }),
  });
};
