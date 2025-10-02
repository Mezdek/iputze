import { api, getPath, queryKeys } from "@lib";
import type { AssignmentNote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AssignmentNoteCollectionParams, AssignmentNoteCreationBody } from "@/types";


export const useCreateAssignmentNote = ({ hotelId, assignmentId }: AssignmentNoteCollectionParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: AssignmentNoteCreationBody): Promise<AssignmentNote> => {
            const res = await api.post<AssignmentNote>(getPath({ hotelId, assignmentId }).API.ASSIGNMENTNOTES, data);
            return res;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignmentNotes, hotelId, assignmentId] })
    });

}