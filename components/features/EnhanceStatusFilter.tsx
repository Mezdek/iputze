'use client';
import {
  Button,
  ButtonGroup,
  Chip,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { AssignmentStatus } from '@prisma/client';
import { useState } from 'react';

import type {
  AssignmentFilters,
  EnhancedFilterStatus,
  PriorityFilter,
} from '@/types';

interface EnhancedStatusFilterProps {
  currentFilter: AssignmentFilters;
  onFilterChange: (filters: AssignmentFilters) => void;
  className?: string;
}

/**
 * Enhanced Status Filter Component
 * Supports status, priority, media presence, and note content search
 */
export function EnhancedStatusFilter({
  currentFilter,
  onFilterChange,
  className,
}: EnhancedStatusFilterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    currentFilter.searchQuery || ''
  );

  const statusFilters: Array<{
    key: EnhancedFilterStatus;
    label: string;
    color: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }> = [
    { key: 'all', label: 'All', color: 'default' },
    { key: AssignmentStatus.PENDING, label: 'Pending', color: 'warning' },
    {
      key: AssignmentStatus.IN_PROGRESS,
      label: 'In Progress',
      color: 'primary',
    },
    { key: AssignmentStatus.COMPLETED, label: 'Completed', color: 'success' },
    { key: AssignmentStatus.CANCELLED, label: 'Cancelled', color: 'danger' },
  ];

  const mediaFilters = [
    { key: 'has-notes', label: 'Has Notes', icon: '📝' },
    { key: 'has-images', label: 'Has Images', icon: '📷' },
    { key: 'has-media', label: 'Has Media', icon: '🗂️' },
  ];

  const priorityFilters: Array<{ key: PriorityFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High (3+)' },
    { key: 'medium', label: 'Medium (1-2)' },
    { key: 'low', label: 'Low (0)' },
  ];

  const handleStatusChange = (status: EnhancedFilterStatus) => {
    onFilterChange({ ...currentFilter, status });
  };

  const handlePriorityChange = (priority: PriorityFilter) => {
    onFilterChange({ ...currentFilter, priority });
  };

  const handleSearchSubmit = () => {
    onFilterChange({
      ...currentFilter,
      searchQuery: searchQuery.trim() || undefined,
    });
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onFilterChange({ ...currentFilter, searchQuery: undefined });
  };

  const activeFilterCount = [
    currentFilter.status && currentFilter.status !== 'all' ? 1 : 0,
    currentFilter.priority && currentFilter.priority !== 'all' ? 1 : 0,
    currentFilter.searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-default-600 mr-2">
          Status:
        </span>
        <ButtonGroup size="sm">
          {statusFilters.map((filter) => (
            <Button
              color={
                currentFilter.status === filter.key ? filter.color : 'default'
              }
              key={filter.key}
              variant={currentFilter.status === filter.key ? 'solid' : 'flat'}
              onClick={() => handleStatusChange(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Advanced Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-default-600 mr-2">
          Filters:
        </span>

        {/* Priority Filter */}
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              color={
                currentFilter.priority && currentFilter.priority !== 'all'
                  ? 'primary'
                  : 'default'
              }
              endContent={
                currentFilter.priority && currentFilter.priority !== 'all' ? (
                  <Chip
                    className="ml-1"
                    color="primary"
                    size="sm"
                    variant="dot"
                  />
                ) : null
              }
              size="sm"
              variant="flat"
            >
              Priority
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold mb-2">Filter by Priority</p>
              {priorityFilters.map((filter) => (
                <Button
                  className="justify-start"
                  color={
                    currentFilter.priority === filter.key
                      ? 'primary'
                      : 'default'
                  }
                  key={filter.key}
                  size="sm"
                  variant={
                    currentFilter.priority === filter.key ? 'solid' : 'flat'
                  }
                  onClick={() => handlePriorityChange(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Media Filters */}
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              color={
                currentFilter.status &&
                ['has-notes', 'has-images', 'has-media'].includes(
                  currentFilter.status
                )
                  ? 'secondary'
                  : 'default'
              }
              size="sm"
              variant="flat"
            >
              Media
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold mb-2">Filter by Media</p>
              {mediaFilters.map((filter) => (
                <Button
                  className="justify-start"
                  color={
                    currentFilter.status === filter.key
                      ? 'secondary'
                      : 'default'
                  }
                  key={filter.key}
                  size="sm"
                  startContent={<span>{filter.icon}</span>}
                  variant={
                    currentFilter.status === filter.key ? 'solid' : 'flat'
                  }
                  onClick={() =>
                    handleStatusChange(filter.key as EnhancedFilterStatus)
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Notes */}
        <Popover
          isOpen={isSearchOpen}
          placement="bottom-start"
          onOpenChange={setIsSearchOpen}
        >
          <PopoverTrigger>
            <Button
              color={currentFilter.searchQuery ? 'primary' : 'default'}
              endContent={
                currentFilter.searchQuery ? (
                  <Chip
                    className="ml-1"
                    color="primary"
                    size="sm"
                    variant="dot"
                  />
                ) : null
              }
              size="sm"
              startContent="🔍"
              variant="flat"
            >
              Search Notes
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3">
            <div className="flex flex-col gap-3 w-64">
              <p className="text-sm font-semibold">Search in Notes</p>
              <Input
                placeholder="Enter search term..."
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                {currentFilter.searchQuery && (
                  <Button size="sm" variant="light" onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
                <Button color="primary" size="sm" onClick={handleSearchSubmit}>
                  Search
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear All Filters */}
        {activeFilterCount > 0 && (
          <Button
            color="danger"
            size="sm"
            variant="light"
            onClick={() => {
              setSearchQuery('');
              onFilterChange({
                status: 'all',
                priority: 'all',
                searchQuery: undefined,
              });
            }}
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-default-500">Active filters:</span>

          {currentFilter.status && currentFilter.status !== 'all' && (
            <Chip
              size="sm"
              variant="flat"
              onClose={() => handleStatusChange('all')}
            >
              Status: {currentFilter.status}
            </Chip>
          )}

          {currentFilter.priority && currentFilter.priority !== 'all' && (
            <Chip
              color="primary"
              size="sm"
              variant="flat"
              onClose={() => handlePriorityChange('all')}
            >
              Priority: {currentFilter.priority}
            </Chip>
          )}

          {currentFilter.searchQuery && (
            <Chip
              color="secondary"
              size="sm"
              variant="flat"
              onClose={handleClearSearch}
            >
              Search: &quot;{currentFilter.searchQuery}&quot;
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple Status Filter (for backward compatibility)
 */
export function StatusFilter({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: EnhancedFilterStatus;
  onFilterChange: (status: EnhancedFilterStatus) => void;
}) {
  const filters: Array<{
    key: EnhancedFilterStatus;
    label: string;
    color: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }> = [
    { key: 'all', label: 'All', color: 'default' },
    { key: AssignmentStatus.PENDING, label: 'Pending', color: 'warning' },
    {
      key: AssignmentStatus.IN_PROGRESS,
      label: 'In Progress',
      color: 'primary',
    },
    { key: AssignmentStatus.COMPLETED, label: 'Completed', color: 'success' },
    { key: AssignmentStatus.CANCELLED, label: 'Cancelled', color: 'danger' },
  ];

  return (
    <ButtonGroup size="sm">
      {filters.map((filter) => (
        <Button
          color={currentFilter === filter.key ? filter.color : 'default'}
          key={filter.key}
          variant={currentFilter === filter.key ? 'solid' : 'flat'}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
