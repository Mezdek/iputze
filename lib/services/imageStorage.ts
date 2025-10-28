// Abstract image storage service
// Supports easy migration between providers (Cloudinary, S3, etc.)

import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import ExifReader from 'exifreader';

import type { ImageStorageProvider, ImageUploadResult } from '@/types';

// ==================== Abstract Base Service ====================

/**
 * Base parameters for image upload
 */
interface UploadParams {
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
interface StorageUploadResult {
  url: string;
  thumbnailUrl?: string;
  publicId: string;
  width?: number;
  height?: number;
}

// ==================== Image Service Factory ====================

/**
 * Get the configured image storage provider
 * Currently uses Cloudinary, but can be swapped for S3, etc.
 */
export function getImageStorageProvider(): ImageStorageProvider {
  const provider = process.env['IMAGE_STORAGE_PROVIDER'] || 'cloudinary';

  switch (provider.toLowerCase()) {
    case 'cloudinary':
      return new CloudinaryStorage();
    case 's3':
      // Future: return new S3Storage();
      throw new Error('S3 storage not yet implemented');
    case 'local':
      // Future: return new LocalStorage();
      throw new Error('Local storage not yet implemented');
    default:
      return new CloudinaryStorage();
  }
}

// ==================== Cloudinary Implementation ====================

class CloudinaryStorage implements ImageStorageProvider {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
      api_key: process.env['CLOUDINARY_API_KEY'],
      api_secret: process.env['CLOUDINARY_API_SECRET'],
    });
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

// ==================== EXIF Extraction ====================

/**
 * Extract EXIF data from image buffer
 */
export async function extractExifData(buffer: Buffer): Promise<{
  timestamp?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  camera?: string;
  dimensions?: {
    width: number;
    height: number;
  };
} | null> {
  try {
    const tags = ExifReader.load(buffer);

    const result: any = {};

    // Extract timestamp
    if (tags.DateTime?.description) {
      result.timestamp = tags.DateTime.description;
    } else if (tags.DateTimeOriginal?.description) {
      result.timestamp = tags.DateTimeOriginal.description;
    }

    // Extract GPS location
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const latitude = tags.GPSLatitude.description;
      const longitude = tags.GPSLongitude.description;

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        result.location = { latitude, longitude };
      }
    }

    // Extract camera info
    if (tags.Model?.description) {
      const make = tags.Make?.description || '';
      result.camera = make
        ? `${make} ${tags.Model.description}`
        : tags.Model.description;
    }

    // Extract dimensions
    if (tags.ImageWidth?.value && tags.ImageHeight?.value) {
      result.dimensions = {
        width: tags.ImageWidth.value,
        height: tags.ImageHeight.value,
      };
    } else if (tags['Image Width']?.value && tags['Image Height']?.value) {
      result.dimensions = {
        width: tags['Image Width'].value,
        height: tags['Image Height'].value,
      };
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.error('Failed to extract EXIF data:', error);
    return null;
  }
}

// ==================== Image Processing Service ====================

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
    assignmentId: string;
    compress?: boolean;
    generateThumbnail?: boolean;
    extractExif?: boolean;
  }): Promise<ImageUploadResult> {
    const {
      file,
      assignmentId,
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
    const fileName = `assignment_${assignmentId}_${timestamp}`;

    // Upload to storage provider
    const uploadResult = await this.provider.upload({
      buffer,
      fileName,
      folder: 'assignments',
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

// ==================== Export ====================

export const imageService = new ImageProcessingService();
