import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Assignment } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type { AssignmentParams, AssignmentUpdateBody } from '@/types';

export const useUpdateAssignment = ({
  hotelId,
  assignmentId,
}: AssignmentParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: AssignmentUpdateBody): Promise<Assignment> => {
      const res = await api.patch<Assignment>(
        getPath({ hotelId, assignmentId }).API.ASSIGNMENT,
        data
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.assignments, hotelId],
      }),
  });
};
