import { api } from "@config";
import { getPath } from "@constants";
import type { SignUpRequestBody, SignUpResponse } from "@lib/types/api";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () =>
    useMutation({
        mutationFn: async (data: SignUpRequestBody): Promise<SignUpResponse> => {
            const res = await api.post<SignUpResponse>(getPath().API.SIGNUP, data);
            return res.data;
        },
    });
