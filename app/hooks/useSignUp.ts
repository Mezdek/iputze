import { api } from "@config";
import { ROUTES } from "@constants";
import { SignUpInput, User } from "@lib/types/hooks";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () =>
    useMutation({
        mutationFn: async (data: SignUpInput) => {
            const res = await api.post<User>(ROUTES.API.SIGNUP, data);
            return res.data;
        },
    });
