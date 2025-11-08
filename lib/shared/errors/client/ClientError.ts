import type { ErrorCodes } from '@/lib/shared/errors/client/errorCodes';
import type { LeafValues } from '@/types';

export type ErrorCodeMap<T> = {
  [K in keyof T]: LeafValues<T[K]>;
};

export type ErrorCodeByContext = ErrorCodeMap<typeof ErrorCodes>;

export type Context = keyof ErrorCodeByContext;

/**
 * Represents a client-side error with context and code.
 *
 * @class
 */

export class ClientError extends Error {
  /**
   * The context in which the error occurred.
   */
  readonly context: Context;

  /**
   * The specific error code for the context.
   */
  readonly code: ErrorCodeByContext[Context];

  /**
   * The original error object, if any.
   */
  originalError?: unknown;

  /**
   * Constructs a new ClientError.
   *
   * @param context - The context of the error.
   * @param code - The error code for the context.
   * @param originalError - The original error, if available.
   * @param message - Optional custom error message.
   */
  constructor(
    context: Context,
    code: ErrorCodeByContext[Context],
    originalError?: unknown,
    message?: string
  ) {
    super(message ?? code);
    this.name = 'ClientError';
    this.context = context;
    this.code = code;
    this.originalError = originalError;

    Object.setPrototypeOf(this, ClientError.prototype);
  }
}
