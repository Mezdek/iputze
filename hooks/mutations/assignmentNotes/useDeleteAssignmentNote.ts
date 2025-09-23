import type { AssignmentNoteParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteAssignmentNote = ({ hotelId, assignmentId }: Partial<AssignmentNoteParams>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ assignmentNoteId }: { assignmentNoteId: string }): Promise<null> => {
            const res = await api.delete<null>(getPath({ hotelId, assignmentId, assignmentNoteId }).API.ASSIGNMENTNOTE);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignmentNotes, hotelId, assignmentId] })
    });

}


