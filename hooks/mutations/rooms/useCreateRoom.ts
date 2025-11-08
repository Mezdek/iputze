import type { Room } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import { ClientError } from '@/lib/shared/errors/client/ClientError';
import { ErrorCodes } from '@/lib/shared/errors/client/errorCodes';
import type { RoomCollectionParams, RoomCreationBody } from '@/types';
import { ApiError } from '@/types';

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
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms(hotelId) }),
  });
};
