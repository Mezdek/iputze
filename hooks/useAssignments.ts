import { api, getPath, queryKeys } from '@lib';
import { useQuery } from '@tanstack/react-query';

import type { AssignmentCollectionParams, TAssignmentResponse } from '@/types';

export const useAssignments = ({ hotelId }: AssignmentCollectionParams) => {
  return useQuery<TAssignmentResponse[] | null>({
    queryKey: [queryKeys.assignments, hotelId],
    queryFn: async () => {
      const res = await api.get<TAssignmentResponse[]>(
        getPath({ hotelId }).API.ASSIGNMENTS
      );
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
