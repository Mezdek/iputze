import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/client/api/client';
import { getPath } from '@/lib/shared/constants/pathes';
import { queryKeys } from '@/lib/shared/constants/querries';
import type { ImageResponse } from '@/types';

export function useUploadImage(params: { hotelId: string; taskId: string }) {
  const { hotelId, taskId } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<ImageResponse> => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post<ImageResponse>(
        getPath({ hotelId, taskId }).API.IMAGES,
        formData
      );
      return res;
    },
    onSuccess: async () => {
      addToast({
        title: 'Image uploaded!',
        description: 'Image uploaded successfully',
        color: 'success',
      });

      // Invalidate tasks list to update image counts
      await queryClient.invalidateQueries({
        queryKey: queryKeys.taskImages(hotelId, taskId),
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
