import { api, getPath } from '@lib';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { Locale } from '@/i18n';

export const useSetLocale = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { locale: Locale }): Promise<null> => {
      const res = await api.post<null>(getPath().API.LOCALE, data);
      return res;
    },
    onSuccess: () => router.refresh(),
  });
};
