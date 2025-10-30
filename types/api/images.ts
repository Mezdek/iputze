import type { Image } from '@prisma/client';

import type { BasicUser, EXIF, TaskParams } from '@/types';

export interface ImageCreationBody {
  file: File;
}

export interface ImageResponse extends Omit<Image, 'exif'> {
  uploader: BasicUser;
  exif: EXIF | null;
}

export interface ImageWithUploader extends Image {
  uploader: BasicUser;
}
export type ImageCollectionParams = TaskParams;
export type ImageParams = ImageCollectionParams & {
  imageId: string;
};
