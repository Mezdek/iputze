import type { RoomParams, RoomUpdateBody } from "@apptypes";
import { api, APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateRoom = ({ hotelId, roomId }: RoomParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomUpdateBody): Promise<Room> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.patch<Room>(getPath({ hotelId, roomId }).API.ROOM, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });

}


