import type { RoomCollectionParams, RoomCreationBody } from "@apptypes";
import { api, APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateRoom = ({ hotelId }: RoomCollectionParams) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: RoomCreationBody): Promise<Room> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.post<Room>(getPath({ hotelId }).API.ROOMS, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.rooms, hotelId] })
    });

}


