import { APP_ERRORS, AuthErrors } from '@lib';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type RateLimitConfig = {
  identifier: string;
  limit: number;
  windowMs: number;
};

/**
 * Redis-based rate limiter using sorted sets
 * Works across serverless instances and deployments
 */
export const rateLimit = async ({
  identifier,
  limit = 5,
  windowMs = 60000,
}: RateLimitConfig): Promise<boolean> => {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Remove old entries outside time window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

    // Set expiration (TTL)
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const count = results[1] as number;

    return count < limit;
  } catch (error) {
    // Fail open: allow request if Redis is down
    console.error('Rate limit check failed:', error);
    return true;
  }
};

/**
 * Next.js request wrapper with typed configs
 */
type RateLimitPreset = 'auth' | 'api' | 'strict';

const PRESETS: Record<RateLimitPreset, { limit: number; windowMs: number }> = {
  auth: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 req / 15min
  api: { limit: 100, windowMs: 60 * 60 * 1000 }, // 100 req / hour
  strict: { limit: 3, windowMs: 60 * 1000 }, // 3 req / min
};

export const checkRateLimit = async (
  req: Request,
  keyPrefix: string,
  preset: RateLimitPreset = 'auth'
): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !process.env.TEST_RATE_LIMIT) {
    return;
  }

  const clientIP =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const identifier = `${keyPrefix}:${clientIP}`;
  const config = PRESETS[preset];

  const allowed = await rateLimit({ identifier, ...config });

  if (!allowed) {
    throw APP_ERRORS.tooManyRequests(
      `${AuthErrors.TOO_MANY_REQUESTS}${Math.ceil(config.windowMs / 1000)}s`
    );
  }
};
