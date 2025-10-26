import { api, useMutationWithToast } from '@lib/client';
import { getPath } from '@lib/shared';

import type { SignUpRequestBody, SignUpResponse } from '@/types';

export const useSignUp = () =>
  useMutationWithToast({
    mutationFn: async (data: SignUpRequestBody): Promise<SignUpResponse> => {
      const res = await api.post<SignUpResponse>(getPath().API.SIGNUP, data);
      return res;
    },
  });
