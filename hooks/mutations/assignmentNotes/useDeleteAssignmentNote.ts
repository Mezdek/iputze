import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AssignmentNoteParams } from '@/types';

export const useDeleteAssignmentNote = ({
  hotelId,
  assignmentId,
}: Partial<AssignmentNoteParams>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignmentNoteId,
    }: {
      assignmentNoteId: string;
    }): Promise<null> => {
      const res = await api.delete<null>(
        getPath({ hotelId, assignmentId, assignmentNoteId }).API.ASSIGNMENTNOTE
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.assignmentNotes, hotelId, assignmentId],
      }),
  });
};
