import type { SignUpRequestBody, SignUpResponse } from "@/types";
import { api, getPath } from "@lib";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () =>
    useMutation({
        mutationFn: async (data: SignUpRequestBody): Promise<SignUpResponse> => {
            const res = await api.post<SignUpResponse>(getPath().API.SIGNUP, data);
            return res.data;
        },
    });
