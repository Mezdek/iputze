import type { RoomParams, RoomUpdateBody } from "@/types";
import { api, ClientError, ErrorCodes, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";


export const useUpdateRoom = ({ hotelId, roomId }: RoomParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomUpdateBody): Promise<Room> => {
            try {
                const res = await api.patch<Room>(getPath({ hotelId, roomId }).API.ROOM, data);
                return res.data;
            } catch (error: unknown) {
                if (isAxiosError(error) && error.response?.status === 409) {
                    throw new ClientError("room", ErrorCodes.room.CREATION.DUPLICATE);
                }
                throw new ClientError("room", ErrorCodes.room.UNKNOWN, error);
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });

}


