import { APP_ERRORS, AuthErrors } from '@lib';

/**
 * Parses a string ID into a number.
 * Throws a HTTP 400 error if the input is not a valid number.
 *
 * @param {string} id - The ID to parse.
 * @param {string} [errorMessage] - Optional custom error message.
 * @returns {number} The parsed numeric ID.
 * @throws {import("@lib/errors/HttpError").HttpError} If the ID is not a valid number.
 */
export const parseId = (id: string, errorMessage?: string): number => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId)) {
    throw APP_ERRORS.badRequest(errorMessage ?? AuthErrors.INVALID_ID);
  }

  return parsedId;
};
