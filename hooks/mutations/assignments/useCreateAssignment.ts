import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Assignment } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type {
  AssignmentCollectionParams,
  AssignmentCreationBody,
} from '@/types';

export const useCreateAssignment = ({
  hotelId,
}: AssignmentCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: AssignmentCreationBody): Promise<Assignment> => {
      const res = await api.post<Assignment>(
        getPath({ hotelId }).API.ASSIGNMENTS,
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
