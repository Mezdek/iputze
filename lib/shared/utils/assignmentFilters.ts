// Utility functions for filtering and sorting assignments
// Supports enhanced filters: status, priority, media presence, notes search

import { AssignmentStatus } from '@prisma/client';

import type {
  AssignmentFilters,
  AssignmentSortKey,
  EnhancedFilterStatus,
  PRIORITY_RANGES,
  PriorityFilter,
  SortOptions,
  TAssignmentResponse,
} from '@/types';

// ==================== Filtering ====================

/**
 * Check if assignment matches priority filter
 */
function matchesPriorityFilter(
  assignment: TAssignmentResponse,
  filter: PriorityFilter
): boolean {
  if (filter === 'all') return true;

  const ranges: typeof PRIORITY_RANGES = {
    high: { min: 3, max: Infinity },
    medium: { min: 1, max: 2 },
    low: { min: 0, max: 0 },
    none: { min: -Infinity, max: -1 },
  };

  const range = ranges[filter];
  return assignment.priority >= range.min && assignment.priority <= range.max;
}

/**
 * Check if assignment matches status filter
 */
function matchesStatusFilter(
  assignment: TAssignmentResponse,
  filter: EnhancedFilterStatus
): boolean {
  if (filter === 'all') return true;

  // Handle media filters
  if (filter === 'has-notes') {
    return assignment.notes.length > 0;
  }
  if (filter === 'has-images') {
    return assignment.images.length > 0;
  }
  if (filter === 'has-media') {
    return assignment.notes.length > 0 || assignment.images.length > 0;
  }

  // Handle status filters
  return assignment.status === filter;
}

/**
 * Check if assignment notes contain search query
 */
function matchesSearchQuery(
  assignment: TAssignmentResponse,
  query: string | undefined
): boolean {
  if (!query || !query.trim()) return true;

  const searchTerm = query.toLowerCase().trim();

  // Search in notes content
  return assignment.notes.some((note) =>
    note.content.toLowerCase().includes(searchTerm)
  );
}

/**
 * Check if assignment matches date range filter
 */
function matchesDateRange(
  assignment: TAssignmentResponse,
  dateRange: AssignmentFilters['dateRange']
): boolean {
  if (!dateRange) return true;

  const assignmentDate = new Date(assignment.dueAt);
  return assignmentDate >= dateRange.start && assignmentDate <= dateRange.end;
}

/**
 * Check if assignment is assigned to specific cleaner
 */
function matchesCleanerFilter(
  assignment: TAssignmentResponse,
  cleanerId: string | undefined
): boolean {
  if (!cleanerId) return true;

  return assignment.cleaners.some((cleaner) => cleaner.id === cleanerId);
}

/**
 * Filter assignments based on all filter criteria
 */
export function filterAssignments(
  assignments: TAssignmentResponse[],
  filters: AssignmentFilters
): TAssignmentResponse[] {
  return assignments.filter((assignment) => {
    // Status filter (includes media filters)
    if (filters.status && !matchesStatusFilter(assignment, filters.status)) {
      return false;
    }

    // Priority filter
    if (
      filters.priority &&
      !matchesPriorityFilter(assignment, filters.priority)
    ) {
      return false;
    }

    // Search query (notes content)
    if (!matchesSearchQuery(assignment, filters.searchQuery)) {
      return false;
    }

    // Date range filter
    if (!matchesDateRange(assignment, filters.dateRange)) {
      return false;
    }

    // Cleaner filter
    if (!matchesCleanerFilter(assignment, filters.cleanerId)) {
      return false;
    }

    return true;
  });
}

// ==================== Sorting ====================

/**
 * Get sort value for assignment
 */
function getSortValue(
  assignment: TAssignmentResponse,
  key: AssignmentSortKey
): number | string {
  switch (key) {
    case 'createdAt':
      return assignment.createdAt.getTime();
    case 'dueAt':
      return assignment.dueAt.getTime();
    case 'priority':
      return assignment.priority;
    case 'status': {
      // Sort order: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
      const statusOrder = {
        [AssignmentStatus.PENDING]: 0,
        [AssignmentStatus.IN_PROGRESS]: 1,
        [AssignmentStatus.COMPLETED]: 2,
        [AssignmentStatus.CANCELLED]: 3,
      };
      return statusOrder[assignment.status];
    }
    case 'roomNumber':
      return assignment.room.number;
    default:
      return 0;
  }
}

/**
 * Sort assignments
 */
