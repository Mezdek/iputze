import { api } from "@config";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX, ROUTES } from "@constants";
import { APP_ERRORS } from "@lib";
import { Room } from "@prisma/client";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useQuery } from "@tanstack/react-query";

export const useRooms = ({ hotelId }: { hotelId: number }) => {
    const { accessToken } = useAccessToken();
    return useQuery<Room[] | null>({
        queryKey: ["rooms", hotelId],
        queryFn: async () => {
            if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);
            const res = await api.get<Room[]>(ROUTES.API.HOTELS, {
                headers: { [AUTH_HEADER]: BEARER_PREFIX + accessToken },
            });
            return res.data;
        },
        retry: false, // do not retry on 401
        enabled: !!accessToken, // only fetch if token exists
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

    });

}