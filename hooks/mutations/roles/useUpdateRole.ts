import { api, getPath, queryKeys } from '@lib';
import type { Role } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { RoleParams, RoleUpdateBody } from '@/types';

export const useUpdateRole = ({ hotelId, roleId }: RoleParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RoleUpdateBody): Promise<Role> => {
      const res = await api.patch<Role>(
        getPath({ hotelId, roleId }).API.ROLE,
        data
      );
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] }),
  });
};
