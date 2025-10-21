import { handleError } from '@lib';

export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err) {
      return handleError(err) as Awaited<ReturnType<T>>;
    }
  };
}
