import { api } from "@config";
import { ROUTES } from "@constants";
import type { SignInRequestBody, SignInResponse } from "@lib/types/api";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation } from "@tanstack/react-query";


export const useSignIn = () => {
    const { setAccessToken } = useAccessToken();
    return useMutation({
        mutationFn: async (data: SignInRequestBody): Promise<SignInResponse> => {
            const res = await api.post<SignInResponse>(ROUTES.API.SIGNIN, data);
            setAccessToken(res.data.accessToken);
            return res.data;
        },
    });

}