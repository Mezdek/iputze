import { APP_ERRORS } from "@/lib";
import { useAccessToken } from "@/providers/AccessTokenProvider";
import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, getPath } from "@constants";
import type { CreateRoomBody } from "@lib/types";
import { Room } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateRoom = ({ hotelId }: { hotelId: number }) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateRoomBody): Promise<Room> => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.post<Room>(getPath({ hotelId }).API.ROOMS, data, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken }
            });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms", hotelId] })
    });

}


