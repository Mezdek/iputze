import { DefaultMessages, HttpStatus } from "@constants";
import { HttpError } from "@lib";

function createErrorFactory(status: HttpStatus, code?: string) {
    return (message = DefaultMessages[status]) =>
        new HttpError(status, message, code ?? HttpStatus[status]);
}

type ErrorFactory = (msg?: string) => HttpError;

const APP_ERRORS_NAMES = [
    "badRequest",
    "conflict",
    "forbidden",
    "internalServerError",
    "methodNotAllowed",
    "notFound",
    "tooManyRequests",
    "unauthorized",
] as const

export const APP_ERRORS: Record<typeof APP_ERRORS_NAMES[number], ErrorFactory> = {
    badRequest: createErrorFactory(HttpStatus.BAD_REQUEST, "BAD_REQUEST"),
    conflict: createErrorFactory(HttpStatus.CONFLICT, "CONFLICT"),
    forbidden: createErrorFactory(HttpStatus.FORBIDDEN, "FORBIDDEN"),
    internalServerError: createErrorFactory(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"),
    methodNotAllowed: createErrorFactory(HttpStatus.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED"),
    notFound: createErrorFactory(HttpStatus.NOT_FOUND, "NOT_FOUND"),
    tooManyRequests: createErrorFactory(HttpStatus.TOO_MANY_REQUESTS, "TOO_MANY_REQUESTS"),
    unauthorized: createErrorFactory(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"),
};