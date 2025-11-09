import type { Note } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getTaskAccessContext } from '@/lib/server/db/utils/getTaskAccessContext';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { noteSchema } from '@/lib/shared/validation/schemas';
import type { NoteCollectionParams, NoteWithAuthor } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteCollectionParams }) => {
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
    const { taskId, userId } = await getTaskAccessContext({
      params,
      req,
    });

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
