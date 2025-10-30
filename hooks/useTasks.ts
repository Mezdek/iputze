import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQuery } from '@tanstack/react-query';

import type { TaskCollectionParams, TaskResponse } from '@/types';

export const useTasks = ({ hotelId }: TaskCollectionParams) => {
  return useQuery<TaskResponse[] | null>({
    queryKey: [queryKeys.tasks, hotelId],
    queryFn: async () => {
      const res = await api.get<TaskResponse[]>(getPath({ hotelId }).API.TASKS);
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
