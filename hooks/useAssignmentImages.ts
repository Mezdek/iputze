// React Query hooks for assignment images
// Handles fetching, uploading, and deleting images

import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AssignmentImageResponse } from '@/types';

// ==================== Query Keys ====================

export const assignmentImageKeys = {
  all: ['assignment-images'] as const,
  byAssignment: (assignmentId: string) =>
    [...assignmentImageKeys.all, assignmentId] as const,
  detail: (imageId: string) =>
    [...assignmentImageKeys.all, 'detail', imageId] as const,
};

// ==================== API Functions ====================

/**
 * Fetch images for an assignment
 */
async function fetchAssignmentImages(params: {
  hotelId: string;
  assignmentId: string;
}): Promise<AssignmentImageResponse[]> {
  const { hotelId, assignmentId } = params;

  const response = await fetch(
    `/api/v1/hotels/${hotelId}/assignments/${assignmentId}/images`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

/**
 * Upload image to assignment
 */
async function uploadAssignmentImage(params: {
  hotelId: string;
  assignmentId: string;
  file: File;
}): Promise<AssignmentImageResponse> {
  const { hotelId, assignmentId, file } = params;

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `/api/v1/hotels/${hotelId}/assignments/${assignmentId}/images`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }

  return response.json();
}

/**
 * Delete image from assignment
 */
async function deleteAssignmentImage(params: {
  hotelId: string;
  assignmentId: string;
  imageId: string;
}): Promise<void> {
  const { hotelId, assignmentId, imageId } = params;

  const response = await fetch(
    `/api/v1/hotels/${hotelId}/assignments/${assignmentId}/images/${imageId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
}

// ==================== Hooks ====================

/**
 * Hook to fetch assignment images
 */
export function useAssignmentImages(params: {
  hotelId: string;
  assignmentId: string;
  enabled?: boolean;
}) {
  const { hotelId, assignmentId, enabled = true } = params;

  return useQuery({
    queryKey: assignmentImageKeys.byAssignment(assignmentId),
    queryFn: () => fetchAssignmentImages({ hotelId, assignmentId }),
    enabled: enabled && !!hotelId && !!assignmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to upload assignment image
 */
export function useUploadAssignmentImage(params: {
  hotelId: string;
  assignmentId: string;
}) {
  const { hotelId, assignmentId } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      uploadAssignmentImage({ hotelId, assignmentId, file }),

    onSuccess: (newImage) => {
      // Update the images cache
      queryClient.setQueryData<AssignmentImageResponse[]>(
        assignmentImageKeys.byAssignment(assignmentId),
        (old) => (old ? [...old, newImage] : [newImage])
      );

      // Invalidate assignments list to update image counts
      queryClient.invalidateQueries({
        queryKey: ['assignments', hotelId],
      });

      addToast({
        title: 'Image uploaded!',
        description: 'Image uploaded successfully',
        color: 'success',
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

/**
 * Hook to delete assignment image
 */
export function useDeleteAssignmentImage(params: {
  hotelId: string;
  assignmentId: string;
}) {
  const { hotelId, assignmentId } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      deleteAssignmentImage({ hotelId, assignmentId, imageId }),

    onSuccess: (_, deletedImageId) => {
      // Update the images cache
      queryClient.setQueryData<AssignmentImageResponse[]>(
        assignmentImageKeys.byAssignment(assignmentId),
        (old) => (old ? old.filter((img) => img.id !== deletedImageId) : [])
      );

      // Invalidate assignments list to update image counts
      queryClient.invalidateQueries({
        queryKey: ['assignments', hotelId],
      });

      addToast({
        title: 'Image deleted!',
        description: 'Image deleted successfully',
        color: 'success',
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

// ==================== Assignment Hook Enhancement ====================

/**
 * Hook to fetch assignments with images included
 * This enhances the existing useAssignments hook
 */
export function useAssignmentsWithMedia(params: {
  hotelId: string;
  includeImages?: boolean;
}) {
  const { hotelId, includeImages = true } = params;

  return useQuery({
    queryKey: ['assignments', hotelId, { includeImages }],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/hotels/${hotelId}/assignments?includeImages=${includeImages}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==================== Prefetch Utilities ====================

/**
 * Prefetch images for an assignment
 * Useful for hover previews
 */
export function usePrefetchAssignmentImages() {
  const queryClient = useQueryClient();

  return (params: { hotelId: string; assignmentId: string }) => {
    queryClient.prefetchQuery({
      queryKey: assignmentImageKeys.byAssignment(params.assignmentId),
      queryFn: () => fetchAssignmentImages(params),
      staleTime: 2 * 60 * 1000,
    });
  };
}

// ==================== Batch Operations ====================

/**
 * Hook to upload multiple images at once
 */
export function useUploadMultipleImages(params: {
  hotelId: string;
  assignmentId: string;
}) {
  const uploadMutation = useUploadAssignmentImage(params);

  return {
    uploadMultiple: async (files: File[]) => {
      const results = await Promise.allSettled(
        files.map((file) => uploadMutation.mutateAsync(file))
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (successful > 0) {
        addToast({
          title: 'Upload complete',
          description: `${successful} image(s) uploaded successfully${failed > 0 ? `, ${failed} failed` : ''}`,
          color: failed > 0 ? 'warning' : 'success',
        });
      }

      return results;
    },
    isLoading: uploadMutation.isPending,
  };
}
