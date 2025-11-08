import { useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { useMutationWithToast } from '@/lib/client/utils/useMutationWithToast';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { RoleParams } from '@/types';

export const useDeleteRole = ({ hotelId, roleId }: RoleParams) => {
  const queryClient = useQueryClient();
  return useMutationWithToast({
    mutationFn: async (): Promise<null> => {
      const res = await api.delete<null>(getPath({ hotelId, roleId }).API.ROLE);
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.roles, hotelId] }),
  });
};
