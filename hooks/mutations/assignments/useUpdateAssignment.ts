import type { AssignmentParams, AssignmentUpdateBody } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Assignment } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateAssignment = ({ hotelId, assignmentId }: AssignmentParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: AssignmentUpdateBody): Promise<Assignment> => {
            const res = await api.patch<Assignment>(getPath({ hotelId, assignmentId }).API.ASSIGNMENT, data);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.assignments, hotelId] })
    });

}


