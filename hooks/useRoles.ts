import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { RoleCollectionParams, TRoleWithUser } from '@/types';

export const useRoles = ({ hotelId }: RoleCollectionParams) => {
  return useQuery<TRoleWithUser[] | null>({
    queryKey: queryKeys.roles(hotelId),
    queryFn: async () => {
      const res = await api.get<TRoleWithUser[]>(
        getPath({ hotelId }).API.ROLES
      );
      return res;
    },
  });
};
