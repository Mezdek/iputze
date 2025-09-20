import { AssignmentNoteCollectionParams, AssignmentNoteCreationBody } from "@apptypes";
import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@constants";
import { APP_ERRORS } from "@errors";
import type { AssignmentNote } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateAssignmentNote = ({ hotelId, assignmentId }: AssignmentNoteCollectionParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: AssignmentNoteCreationBody): Promise<AssignmentNote> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.post<AssignmentNote>(getPath({ hotelId, assignmentId }).API.ASSIGNMENTNOTES, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignmentNotes, hotelId, assignmentId] })
    });

}


