import type { AssignmentStatus } from '@prisma/client';

import type { TAssignmentResponse } from '@/types';

// ==================== Image Management ====================

/**
 * Response type for assignment images
 * Includes uploader info and metadata
 */
export interface AssignmentImageResponse {
  id: string;
  url: string;
  uploadedAt: Date;
  uploader: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  // EXIF data (optional, extracted on upload)
  exif?: {
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
export interface _ImageUploadRequest {
  file: File;
  assignmentId: string;
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
  exif?: AssignmentImageResponse['exif'] | null;
}

// ==================== Image Storage Abstraction ====================

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

// ==================== View Modes ====================

/**
 * View mode for components
 * Manager: Can upload and view all
 * Cleaner: Can upload during task execution
 */
export type ViewMode = 'manager' | 'cleaner';

// ==================== Filtering ====================

/**
 * Enhanced status filter that includes media filters
 */
export type EnhancedFilterStatus =
  | 'all'
  | AssignmentStatus
  | 'has-notes'
  | 'has-images'
  | 'has-media';

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

/**
 * Search and filter state
 */
export interface AssignmentFilters {
  status?: EnhancedFilterStatus;
  priority?: PriorityFilter;
  searchQuery?: string; // Search in notes content
  cleanerId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// ==================== Notes Enhancement ====================

/**
 * Note with author information
 * Already in TAssignmentResponse but adding for clarity
 */
export interface AssignmentNoteWithAuthor {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

// ==================== Component Props ====================

/**
 * Props for TaskCard component
 */
export interface TaskCardProps {
  task: TAssignmentResponse;
  onOpenDetails?: (task: TAssignmentResponse) => void;
  showMediaBadges?: boolean;
  viewMode?: ViewMode;
}

/**
 * Props for TaskDetails modal
 */
export interface TaskDetailsProps {
  task: TAssignmentResponse | null;
  isOpen: boolean;
  onClose: () => void;
  viewMode?: ViewMode;
}

/**
 * Props for NotesSection component
 */
export interface NotesSectionProps {
  notes: AssignmentNoteWithAuthor[];
  viewMode: ViewMode;
  assignmentId: string;
  hotelId: string;
  onNoteAdded?: () => void;
}

/**
 * Props for ImageGallery component
 */
export interface ImageGalleryProps {
  images: AssignmentImageResponse[];
  viewMode: ViewMode;
  assignmentId: string;
  hotelId: string;
  onImageAdded?: () => void;
  onImageDeleted?: (imageId: string) => void;
}

/**
 * Sort options for assignments
 */
export type AssignmentSortKey =
  | 'createdAt'
  | 'dueAt'
  | 'priority'
  | 'status'
  | 'roomNumber';

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  key: AssignmentSortKey;
  direction: SortDirection;
}
