import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { NoteCollectionParams, NoteWithAuthor } from '@/types';

export const useNotes = ({ hotelId, taskId }: NoteCollectionParams) => {
  return useQuery<NoteWithAuthor[] | null>({
    queryKey: queryKeys.taskNotes(hotelId, taskId),
    queryFn: async () => {
      const res = await api.get<NoteWithAuthor[]>(
        getPath({ hotelId, taskId }).API.NOTES
      );
      return res;
    },
  });
};
