'use client'
//TODO add showErrorToast
import { api, getPath } from "@lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export const useSignOut = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (): Promise<null> => {
            const res = await api.post<null>(getPath().API.SIGNOUT);
            return res.data
        },
        onSuccess() {
            router.push(getPath().HOME);
            queryClient.clear();
        },
        onError: (error) => {
            console.error("Failed to sign out:", error);
        },
    });
};

