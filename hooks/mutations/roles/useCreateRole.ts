import type { RoleCollectionParams } from "@apptypes";
import { api, APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@lib";
import type { Role } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateRole = ({ hotelId }: RoleCollectionParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<Role> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.post<Role>(getPath({ hotelId }).API.ROLES, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] })
    });

}


