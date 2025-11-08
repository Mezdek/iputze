import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { parseExpiryToMilliSeconds } from '@/lib/shared/utils/parseExpiryToSeconds';

export const SESSION_COOKIE_EXP = process.env['SESSION_COOKIE_EXP'] || '7d';

export const SESSION_COOKIE_KEY = 'session_id';

export const ResponseCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: parseExpiryToMilliSeconds(SESSION_COOKIE_EXP),
};
