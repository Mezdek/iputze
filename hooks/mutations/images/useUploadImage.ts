import { addToast } from '@heroui/react';
import { api } from '@lib/client';
import { getPath, queryKeys } from '@lib/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ImageResponse } from '@/types';

export function useUploadImage(params: { hotelId: string; taskId: string }) {
  const { hotelId, taskId } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<ImageResponse> => {
      const res = await api.post<ImageResponse>(
        getPath({ hotelId, taskId }).API.IMAGES,
        file
      );
      return res;
    },
    onSuccess: (newImage) => {
      // Update the images cache
      queryClient.setQueryData<ImageResponse[]>(
        [queryKeys.images, hotelId, taskId],
        (old) => {
          return old ? [...old, newImage] : [newImage];
        }
      );
      addToast({
        title: 'Image uploaded!',
        description: 'Image uploaded successfully',
        color: 'success',
      });

      // Invalidate tasks list to update image counts
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, hotelId],
      });
    },

    onError: (error: Error) => {
      addToast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        color: 'danger',
      });
    },
  });
}
