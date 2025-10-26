import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQueryClient } from '@tanstack/react-query';

import type { AssignmentParams } from '@/types';

export const useDeleteAssignment = ({
  hotelId,
  assignmentId,
}: AssignmentParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (): Promise<null> => {
      const res = await api.delete<null>(
        getPath({ hotelId, assignmentId }).API.ASSIGNMENT
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.assignments, hotelId],
      }),
  });
};
