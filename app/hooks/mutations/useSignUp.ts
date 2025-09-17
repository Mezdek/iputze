import { api } from "@config";
import { getPath } from "@constants";
import type { SignUpRequestBody, User } from "@lib/types/api";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () =>
    useMutation({
        mutationFn: async (data: SignUpRequestBody) => {
            const res = await api.post<User>(getPath().API.SIGNUP, data);
            return res.data;
        },
    });
