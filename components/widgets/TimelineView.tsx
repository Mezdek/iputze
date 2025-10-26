'use client';

import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@heroui/react';
import { useAssignments } from '@hooks';
import { AssignmentStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import { memo, useCallback, useMemo, useState } from 'react';

import type { TAssignmentResponse } from '@/types';

// ==================== TYPES ====================

interface CleanerWithTasks {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  color: string;
  tasksThisWeek: TAssignmentResponse[];
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  cleaners: CleanerWithTasks[];
  tasks: TAssignmentResponse[];
}

type ViewMode = 'overview' | 'selected';
type StatusFilterType = 'all' | AssignmentStatus;

// ==================== CONSTANTS ====================

const CLEANER_COLORS = [
  '#3498db',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#e74c3c',
  '#16a085',
  '#2980b9',
  '#8e44ad',
] as const;

const STATUS_COLORS = {
  [AssignmentStatus.PENDING]: {
    border: 'border-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
  },
  [AssignmentStatus.IN_PROGRESS]: {
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
  [AssignmentStatus.COMPLETED]: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  [AssignmentStatus.CANCELLED]: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
} as const;

const PRIORITY_COLORS = {
  0: null,
  1: '#f39c12',
  2: '#e74c3c',
} as const;

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// ==================== UTILITY FUNCTIONS ====================

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    return day;
  });
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatTime(date: Date | string | null): string {
  if (!date) return '--:--';
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  const endStr = end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
}

// ==================== MAIN COMPONENT ====================

