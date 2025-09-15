import { api } from "@config";
import { AuthErrors, BEARER_PREFIX, ROUTES } from "@constants";
import { APP_ERRORS } from "@lib";
import { User } from "@lib/types/hooks";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useQuery } from "@tanstack/react-query";

export const useMe = () => {
  const { accessToken } = useAccessToken();
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      if (!accessToken) throw APP_ERRORS.unauthorized(AuthErrors.INVALID_ACCESS_TOKEN);

      const res = await api.get<User>(ROUTES.API.ME, {
        headers: {
          Authorization: BEARER_PREFIX + accessToken,
        },
      });
      return res.data;
    },
    retry: false, // do not retry on 401
    enabled: !!accessToken, // only fetch if token exists
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30, // 30 minutes: unused cache is kept for 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

  });

}