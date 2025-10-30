import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Task } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type { TaskParams, TaskUpdateBody } from '@/types';

export const useUpdateTask = ({ hotelId, taskId }: TaskParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: TaskUpdateBody): Promise<Task> => {
      const res = await api.patch<Task>(
        getPath({ hotelId, taskId }).API.TASK,
        data
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      }),
  });
};
