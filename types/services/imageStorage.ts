/**
 * Base parameters for image upload
 */
export interface UploadParams {
  buffer: Buffer;
  fileName: string;
  folder: string;
  compress?: boolean;
  generateThumbnail?: boolean;
  extractExif?: boolean;
}

/**
 * Upload result from storage provider
 */
export interface StorageUploadResult {
  url: string;
  thumbnailUrl?: string;
  publicId: string;
  width?: number;
  height?: number;
}

/**
 * Abstract image storage provider interface
 * Allows easy migration from Cloudinary to other services
 */
export interface ImageStorageProvider {
  upload(params: {
    buffer: Buffer;
    fileName: string;
    folder: string;
    compress?: boolean;
    generateThumbnail?: boolean;
  }): Promise<{
    url: string;
    thumbnailUrl?: string;
    publicId: string;
  }>;

  delete(publicId: string): Promise<void>;

  getUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): string;
}
