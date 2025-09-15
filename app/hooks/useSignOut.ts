'use client'
import { api } from "@config";
import { ROUTES } from "@constants";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useSignOut = () => {
    const { setAccessToken } = useAccessToken();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post(ROUTES.API.SIGNOUT);
            setAccessToken(null); // clear memory token
            queryClient.clear(); // invalidate all queries
        },
    });
};

