import { cloudinaryConfig } from '@lib/services';
import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

import type {
  ImageStorageProvider,
  StorageUploadResult,
  UploadParams,
} from '@/types';

export class CloudinaryStorage implements ImageStorageProvider {
  constructor() {
    // Configure Cloudinary
    cloudinary.config(cloudinaryConfig);
  }

  /**
   * Upload image to Cloudinary with optional compression and thumbnail
   */
  async upload(params: UploadParams): Promise<StorageUploadResult> {
    const {
      buffer,
      fileName,
      folder,
      compress = true,
      generateThumbnail = true,
    } = params;

    // Base transformation options
    const transformations: string[] = [];

    if (compress) {
      transformations.push('q_80'); // Quality 80%
      transformations.push('f_auto'); // Auto format (WebP when supported)
    }

    // Upload main image
    const result = await this.uploadStream(buffer, {
      folder,
      public_id: fileName,
      resource_type: 'image',
      transformation: transformations.join(','),
    });

    // Generate thumbnail URL
    let thumbnailUrl: string | undefined;
    if (generateThumbnail) {
      thumbnailUrl = cloudinary.url(result.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      });
    }

    return {
      url: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  /**
   * Delete image from Cloudinary
   */
  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  /**
   * Get URL with transformations
   */
  getUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): string {
    return cloudinary.url(publicId, {
      width: options?.width,
      height: options?.height,
      quality: options?.quality || 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Upload buffer as stream to Cloudinary
   */
  private async uploadStream(
    buffer: Buffer,
    options: any
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          options,
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Upload failed without error'));
          }
        )
        .end(buffer);
    });
  }
}
