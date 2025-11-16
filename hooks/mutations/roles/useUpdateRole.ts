import type { Role } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { RoleParams, RoleUpdateBody } from '@/types';

export const useUpdateRole = ({ hotelId, roleId }: RoleParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (data: RoleUpdateBody): Promise<Role> => {
      const res = await api.patch<Role>(
        getPath({ hotelId, roleId }).API.ROLE,
        data
      );
      return res;
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: queryKeys.roles(hotelId),
      }),
  });
};
