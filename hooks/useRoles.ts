import type { EnhancedRole, RoleCollectionParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useQuery } from "@tanstack/react-query";

export const useRoles = ({ hotelId }: RoleCollectionParams) => {
    return useQuery<EnhancedRole[] | null>({
        queryKey: [queryKeys.roles, hotelId],
        queryFn: async () => {
            const res = await api.get<EnhancedRole[]>(getPath({ hotelId }).API.ROLES);
            return res.data;
        },
        retry: false, // do not retry on 401
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

}