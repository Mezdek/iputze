import { api, useMutationWithToast } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import type { Role } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import type { RoleCollectionParams } from '@/types';

export const useCreateRole = ({ hotelId }: RoleCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (): Promise<Role> => {
      const res = await api.post<Role>(getPath({ hotelId }).API.ROLES);
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.me] }),
  });
};
