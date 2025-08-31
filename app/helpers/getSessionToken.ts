import { CustomErrorMessages } from "@constants/httpResponses";
import { SESSION_COOKIE_NAMES } from "@constants/session";
import { APP_ERRORS } from "@lib/errors/factories";
import { cookies } from "next/headers";

/**
 * Reads the NextAuth session cookie asynchronously and returns the token.
 * Throws a forbidden error if no session is found.
 */
export const getSessionToken = async (): Promise<string> => {
    const store = await cookies();

    for (const name of SESSION_COOKIE_NAMES) {
        const cookie = store.get(name);
        if (cookie?.value) return cookie.value;
    }

    throw APP_ERRORS.forbidden(CustomErrorMessages.NO_SESSION);
};
