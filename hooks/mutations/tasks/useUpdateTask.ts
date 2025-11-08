import type { Task } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
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
        queryKey: queryKeys.tasks(hotelId),
      }),
  });
};