export function sortAssignments(
  assignments: TAssignmentResponse[],
  options: SortOptions
): TAssignmentResponse[] {
  return [...assignments].sort((a, b) => {
    const aValue = getSortValue(a, options.key);
    const bValue = getSortValue(b, options.key);

    let comparison = 0;

    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }

    return options.direction === 'asc' ? comparison : -comparison;
  });
}

// ==================== Statistics ====================

/**
 * Calculate statistics for filtered assignments
 */
export function calculateAssignmentStats(assignments: TAssignmentResponse[]): {
  total: number;
  byStatus: Record<AssignmentStatus, number>;
  byPriority: { high: number; medium: number; low: number };
  withNotes: number;
  withImages: number;
  withMedia: number;
  averagePriority: number;
} {
  const stats = {
    total: assignments.length,
    byStatus: {
      [AssignmentStatus.PENDING]: 0,
      [AssignmentStatus.IN_PROGRESS]: 0,
      [AssignmentStatus.COMPLETED]: 0,
      [AssignmentStatus.CANCELLED]: 0,
    },
    byPriority: { high: 0, medium: 0, low: 0 },
    withNotes: 0,
    withImages: 0,
    withMedia: 0,
    averagePriority: 0,
  };

  let totalPriority = 0;

  assignments.forEach((assignment) => {
    // Status counts
    stats.byStatus[assignment.status]++;

    // Priority counts
    if (assignment.priority >= 3) {
      stats.byPriority.high++;
    } else if (assignment.priority >= 1) {
      stats.byPriority.medium++;
    } else {
      stats.byPriority.low++;
    }

    // Media counts
    if (assignment.notes.length > 0) {
      stats.withNotes++;
    }
    if (assignment.images.length > 0) {
      stats.withImages++;
    }
    if (assignment.notes.length > 0 || assignment.images.length > 0) {
      stats.withMedia++;
    }

    totalPriority += assignment.priority;
  });

  stats.averagePriority =
    assignments.length > 0 ? totalPriority / assignments.length : 0;

  return stats;
}

// ==================== Grouping ====================

/**
 * Group assignments by room
 */
export function groupByRoom(
  assignments: TAssignmentResponse[]
): Map<string, TAssignmentResponse[]> {
  const groups = new Map<string, TAssignmentResponse[]>();

  assignments.forEach((assignment) => {
    const roomId = assignment.room.id;
    const existing = groups.get(roomId) || [];
    groups.set(roomId, [...existing, assignment]);
  });

  return groups;
}

/**
 * Group assignments by date
 */
export function groupByDate(
  assignments: TAssignmentResponse[]
): Map<string, TAssignmentResponse[]> {
  const groups = new Map<string, TAssignmentResponse[]>();

  assignments.forEach((assignment) => {
    const dateKey = new Date(assignment.dueAt).toISOString().split('T')[0]!;
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, assignment]);
  });

  return groups;
}

/**
 * Group assignments by status
 */
export function groupByStatus(
  assignments: TAssignmentResponse[]
): Map<AssignmentStatus, TAssignmentResponse[]> {
  const groups = new Map<AssignmentStatus, TAssignmentResponse[]>();

  assignments.forEach((assignment) => {
    const existing = groups.get(assignment.status) || [];
    groups.set(assignment.status, [...existing, assignment]);
  });

  return groups;
}

// ==================== Utilities ====================

/**
 * Check if assignment is overdue
 */
export function isOverdue(assignment: TAssignmentResponse): boolean {
  if (
    assignment.status === AssignmentStatus.COMPLETED ||
    assignment.status === AssignmentStatus.CANCELLED
  ) {
    return false;
  }

  return new Date(assignment.dueAt) < new Date();
}

/**
 * Check if assignment is due soon (within 2 hours)
 */
export function isDueSoon(assignment: TAssignmentResponse): boolean {
  if (
    assignment.status === AssignmentStatus.COMPLETED ||
    assignment.status === AssignmentStatus.CANCELLED
  ) {
    return false;
  }

  const now = new Date();
  const dueDate = new Date(assignment.dueAt);
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilDue > 0 && hoursUntilDue <= 2;
}

/**
 * Get human-readable time until due
 */
export function getTimeUntilDue(assignment: TAssignmentResponse): string {
  const now = new Date();
  const dueDate = new Date(assignment.dueAt);
  const diff = dueDate.getTime() - now.getTime();

  if (diff < 0) {
    return 'Overdue';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
