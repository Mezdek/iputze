import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import type { SignUpResponse, UserCreationBody } from '@/types';

export const useSignUp = () =>
  useMutationWithToast({
    mutationFn: async (data: UserCreationBody): Promise<SignUpResponse> => {
      const res = await api.post<SignUpResponse>(getPath().API.SIGNUP, data);
      return res;
    },
  });
