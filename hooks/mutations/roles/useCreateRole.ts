import type { Role } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { RoleCollectionParams } from '@/types';

export const useCreateRole = ({ hotelId }: RoleCollectionParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<Role> => {
      const res = await api.post<Role>(getPath({ hotelId }).API.ROLES);
      return res;
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: queryKeys.me,
      }),
  });
};
