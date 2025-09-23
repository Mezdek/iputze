import type { AssignmentCollectionParams, AssignmentCreationBody } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Assignment } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateAssignment = ({ hotelId }: AssignmentCollectionParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: AssignmentCreationBody): Promise<Assignment> => {
            const res = await api.post<Assignment>(getPath({ hotelId }).API.ASSIGNMENTS, data);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignments, hotelId] })
    });

}


