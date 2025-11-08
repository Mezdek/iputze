'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
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
