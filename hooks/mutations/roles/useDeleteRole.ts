import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { RoleParams } from '@/types';

export const useDeleteRole = ({ hotelId, roleId }: RoleParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<null> => {
      const res = await api.delete<null>(getPath({ hotelId, roleId }).API.ROLE);
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] }),
  });
};
