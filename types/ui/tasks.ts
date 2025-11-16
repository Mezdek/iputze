import type { ImageResponse } from '@/types';

// ==================== Image Management ====================

/**
 * Response type for task images
 * Includes uploader info and metadata
 */

export interface EXIF {
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
}

/**
 * Media count for badge displays
 */
export interface TaskMediaCount {
  notes: number;
  images: number;
}

// ==================== Image Upload ====================

/**
 * Image upload request with compression options
 */
export interface ImageUploadRequest {
  file: File;
  taskId: string;
  hotelId: string;
  compress?: boolean; // Default: true
  generateThumbnail?: boolean; // Default: true
  extractExif?: boolean; // Default: true
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  originalSize: number;
  compressedSize?: number;
  exif?: EXIF | null;
}

// ==================== View Modes ====================

/**
 * View mode for components
 * Manager: Can upload and view all
 * Cleaner: Can upload during task execution
 */
export type ViewMode = 'manager' | 'cleaner';

// ==================== Filtering ====================

/**
 * Priority filter options
 */
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low' | 'none';

export const PRIORITY_RANGES = {
  high: { min: 3, max: Infinity },
  medium: { min: 1, max: 2 },
  low: { min: 0, max: 0 },
  none: { min: -Infinity, max: -1 },
} as const;

// ==================== Component Props ====================

/**
 * Props for NotesSection component
 */
export interface NotesSectionProps {
  viewMode: ViewMode;
  taskId: string;
  hotelId: string;
  onNoteAdded?: () => void;
}

/**
 * Props for ImageGallery component
 */
export interface ImageGalleryProps {
  images: ImageResponse[];
  viewMode: ViewMode;
  taskId: string;
  hotelId: string;
  onImageAdded?: () => void;
  onImageDeleted?: (imageId: string) => void;
}

/**
 * Sort options for tasks
 */
export type TaskSortKey =
  | 'createdAt'
  | 'dueAt'
  | 'priority'
  | 'status'
  | 'roomNumber';

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  key: TaskSortKey;
  direction: SortDirection;
}
