import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useQueryClient } from '@tanstack/react-query';

import type { NoteParams } from '@/types';

export const useDeleteNote = ({ hotelId, taskId }: Partial<NoteParams>) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async ({ noteId }: { noteId: string }): Promise<null> => {
      const res = await api.delete<null>(
        getPath({ hotelId, taskId, noteId }).API.NOTE
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      }),
  });
};
