import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys, STALE_TIME } from '@/lib/shared/constants/querries';
import type { TaskCollectionParams, TaskResponse } from '@/types';

export const useTasks = ({ hotelId }: TaskCollectionParams) => {
  return useQuery<TaskResponse[] | null>({
    queryKey: queryKeys.tasks(hotelId),
    queryFn: async () => {
      const res = await api.get<TaskResponse[]>(getPath({ hotelId }).API.TASKS);
      return res;
    },
    staleTime: STALE_TIME.FREQUENT,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
