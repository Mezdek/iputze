import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getTaskAccessContext } from '@/lib/server/db/utils/getTaskAccessContext';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { RATE_LIMIT_KEYS } from '@/lib/shared/constants';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkRoles } from '@/lib/shared/utils/permissions';
import type { ImageParams } from '@/types';

/**
 * DELETE /api/v1/hotels/[hotelId]/tasks/[taskId]/images/[imageId]
 * Soft delete an task image
 * Only managers can delete images
 */
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: ImageParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const { taskId, userId, roles, hotelId } = await getTaskAccessContext({
      params,
      req,
    });

    const { imageId } = params;

    // Verify user is a manager

    if (!checkRoles.hasManagerPermission({ hotelId, roles })) {
      throw APP_ERRORS.forbidden('Only managers can delete images');
    }

    // Check if image exists and belongs to this task
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        taskId,
        deletedAt: null, // Only show non-deleted images
      },
    });
    if (!image) {
      throw APP_ERRORS.notFound('Image not found or already deleted');
    }

    // Soft delete: Set deletedAt and deletedBy
    const deletedImage = await prisma.image.update({
      where: { id: imageId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return NextResponse.json(
      { message: 'Image deleted successfully', imageId: deletedImage.id },
      { status: HttpStatus.OK }
    );
  }
);
