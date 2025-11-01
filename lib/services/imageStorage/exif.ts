import ExifReader from 'exifreader';

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
