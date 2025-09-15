import { api } from "@config";
import { ROUTES } from "@constants";
import { SignInInput, SignInResponse } from "@lib/types/hooks";
import { useAccessToken } from "@providers/AccessTokenProvider";
import { useMutation } from "@tanstack/react-query";


export const useSignIn = () => {
    const { setAccessToken } = useAccessToken();
    return useMutation({
        mutationFn: async (data: SignInInput): Promise<SignInResponse> => {
            const res = await api.post<SignInResponse>(ROUTES.API.SIGNIN, data);
            setAccessToken(res.data.accessToken);
            return res.data;
        },
    });

}