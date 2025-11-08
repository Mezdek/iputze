import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';

export function useDeleteImage(params: { hotelId: string; taskId: string }) {
  const { hotelId, taskId } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string): Promise<null> => {
      const res = await api.delete<null>(
        getPath({ hotelId, taskId, imageId }).API.IMAGE
      );
      return res;
    },

    onSuccess: () => {
      addToast({
        title: 'Image deleted!',
        description: 'Image deleted successfully',
        color: 'success',
      });
      // Invalidate tasks list to update image counts
      return queryClient.invalidateQueries({
        queryKey: queryKeys.taskImages(hotelId, taskId),
      });
    },

    onError: (error: Error) => {
      addToast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete image',
        color: 'danger',
      });
    },
  });
}
