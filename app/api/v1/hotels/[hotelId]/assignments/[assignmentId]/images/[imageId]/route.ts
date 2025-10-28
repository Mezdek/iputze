import { getAssignmentAccessContext, prisma } from '@lib/db';
import { APP_ERRORS, HttpStatus, withErrorHandling } from '@lib/shared';
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { hasManagerPermission } from '@/lib/server';
import type { AssignmentParams } from '@/types';

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
});

interface ImageParams extends AssignmentParams {
  imageId: string;
}

/**
 * DELETE /api/v1/hotels/[hotelId]/assignments/[assignmentId]/images/[imageId]
 * Soft delete an assignment image
 * Only managers can delete images
 */
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: ImageParams }) => {
    const { assignmentId, userId, roles, hotelId } =
      await getAssignmentAccessContext({
        params,
        req,
      });

    const { imageId } = params;

    // Verify user is a manager

    if (!hasManagerPermission({ hotelId, roles })) {
      throw APP_ERRORS.forbidden('Only managers can delete images');
    }

    // Check if image exists and belongs to this assignment
    const image = await prisma.assignmentImage.findFirst({
      where: {
        id: imageId,
        assignmentId,
        deletedAt: null, // Only show non-deleted images
      },
    });

    if (!image) {
      throw APP_ERRORS.notFound('Image not found or already deleted');
    }

    // Soft delete: Set deletedAt and deletedBy
    const deletedImage = await prisma.assignmentImage.update({
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
