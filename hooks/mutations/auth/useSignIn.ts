import { api, useMutationWithToast } from '@lib/client';
import { getPath } from '@lib/shared';

import type { SignInRequestBody, SignInResponse } from '@/types';

export const useSignIn = () => {
  return useMutationWithToast({
    mutationFn: async (data: SignInRequestBody): Promise<SignInResponse> => {
      const res = await api.post<SignInResponse>(getPath().API.SIGNIN, data);
      return res;
    },
  });
};
