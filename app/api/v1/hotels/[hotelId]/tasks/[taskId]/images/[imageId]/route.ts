import { getTaskAccessContext, prisma } from '@lib/db';
import { hasManagerPermission } from '@lib/server';
import { APP_ERRORS, HttpStatus, withErrorHandling } from '@lib/shared';
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { cloudinaryConfig } from '@/lib/services/imageStorage/config';
import type { ImageParams } from '@/types';

cloudinary.config(cloudinaryConfig);

/**
 * DELETE /api/v1/hotels/[hotelId]/tasks/[taskId]/images/[imageId]
 * Soft delete an task image
 * Only managers can delete images
 */
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: ImageParams }) => {
    const { taskId, userId, roles, hotelId } = await getTaskAccessContext({
      params,
      req,
    });

    const { imageId } = params;

    // Verify user is a manager

    if (!hasManagerPermission({ hotelId, roles })) {
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

    // Note: We don't delete from Cloudinary immediately for recovery purposes
    // A background job could clean up soft-deleted images after 30 days

    return NextResponse.json(
      { message: 'Image deleted successfully', imageId: deletedImage.id },
      { status: HttpStatus.OK }
    );
  }
);
