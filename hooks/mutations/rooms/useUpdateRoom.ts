import type { RoomParams, RoomUpdateBody } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateRoom = ({ hotelId, roomId }: RoomParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomUpdateBody): Promise<Room> => {
            const res = await api.patch<Room>(getPath({ hotelId, roomId }).API.ROOM, data);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });

}


