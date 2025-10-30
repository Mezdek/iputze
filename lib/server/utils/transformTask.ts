import type { TaskUser } from '@prisma/client';

import type {
  BasicUser,
  Cleaner,
  EXIF,
  ImageResponse,
  ImageWithUploader,
  TaskResponse,
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
  cleaner: Pick<TaskUser, 'assignedAt'> & { user: BasicUser }
): Cleaner {
  const { assignedAt, user } = cleaner;
  return { assignedAt, ...user };
}
export function transformImage(image: ImageWithUploader): ImageResponse {
  const { exif, ...rest } = image;
  return { ...rest, exif: exif as EXIF | null };
}
