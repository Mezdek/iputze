import { RoleParams } from "@/lib/types";
import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@constants";
import { APP_ERRORS } from "@errors";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteRole = ({ hotelId, roleId }: RoleParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<null> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.delete<null>(getPath({ hotelId, roleId }).API.ROLE, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] })
    });

}


