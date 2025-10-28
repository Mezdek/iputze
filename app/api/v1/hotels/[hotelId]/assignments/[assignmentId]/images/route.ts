import { getAssignmentAccessContext, prisma } from '@lib/db';
import { APP_ERRORS, HttpStatus, withErrorHandling } from '@lib/shared';
import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AssignmentParams } from '@/types';

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
});

/**
 * GET /api/v1/hotels/[hotelId]/assignments/[assignmentId]/images
 * Fetch all non-deleted images for an assignment
 */
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: AssignmentParams }) => {
    const { assignmentId } = await getAssignmentAccessContext({
      params,
      req,
    });

    const images = await prisma.assignmentImage.findMany({
      where: {
        assignmentId,
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

    return NextResponse.json(images, { status: HttpStatus.OK });
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: AssignmentParams }) => {
    const { assignmentId, userId } = await getAssignmentAccessContext({
      params,
      req,
    });

    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) throw APP_ERRORS.badRequest('No image provided');

    // Validate file type
    if (!image.type.startsWith('image/')) {
      throw APP_ERRORS.badRequest('File must be an image');
    }

    // Validate file size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      throw APP_ERRORS.badRequest('Image must be less than 5MB');
    }

    // Convert to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'assignments' },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Upload failed without error'));
          }
        )
        .end(buffer);
    });

    // Save to database
    const assignmentImage = await prisma.assignmentImage.create({
      data: {
        assignmentId,
        uploadedBy: userId,
        url: result.secure_url,
      },
    });

    return NextResponse.json(assignmentImage, { status: HttpStatus.CREATED });
  }
);
