import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
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
        queryKey: queryKeys.tasks(hotelId),
      }),
  });
};
