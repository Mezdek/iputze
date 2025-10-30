import { addToast } from '@heroui/react';
import { useUploadImage } from '@hooks';
import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/shared';

export function useBatchUploadImage(params: {
  hotelId: string;
  taskId: string;
}) {
  const { mutateAsync: uploadImage, isPending } = useUploadImage(params);
  const queryClient = useQueryClient();

  return {
    batchUpload: async (files: File[]) => {
      const results = await Promise.allSettled(
        files.map((file) => uploadImage(file))
      );
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (successful > 0) {
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.tasks, params.hotelId],
        });
        addToast({
          title: 'Upload complete',
          description: `${successful} image(s) uploaded successfully${failed > 0 ? `, ${failed} failed` : ''}`,
          color: failed > 0 ? 'warning' : 'success',
        });
      }
      return results;
    },
    isLoading: isPending,
  };
}

// const queryClient = useQueryClient();

// return useMutation({
//   mutationFn: async (file: File): Promise<ImageResponse> => {
//     const res = await api.post<ImageResponse>(
//       getPath({ hotelId, taskId }).API.IMAGES,
//       file
//     );
//     return res;
//   },
//   onSuccess: (newImage) => {
//     // Update the images cache
//     queryClient.setQueryData<ImageResponse[]>(
//       [queryKeys.images, hotelId, taskId],
//       (old) => {
//         return old ? [...old, newImage] : [newImage];
//       }
//     );
//     addToast({
//       title: 'Image uploaded!',
//       description: 'Image uploaded successfully',
//       color: 'success',
//     });

//     // Invalidate tasks list to update image counts
//     return queryClient.invalidateQueries({
//       queryKey: [queryKeys.images, hotelId, taskId],
//     });
//   },

//   onError: (error: Error) => {
//     addToast({
//       title: 'Upload failed',
//       description: error.message || 'Failed to upload image',
//       color: 'danger',
//     });
//   },
// });
