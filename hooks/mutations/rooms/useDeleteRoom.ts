import type { RoomParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteRoom = ({ hotelId, roomId }: RoomParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<null> => {
            const res = await api.delete<null>(getPath({ hotelId, roomId }).API.ROOM);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });
}


