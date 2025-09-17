import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath } from "@constants";
import { APP_ERRORS } from "@lib";
import { Room } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteRoom = ({ hotelId, roomId }: { hotelId: number, roomId: number }) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (): Promise<Room> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.delete<Room>(getPath({ hotelId, roomId }).API.ROOM, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms", hotelId] })
    });

}


