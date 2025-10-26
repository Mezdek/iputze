'use client';
//TODO add showErrorToast

import { api, useMutationWithToast } from '@lib/client';
import { getPath } from '@lib/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutationWithToast({
    mutationFn: async (): Promise<null> => {
      const res = await api.post<null>(getPath().API.SIGNOUT);
      return res;
    },
    onSuccess() {
      router.push(getPath().HOME);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Failed to sign out:', error);
    },
  });
};
