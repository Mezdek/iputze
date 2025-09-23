import type { RoomCollectionParams, RoomCreationBody } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateRoom = ({ hotelId }: RoomCollectionParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomCreationBody): Promise<Room> => {
            const res = await api.post<Room>(getPath({ hotelId }).API.ROOMS, data);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });

}


