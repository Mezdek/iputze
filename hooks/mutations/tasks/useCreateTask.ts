import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Task } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type { TaskCollectionParams, TaskCreationBody } from '@/types';

export const useCreateTask = ({ hotelId }: TaskCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: TaskCreationBody): Promise<Task> => {
      const res = await api.post<Task>(getPath({ hotelId }).API.TASKS, data);
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      }),
  });
};
