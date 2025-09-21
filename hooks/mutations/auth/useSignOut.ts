'use client'
import { api, getPath } from "@lib";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useSignOut = () => {
    const { setAccessToken } = useAccessToken();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (): Promise<null> => {
            const res = await api.post<null>(getPath().API.SIGNOUT);
            setAccessToken(null); // clear memory token
            queryClient.clear(); // invalidate all queries
            return res.data
        },
    });
};

