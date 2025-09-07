import { DefaultMessages, HttpStatus } from "@constants";
import { HttpError } from "./HttpError";

function createErrorFactory(status: HttpStatus, code?: string) {
    return (message = DefaultMessages[status]) =>
        new HttpError(status, message, code ?? HttpStatus[status]);
}

type ErrorFactory = (msg?: string) => HttpError;

const APP_ERRORS_NAMES = [
    "badRequest", "unauthorized", "notFound", "internalServerError", "methodNotAllowed", "forbidden", "conflict"
] as const

export const APP_ERRORS: Record<typeof APP_ERRORS_NAMES[number], ErrorFactory> = {
    badRequest: createErrorFactory(HttpStatus.BAD_REQUEST, "BAD_REQUEST"),
    unauthorized: createErrorFactory(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"),
    notFound: createErrorFactory(HttpStatus.NOT_FOUND, "NOT_FOUND"),
    internalServerError: createErrorFactory(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"),
    methodNotAllowed: createErrorFactory(HttpStatus.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED"),
    forbidden: createErrorFactory(HttpStatus.FORBIDDEN, "FORBIDDEN"),
    conflict: createErrorFactory(HttpStatus.CONFLICT, "CONFLICT"),
};