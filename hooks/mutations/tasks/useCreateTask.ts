import type { Task } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
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
        queryKey: queryKeys.tasks(hotelId),
      }),
  });
};
