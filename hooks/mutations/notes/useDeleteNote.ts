import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { NoteCollectionParams } from '@/types';

export const useDeleteNote = ({ hotelId, taskId }: NoteCollectionParams) => {
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
        queryKey: queryKeys.taskNotes(hotelId, taskId),
      }),
  });
};
