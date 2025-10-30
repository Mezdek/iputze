import { getTaskAccessContext, prisma } from '@lib/db';
import { HttpStatus, noteSchema, withErrorHandling } from '@lib/shared';
import type { Note } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { NoteCollectionParams } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteCollectionParams }) => {
    const { taskId } = await getTaskAccessContext({ params, req });

    const notes = await prisma.note.findMany({
      where: { taskId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json<Note[]>(notes);
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
