import type { RoomParams } from "@/types";
import { api, ClientError, ErrorCodes, getPath, queryKeys } from "@lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";


export const useDeleteRoom = ({ hotelId, roomId }: RoomParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<null> => {
            try {
                const res = await api.delete<null>(getPath({ hotelId, roomId }).API.ROOM);
                return res.data;
            } catch (error: unknown) {
                if (isAxiosError(error) && error.response?.status === 400) {
                    throw new ClientError("room", ErrorCodes.room.DELETION.HAS_ASSIGNMENTS);
                }
                throw new ClientError("room", ErrorCodes.room.UNKNOWN, error);
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] }),
    });
}


