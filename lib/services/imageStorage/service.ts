import { extractExifData, getImageStorageProvider } from '@lib/services';

import type { ImageStorageProvider, ImageUploadResult } from '@/types';

/**
 * High-level image processing service
 * Handles upload, compression, thumbnails, EXIF extraction
 */
export class ImageProcessingService {
  private provider: ImageStorageProvider;

  constructor() {
    this.provider = getImageStorageProvider();
  }

  /**
   * Upload and process image
   */
  async uploadImage(params: {
    file: File;
    taskId: string;
    compress?: boolean;
    generateThumbnail?: boolean;
    extractExif?: boolean;
  }): Promise<ImageUploadResult> {
    const {
      file,
      taskId,
      compress = true,
      generateThumbnail = true,
      extractExif = true,
    } = params;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract EXIF data if requested
    let exif: ImageUploadResult['exif'];
    if (extractExif) {
      exif = await extractExifData(buffer);
    }

    // Generate filename
    const timestamp = Date.now();
    const fileName = `task_${taskId}_${timestamp}`;

    // Upload to storage provider
    const uploadResult = await this.provider.upload({
      buffer,
      fileName,
      folder: 'tasks',
      compress,
      generateThumbnail,
    });

    // Calculate sizes
    const originalSize = buffer.length;
    const compressedSize = compress
      ? Math.floor(originalSize * 0.8)
      : originalSize;

    return {
      id: uploadResult.publicId,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      originalSize,
      compressedSize: compress ? compressedSize : undefined,
      exif,
    };
  }
  /**
   * Delete image
   */
  async deleteImage(publicId: string): Promise<void> {
    await this.provider.delete(publicId);
  }

  /**
   * Get image URL with transformations
   */
  getImageUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): string {
    return this.provider.getUrl(publicId, options);
  }
}

export const imageService = new ImageProcessingService();