export function WeeklyTimelineView() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: assignments, isLoading, error } = useAssignments({ hotelId });

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  const viewMode: ViewMode = selectedCleanerId ? 'selected' : 'overview';

  // ==================== OPTIMIZED DATA PROCESSING ====================

  // 1. Calculate week boundaries once
  const weekBoundaries = useMemo(() => {
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }, [currentWeekStart]);

  // 2. Filter assignments by week FIRST (reduces data to process)
  const weekAssignments = useMemo(() => {
    if (!assignments) return [];

    return assignments.filter((assignment) => {
      const assignmentDate = new Date(assignment.dueAt);
      return (
        assignmentDate >= weekBoundaries.start &&
        assignmentDate < weekBoundaries.end
      );
    });
  }, [assignments, weekBoundaries]);

  // 3. Apply status filter
  const filteredAssignments = useMemo(() => {
    if (statusFilter === 'all') return weekAssignments;
    return weekAssignments.filter((a) => a.status === statusFilter);
  }, [weekAssignments, statusFilter]);

  // 4. Build cleaners map (only from filtered assignments)
  const cleanersMap = useMemo(() => {
    const map = new Map<string, CleanerWithTasks>();

    filteredAssignments.forEach((assignment) => {
      assignment.cleaners.forEach(({ id, name, email, avatarUrl }) => {
        if (!map.has(id)) {
          map.set(id, {
            id,
            name,
            email,
            avatarUrl,
            color: CLEANER_COLORS[map.size % CLEANER_COLORS.length],
            tasksThisWeek: [],
          });
        }
        map.get(id)!.tasksThisWeek.push(assignment);
      });
    });

    return map;
  }, [filteredAssignments]);

  // 5. Get sorted cleaners list
  const cleanersList = useMemo(() => {
    return Array.from(cleanersMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [cleanersMap]);

  // 6. Get week days (memoized)
  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  // 7. Build day data (optimized grouping)
  const weekData = useMemo((): DayData[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group assignments by date string for O(1) lookup
    const assignmentsByDate = new Map<string, TAssignmentResponse[]>();
    filteredAssignments.forEach((assignment) => {
      const dateKey = new Date(assignment.dueAt).toDateString();
      if (!assignmentsByDate.has(dateKey)) {
        assignmentsByDate.set(dateKey, []);
      }
      assignmentsByDate.get(dateKey)!.push(assignment);
    });

    return weekDays.map((date, index) => {
      const dateKey = date.toDateString();
      const dayTasks = assignmentsByDate.get(dateKey) || [];

      // Filter by selected cleaner if in selected mode
      const visibleTasks =
        viewMode === 'selected' && selectedCleanerId
          ? dayTasks.filter((task) =>
              task.cleaners.some((c) => c.id === selectedCleanerId)
            )
          : dayTasks;

      // Get unique cleaners for this day
      const cleanerIds = new Set<string>();
      visibleTasks.forEach((task) => {
        task.cleaners.forEach((cleaner) => cleanerIds.add(cleaner.id));
      });

      const dayCleaners = Array.from(cleanerIds)
        .map((id) => cleanersMap.get(id)!)
        .filter(Boolean);

      return {
        date,
        dayName: DAY_NAMES[index],
        dayNumber: date.getDate(),
        isToday: isSameDay(date, today),
        isWeekend: index >= 5,
        cleaners: dayCleaners,
        tasks: visibleTasks,
      };
    });
  }, [weekDays, filteredAssignments, viewMode, selectedCleanerId, cleanersMap]);

  // ==================== HANDLERS (MEMOIZED) ====================

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() - 7);
      return newStart;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() + 7);
      return newStart;
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeekStart(getWeekStart(new Date()));
  }, []);

  const handleCleanerSelect = useCallback((cleanerId: string | null) => {
    setSelectedCleanerId(cleanerId);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCleanerId(null);
  }, []);

  const handleStatusChange = useCallback((status: StatusFilterType) => {
    setStatusFilter(status);
  }, []);

  // ==================== RENDER ====================

  if (error) {
    return (
      <Card className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            ⚠️ Failed to load assignments
          </p>
          <Button onPress={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    );
  }

  const weekEnd = new Date(weekBoundaries.start);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-lg p-4 shadow-sm">
        {/* Left: Cleaner Selection */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CleanerDropdown
            cleaners={cleanersList}
            selectedCleanerId={selectedCleanerId}
            onSelect={handleCleanerSelect}
          />
          {selectedCleanerId && (
            <Button size="sm" variant="flat" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>

        {/* Right: Week Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onClick={handlePreviousWeek}
          >
            ←
          </Button>
          <span className="text-sm font-medium whitespace-nowrap px-2">
            {formatDateRange(weekBoundaries.start, weekEnd)}
          </span>
          <Button isIconOnly size="sm" variant="flat" onClick={handleNextWeek}>
            →
          </Button>
          <Button size="sm" variant="flat" onClick={handleToday}>
            Today
          </Button>
        </div>
      </div>

      {/* STATUS FILTER */}
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={handleStatusChange}
      />

      {/* TIMELINE GRID */}
      <Card className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-7 gap-2 min-h-full">
            {weekData.map((day) => (
              <DayColumn
                day={day}
                key={day.date.toISOString()}
                viewMode={viewMode}
                onChipClick={handleCleanerSelect}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ==================== SUB-COMPONENTS (MEMOIZED) ====================

interface CleanerDropdownProps {
  cleaners: CleanerWithTasks[];
  selectedCleanerId: string | null;
  onSelect: (cleanerId: string | null) => void;
}

const CleanerDropdown = memo(function CleanerDropdown({
  cleaners,
  selectedCleanerId,
  onSelect,
}: CleanerDropdownProps) {
  const selectedCleaner = cleaners.find((c) => c.id === selectedCleanerId);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="w-full sm:w-[200px]" variant="bordered">
          {selectedCleaner ? selectedCleaner.name : 'Select cleaner...'}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Cleaner selection"
        onAction={(key) => onSelect(key as string)}
      >
        <>
          {cleaners.map(({ id, name, tasksThisWeek, color }) => (
            <DropdownItem key={id} textValue={name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: color }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <span>{name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  [{tasksThisWeek.length}]
                </span>
              </div>
            </DropdownItem>
          ))}
          <DropdownItem key="manage" textValue="View all cleaners">
            View all cleaners
          </DropdownItem>
        </>
      </DropdownMenu>
    </Dropdown>
  );
});

interface StatusFilterProps {
  currentFilter: StatusFilterType;
  onFilterChange: (status: StatusFilterType) => void;
}

const StatusFilter = memo(function StatusFilter({
  currentFilter,
  onFilterChange,
}: StatusFilterProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm overflow-x-auto">
      <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={currentFilter === 'all' ? 'solid' : 'flat'}
          onClick={() => onFilterChange('all')}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={
            currentFilter === AssignmentStatus.PENDING ? 'solid' : 'flat'
          }
          onClick={() => onFilterChange(AssignmentStatus.PENDING)}
        >
          Pending
        </Button>
        <Button
          size="sm"
          variant={
            currentFilter === AssignmentStatus.IN_PROGRESS ? 'solid' : 'flat'
          }
          onClick={() => onFilterChange(AssignmentStatus.IN_PROGRESS)}
        >
          In Progress
        </Button>
        <Button
          size="sm"
          variant={
            currentFilter === AssignmentStatus.COMPLETED ? 'solid' : 'flat'
          }
          onClick={() => onFilterChange(AssignmentStatus.COMPLETED)}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});

interface DayColumnProps {
  day: DayData;
  viewMode: ViewMode;
  onChipClick: (cleanerId: string) => void;
}

const DayColumn = memo(function DayColumn({
  day,
  viewMode,
  onChipClick,
}: DayColumnProps) {
  const totalTasks = day.tasks.length;
  const uniqueCleaners = day.cleaners.length;

  return (
    <div
      className={`flex flex-col border rounded-lg overflow-hidden ${
        day.isWeekend ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      {/* Day Header */}
      <div
        className={`p-2 text-center border-b ${
          day.isToday
            ? 'bg-primary-500 text-white font-semibold'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        <div className="text-xs">{day.dayName}</div>
        <div className="text-lg font-bold">{day.dayNumber}</div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {viewMode === 'overview' ? (
          day.cleaners.length > 0 ? (
            day.cleaners.map((cleaner) => {
              const cleanerTasksToday = day.tasks.filter((task) =>
                task.cleaners.some(({ id }) => id === cleaner.id)
              );
              return (
                <CleanerChip
                  cleaner={cleaner}
                  key={cleaner.id}
                  taskCount={cleanerTasksToday.length}
                  onClick={() => onChipClick(cleaner.id)}
                />
              );
            })
          ) : (
            <EmptyDayState mode="overview" />
          )
        ) : day.tasks.length > 0 ? (
          day.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <EmptyDayState mode="selected" />
        )}
      </div>

      {/* Footer Stats */}
      {viewMode === 'overview' && totalTasks > 0 && (
        <div className="p-2 text-xs text-center border-t bg-gray-50 text-gray-600">
          <div>{totalTasks} tasks</div>
          <div>{uniqueCleaners} cleaners</div>
        </div>
      )}
    </div>
  );
});

interface CleanerChipProps {
  cleaner: CleanerWithTasks;
  taskCount: number;
  onClick: () => void;
}

const CleanerChip = memo(function CleanerChip({
  cleaner,
  taskCount,
  onClick,
}: CleanerChipProps) {
  return (
    <button
      className="w-full flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
      title={`Click to view ${cleaner.name}'s schedule`}
      onClick={onClick}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: cleaner.color }}
      >
        {cleaner.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium truncate">{cleaner.name}</div>
      </div>
      <div className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold flex-shrink-0">
        {taskCount}
      </div>
    </button>
  );
});

interface TaskCardProps {
  task: TAssignmentResponse;
}

const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  const statusStyle = STATUS_COLORS[task.status];
  const priorityColor =
    PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS];
  const timeStr = formatTime(task.startedAt || task.dueAt);

  const assignedNames = task.cleaners.map(({ name }) => name).join(', ');

  const roomTypeText = task.room.type
    ? `${task.room.type}${task.room.floor ? `, Floor ${task.room.floor}` : ''}`
    : task.room.floor
      ? `Floor ${task.room.floor}`
      : 'No details';

  return (
    <Tooltip content={roomTypeText}>
      <div
        className={`p-3 rounded-lg border-2 ${statusStyle.border} ${statusStyle.bg} cursor-pointer hover:shadow-md transition-all`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {priorityColor && (
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: priorityColor }}
                title={task.priority === 2 ? 'Urgent' : 'High priority'}
              />
            )}
            <span className="font-bold text-sm">Room {task.room.number}</span>
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-2">{timeStr}</div>

        <div
          className="text-xs text-gray-700 mb-2 truncate"
          title={assignedNames}
        >
          {assignedNames}
        </div>

        <div
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusStyle.text}`}
        >
          {task.status.replace('_', ' ')}
        </div>
      </div>
    </Tooltip>
  );
});

interface EmptyDayStateProps {
  mode: 'overview' | 'selected';
}

const EmptyDayState = memo(function EmptyDayState({
  mode,
}: EmptyDayStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-400">
      <p className="text-xs mb-2">
        {mode === 'overview' ? 'No tasks scheduled' : 'No tasks'}
      </p>
      <Button className="text-xs" size="sm" variant="flat">
        + Assign Task
      </Button>
    </div>
  );
});

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2 h-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          className="flex flex-col border rounded-lg overflow-hidden bg-white"
          key={i}
        >
          <div className="p-2 bg-gray-100 h-16 animate-pulse" />
          <div className="flex-1 p-2 space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                className="h-16 bg-gray-200 rounded-lg animate-pulse"
                key={j}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
