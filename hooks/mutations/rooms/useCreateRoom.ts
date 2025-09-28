import type { RoomCollectionParams, RoomCreationBody } from "@/types";
import { api, ClientError, ErrorCodes, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";


export const useCreateRoom = ({ hotelId }: RoomCollectionParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomCreationBody): Promise<Room> => {
            try {
                const res = await api.post<Room>(getPath({ hotelId }).API.ROOMS, data);
                return res.data;
            } catch (error: unknown) {
                if (isAxiosError(error) && error.response?.status === 400) {
                    throw new ClientError("room", ErrorCodes.room.CREATION.DUPLICATE);
                }
                throw new ClientError("room", ErrorCodes.room.UNKNOWN, error);
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] }),
    });

}


