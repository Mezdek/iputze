import type { RoleCollectionParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Role } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateRole = ({ hotelId }: RoleCollectionParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<Role> => {
            const res = await api.post<Role>(getPath({ hotelId }).API.ROLES);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.me] })
    });

}


