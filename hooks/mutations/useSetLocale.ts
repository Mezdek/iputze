import { useRouter } from 'next/navigation';

import type { Locale } from '@/i18n';
import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';

export const useSetLocale = () => {
  const router = useRouter();
  return useMutationWithToast({
    mutationFn: async (data: { locale: Locale }): Promise<null> => {
      const res = await api.post<null>(getPath().API.LOCALE, data);
      return res;
    },
    onSuccess: () => router.refresh(),
  });
};
