import type { Note } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getTaskAccessContext } from '@/lib/server/db/utils/getTaskAccessContext';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { GeneralErrors, RATE_LIMIT_KEYS } from '@/lib/shared/constants';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import { noteSchema } from '@/lib/shared/validation/schemas';
import type { NoteCollectionParams, NoteWithAuthor } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteCollectionParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const { taskId } = await getTaskAccessContext({ params, req });

    const notes = await prisma.note.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            avatarUrl: true,
            email: true,
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<NoteWithAuthor[]>(notes);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteCollectionParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');
    const {
      taskId,
      userId,
      hotelId,
      roles,
      task: { cleaners },
    } = await getTaskAccessContext({
      params,
      req,
    });

    if (
      !checkPermission.creation.artifact({
        roles,
        cleaners,
        hotelId,
      })
    )
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

    const { content } = noteSchema.parse(await req.json());

    // Create the new note
    const note = await prisma.note.create({
      data: {
        content,
        taskId,
        authorId: userId,
      },
    });
    return NextResponse.json<Note>(note, {
      status: HttpStatus.CREATED,
    });
  }
);
