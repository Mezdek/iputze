import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Note } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type { NoteCollectionParams, NoteCreationBody } from '@/types';

export const useCreateNote = ({ hotelId, taskId }: NoteCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: NoteCreationBody): Promise<Note> => {
      const res = await api.post<Note>(
        getPath({ hotelId, taskId }).API.NOTES,
        data
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      }),
  });
};
