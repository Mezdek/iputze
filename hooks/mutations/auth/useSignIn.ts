import type { SignInRequestBody, SignInResponse } from "@/types";
import { api, getPath } from "@lib";
import { useMutation } from "@tanstack/react-query";


export const useSignIn = () => {
    return useMutation({
        mutationFn: async (data: SignInRequestBody): Promise<SignInResponse> => {
            const res = await api.post<SignInResponse>(getPath().API.SIGNIN, data);
            return res.data;
        },
    });
}