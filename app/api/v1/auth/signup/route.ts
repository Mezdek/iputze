import { prisma } from '@lib/db';
import { checkRateLimit } from '@lib/server';
import {
  APP_ERRORS,
  AuthErrors,
  HttpStatus,
  RATE_LIMIT_KEYS,
  userCreationSchema,
  withErrorHandling,
} from '@lib/shared';
import { hash } from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { SignUpResponse } from '@/types';

export const POST = withErrorHandling(async (req: NextRequest) => {
  await checkRateLimit(req, RATE_LIMIT_KEYS.REGISTER, 'api');

  const { name, email, password } = userCreationSchema.parse(await req.json());

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw APP_ERRORS.conflict(AuthErrors.DUPLICATED_USER);

  // Hash password
  const passwordHash = await hash(password, 10);

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return NextResponse.json<SignUpResponse>(
    { id: user.id, email: user.email, name: user.name },
    { status: HttpStatus.CREATED }
  );
});
