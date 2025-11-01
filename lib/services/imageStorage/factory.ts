import { CloudinaryStorage } from '@lib/services';

import type { ImageStorageProvider } from '@/types';

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
