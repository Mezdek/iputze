import { AuthErrors, GeneralErrors, PrismaErrors } from "@/lib/constants";
import { Prisma } from "@prisma/client";
import { APP_ERRORS } from "./factories";
import { HttpError } from "./HttpError";
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";

/**
 * Centralized error handler for API routes.
 * Converts known error types into consistent HttpError responses.
 */
export function handleError(error: unknown) {
    // 1. Known Prisma errors (constraint violations, missing records, etc.)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": // Unique constraint failed
                return APP_ERRORS.conflict(PrismaErrors.P2002).nextResponse();
            case "P2025": // Record not found
                return APP_ERRORS.notFound(PrismaErrors.P2025).nextResponse();
            case "P2003": // Foreign key violation
                return APP_ERRORS.badRequest(PrismaErrors.P2003).nextResponse();
            default: // Any other known Prisma error
                return APP_ERRORS.internalServerError(PrismaErrors.DEFAULT).nextResponse();
        }
    }

    // 2. Prisma validation errors (invalid input/query shape)
    if (error instanceof Prisma.PrismaClientValidationError) {
        return APP_ERRORS.badRequest(PrismaErrors.CLIENT_VALIDATION).nextResponse();
    }

    // 3. JSON parsing errors (invalid/malformed request body)
    if (error instanceof SyntaxError && /JSON/.test(error.message)) {
        return APP_ERRORS.badRequest(GeneralErrors.INVALID_JSON).nextResponse();
    }

    // 4. Custom application errors (already wrapped as HttpError)
    if (error instanceof HttpError) {
        return error.nextResponse();
    }

    if (error instanceof TokenExpiredError) {
        return APP_ERRORS.unauthorized(AuthErrors.SESSION_EXPIRED).nextResponse();
    }

    if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
        return APP_ERRORS.unauthorized().nextResponse();
    }

    // 5. Fallback for unhandled/unknown errors
    console.error(GeneralErrors.UNHANDLED_ERROR, error);
    return APP_ERRORS.internalServerError(GeneralErrors.UNEXPECTED_SERVER_ERROR).nextResponse();
}
