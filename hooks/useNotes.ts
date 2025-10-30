import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Note } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import type { NoteCollectionParams } from '@/types';

export const useNotes = ({ hotelId, taskId }: NoteCollectionParams) => {
  return useQuery<Note[] | null>({
    queryKey: [queryKeys.notes, hotelId, taskId],
    queryFn: async () => {
      const res = await api.get<Note[]>(getPath({ hotelId, taskId }).API.NOTES);
      return res;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
