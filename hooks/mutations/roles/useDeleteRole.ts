import type { RoleParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteRole = ({ hotelId, roleId }: RoleParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<null> => {
            const res = await api.delete<null>(getPath({ hotelId, roleId }).API.ROLE);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] })
    });

}


