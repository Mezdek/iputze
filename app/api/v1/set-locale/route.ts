import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Locale } from '@/i18n';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { RATE_LIMIT_KEYS } from '@/lib/shared/constants';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';

export async function POST(req: Request) {
  await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

  const { locale } = (await req.json()) as { locale: Locale };
  const cookieStore = await cookies();

  cookieStore.set({
    name: 'locale',
    value: locale,
    path: '/',
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
  });

  return NextResponse.json(null, { status: HttpStatus.OK });
}
