// lib/client/hooks/useMutationWithToast.ts - CREATE:
import { addToast } from '@heroui/react';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { ApiError } from '@/types';

export function useMutationWithToast<TData, TVariables>(
  options: UseMutationOptions<TData, ApiError, TVariables> & {
    successTitle?: string;
    successDescription?: string;
    errorTitle?: string;
  }
) {
  return useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options.successTitle) {
        addToast({
          title: options.successTitle,
          description: options.successDescription || 'Operation successful',
          color: 'success',
        });
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      addToast({
        title: options.errorTitle || 'Error',
        description: error.message || 'Operation failed',
        color: 'danger',
      });
      options.onError?.(error, variables, context);
    },
  });
}
