import type { Cleaner } from '@prisma/client';

import type {
  BasicUser,
  EXIF,
  ImageResponse,
  ImageWithUploader,
  TaskResponse,
  TransformedCleaner,
  TransformTaskProps,
} from '@/types';

export function transformTask(task: TransformTaskProps): TaskResponse {
  const { cleaners, images, ...rest } = task;
  const transformedImages = images.map(transformImage);
  const transformedCleaners = cleaners.map(transformCleaner);
  return {
    ...rest,
    images: transformedImages,
    cleaners: transformedCleaners,
  };
}

function transformCleaner(
  cleaner: Pick<Cleaner, 'assignedAt'> & { user: BasicUser }
): TransformedCleaner {
  const { assignedAt, user } = cleaner;
  return { assignedAt, ...user };
}
export function transformImage(image: ImageWithUploader): ImageResponse {
  const { exif, ...rest } = image;
  return { ...rest, exif: exif as EXIF | null };
}
