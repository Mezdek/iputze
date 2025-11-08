import { addToast } from '@heroui/react';
import { useUploadImage } from '@hooks';
import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/shared/constants/querries';

export function useBatchUploadImage(params: {
  hotelId: string;
  taskId: string;
}) {
  const { mutateAsync: uploadImage, isPending } = useUploadImage(params);
  const queryClient = useQueryClient();
  const { hotelId, taskId } = params;
  return {
    batchUpload: async (files: File[]) => {
      const results = await Promise.allSettled(
        files.map((file) => uploadImage(file))
      );
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (successful > 0) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.taskImages(hotelId, taskId),
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
