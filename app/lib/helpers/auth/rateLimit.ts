import { AuthErrors } from "@constants";
import { APP_ERRORS } from "@errors";

type RateLimitEntry = number[];

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Checks whether a given identifier can perform an action based on rate limits.
 *
 * @param identifier - Unique key for rate limiting (e.g., IP or userId).
 * @param limit - Maximum allowed requests within the time window.
 * @param windowMs - Time window in milliseconds (default 1 minute).
 * @returns true if allowed, false if rate limit exceeded.
 */

export const rateLimit = (
    identifier: string,
    limit: number = 5,
    windowMs: number = 60000
): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitMap.has(identifier)) {
        rateLimitMap.set(identifier, []);
    }

    const requests = rateLimitMap.get(identifier)!;
    const recentRequests = requests.filter((time) => time > windowStart);

    if (recentRequests.length >= limit) return false;

    recentRequests.push(now);
    rateLimitMap.set(identifier, recentRequests);

    return true;
}

// Optional: auto-cleanup to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [key, times] of rateLimitMap.entries()) {
        const recent = times.filter((t) => t > now - 60000); // default 1 minute window
        if (recent.length === 0) {
            rateLimitMap.delete(key);
        } else {
            rateLimitMap.set(key, recent);
        }
    }
}, 60000); // cleanup every minute

/**
 * Wrapper for Next.js requests
 *
 * @param req - Incoming NextRequest
 * @param keyPrefix - Unique key prefix to differentiate routes
 * @param limit - Number of allowed requests
 * @param windowMs - Time window in ms
 */
export const checkRateLimit = (req: Request | any, keyPrefix: string, limit = 5, windowMs = 300000) => {
    const clientIP = req.headers.get("x-forwarded-for") || req.ip || "unknown";

    const identifier = `${keyPrefix}:${clientIP}`;

    if (!rateLimit(identifier, limit, windowMs)) {
        throw APP_ERRORS.tooManyRequests(AuthErrors.TOO_MANY_REQUESTS + Math.ceil(windowMs / 1000) + "s");
    }
}
