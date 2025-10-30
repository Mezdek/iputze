import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQueryClient } from '@tanstack/react-query';

import type { TaskParams } from '@/types';

export const useDeleteTask = ({ hotelId, taskId }: TaskParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (): Promise<null> => {
      const res = await api.delete<null>(getPath({ hotelId, taskId }).API.TASK);
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      }),
  });
};
