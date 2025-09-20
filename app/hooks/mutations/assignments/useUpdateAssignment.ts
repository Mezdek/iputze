import type { AssignmentParams, AssignmentUpdateBody } from "@apptypes";
import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@constants";
import { APP_ERRORS } from "@errors";
import { Assignment } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateAssignment = ({ hotelId, assignmentId }: AssignmentParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: AssignmentUpdateBody): Promise<Assignment> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.patch<Assignment>(getPath({ hotelId, assignmentId }).API.ASSIGNMENT, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignments, hotelId] })
    });

}


