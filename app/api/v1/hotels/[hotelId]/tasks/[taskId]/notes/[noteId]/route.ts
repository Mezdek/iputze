import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getNoteOrThrow } from '@/lib/server/db/utils/getNoteOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import type { NoteParams } from '@/types';

export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteParams }) => {
    const { noteId } = await params;

    const { id: userId } = await getUserOrThrow(req);

    const {
      id,
      author: { id: authorId },
    } = await getNoteOrThrow({ noteId });

    if (!checkPermission.deleion.note({ authorId, userId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

    await prisma.note.delete({ where: { id } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
