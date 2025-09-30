import type { AssignmentCollectionParams, AssignmentResponse } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useQuery } from "@tanstack/react-query";

export const useAssignments = ({ hotelId }: AssignmentCollectionParams) => {
    return useQuery<AssignmentResponse[] | null>({
        queryKey: [queryKeys.assignments, hotelId],
        queryFn: async () => {
            const res = await api.get<AssignmentResponse[]>(getPath({ hotelId }).API.ASSIGNMENTS);
            return res.data;
        },
        retry: false, // do not retry on 401
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

}