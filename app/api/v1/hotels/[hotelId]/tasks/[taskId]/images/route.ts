import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getTaskAccessContext } from '@/lib/server/db/utils/getTaskAccessContext';
import { uploadToCloudinary } from '@/lib/server/utils/cloudinary';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { transformImage } from '@/lib/shared/utils/transformers/transformTask';
import type { ImageResponse, TaskParams } from '@/types';

/**
 * GET /api/v1/hotels/[hotelId]/tasks/[taskId]/images
 * Fetch all non-deleted images for an task
 */
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    const { taskId } = await getTaskAccessContext({
      params,
      req,
    });

    const images = await prisma.image.findMany({
      where: {
        taskId,
        deletedAt: null, // Only return non-deleted images
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    const transformedImages = images.map(transformImage);

    return NextResponse.json<ImageResponse[]>(transformedImages);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    const { taskId, userId } = await getTaskAccessContext({
      params,
      req,
    });

    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) throw APP_ERRORS.badRequest('No image provided');

    const result = await uploadToCloudinary(image);

    // Save to database
    const taskImage = await prisma.image.create({
      data: {
        taskId,
        uploaderId: userId,
        url: result.secure_url,
      },
    });

    return NextResponse.json(taskImage, { status: HttpStatus.CREATED });
  }
);
