import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type {
  NoteCollectionParams,
  NoteCreationBody,
  NoteWithAuthor,
} from '@/types';

export const useCreateNote = ({ hotelId, taskId }: NoteCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: NoteCreationBody): Promise<NoteWithAuthor> => {
      const res = await api.post<NoteWithAuthor>(
        getPath({ hotelId, taskId }).API.NOTES,
        data
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskNotes(hotelId, taskId),
      }),
  });
};
