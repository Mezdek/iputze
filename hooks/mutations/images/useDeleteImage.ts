import { addToast } from '@heroui/react';
import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ImageResponse } from '@/types';

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

    onSuccess: (_, deletedImageId) => {
      // Update the images cache
      queryClient.setQueryData<ImageResponse[]>(
        [queryKeys.images, hotelId, taskId],
        (old) => (old ? old.filter((img) => img.id !== deletedImageId) : [])
      );

      addToast({
        title: 'Image deleted!',
        description: 'Image deleted successfully',
        color: 'success',
      });
      // Invalidate tasks list to update image counts
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
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
