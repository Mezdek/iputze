import { HttpStatus } from '@lib';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Locale } from '@/i18n';

export async function POST(req: Request) {
    const { locale } = await req.json() as { locale: Locale };
    const cookieStore = await cookies();

    cookieStore.set({
        name: 'locale',
        value: locale,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return NextResponse.json(null, { status: HttpStatus.OK });
}
