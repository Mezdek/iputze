import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import type { SignInRequestBody, SignInResponse } from '@/types';

export const useSignIn = () => {
  return useMutationWithToast({
    mutationFn: async (data: SignInRequestBody): Promise<SignInResponse> => {
      const res = await api.post<SignInResponse>(getPath().API.SIGNIN, data);
      return res;
    },
  });
};
