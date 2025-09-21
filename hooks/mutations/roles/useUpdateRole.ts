import type { RoleParams, RoleUpdateBody } from "@apptypes";
import { api, APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@lib";
import { Role } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateRole = ({ hotelId, roleId }: RoleParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoleUpdateBody): Promise<Role> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.patch<Role>(getPath({ hotelId, roleId }).API.ROLE, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] })
    });

}


