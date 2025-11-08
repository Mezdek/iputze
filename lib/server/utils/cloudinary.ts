import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

import { APP_ERRORS } from '@/lib/shared/errors/api/factories';

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
});

export async function uploadToCloudinary(
  image: File,
  folder?: string,
  maxAllowedSize: number = 5 * 1024 * 1024
): Promise<UploadApiResponse> {
  if (!image.type.startsWith('image/'))
    throw APP_ERRORS.badRequest('File must be an image');

  if (image.size > maxAllowedSize)
    throw APP_ERRORS.badRequest('Image must be less than 5MB');

  // Convert to buffer
  const imageArrayBuffer = await image.arrayBuffer();

  const buffer = Buffer.from(imageArrayBuffer);

  // Upload to Cloudinary
  const uploaded = new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('Upload failed without error'));
        }
      )
      .end(buffer);
  });

  return uploaded;
}
