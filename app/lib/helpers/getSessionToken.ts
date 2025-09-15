import { AUTH_HEADER, BEARER_PREFIX, SESSION_COOKIE_NAMES } from "@/lib/constants";
import { APP_ERRORS } from "@lib";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * Retrieves the session token either from cookies or from the Authorization header.
 * This allows API testing in Postman or other clients without cookies.
 */
export const getSessionToken = async (req?: NextRequest): Promise<string> => {
    // Check Authorization header first if request is provided
    if (req) {
        const authHeader = req.headers.get(AUTH_HEADER);
        if (authHeader?.startsWith(BEARER_PREFIX)) {
            return authHeader.slice(7); // strip 'Bearer '
        }
    }

    // Check cookies
    const store = await cookies();
    for (const name of SESSION_COOKIE_NAMES) {
        const cookie = store.get(name);
        if (cookie?.value) return cookie.value;
    }

    throw APP_ERRORS.forbidden();
};
