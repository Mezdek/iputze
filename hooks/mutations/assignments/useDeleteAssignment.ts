import type { AssignmentParams } from "@apptypes";
import { api, APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@lib";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteAssignment = ({ hotelId, assignmentId }: AssignmentParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<null> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.delete<null>(getPath({ hotelId, assignmentId }).API.ASSIGNMENT, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignments, hotelId] })
    });

}


