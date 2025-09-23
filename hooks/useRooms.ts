import type { RoomCollectionParams } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import type { Room } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useRooms = ({ hotelId }: RoomCollectionParams) => {
    return useQuery<Room[] | null>({
        queryKey: [queryKeys.rooms, hotelId],
        queryFn: async () => {
            const res = await api.get<Room[]>(getPath({ hotelId }).API.ROOMS);
            return res.data;
        },
        retry: false, // do not retry on 401
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}