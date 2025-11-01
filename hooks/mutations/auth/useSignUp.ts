import { api, useMutationWithToast } from '@lib/client';
import { getPath } from '@lib/shared';

import type { SignUpResponse, UserCreationBody } from '@/types';

export const useSignUp = () =>
  useMutationWithToast({
    mutationFn: async (data: UserCreationBody): Promise<SignUpResponse> => {
      const res = await api.post<SignUpResponse>(getPath().API.SIGNUP, data);
      return res;
    },
  });
