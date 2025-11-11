import { hash } from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import {
  AuthErrors,
  HttpStatus,
  RATE_LIMIT_KEYS,
} from '@/lib/shared/constants';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { userCreationSchema } from '@/lib/shared/validation/schemas';
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
