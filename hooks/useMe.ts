import type { MeResponse } from "@/types";
import { api, getPath, queryKeys } from "@lib";
import { useQuery } from "@tanstack/react-query";

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: [queryKeys.me],
    queryFn: async () => {
      const res = await api.get<MeResponse>(getPath().API.ME);
      return res.data;
    },
    retry: false, // do not retry on 401
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

  });

}



