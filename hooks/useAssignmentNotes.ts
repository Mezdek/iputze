import { api, getPath, queryKeys } from "@lib";
import type { AssignmentNote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import type { AssignmentNoteCollectionParams } from "@/types";

export const useAssignmentNotes = ({ hotelId, assignmentId }: AssignmentNoteCollectionParams) => {
    return useQuery<AssignmentNote[] | null>({
        queryKey: [queryKeys.assignmentNotes, hotelId, assignmentId],
        queryFn: async () => {
            const res = await api.get<AssignmentNote[]>(getPath({ hotelId, assignmentId }).API.ASSIGNMENTNOTES);
            return res;
        },
        retry: false, // do not retry on 401
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

}