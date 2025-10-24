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
import { useMemo, useState } from 'react';

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
];

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
};

const PRIORITY_COLORS = {
  0: null, // normal - no indicator
  1: '#f39c12', // high - orange
  2: '#e74c3c', // urgent - red
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ==================== UTILITY FUNCTIONS ====================

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  return new Date(d.setDate(diff));
}

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  return days;
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

  // ==================== DATA PROCESSING ====================

  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  const cleanersMap = useMemo(() => {
    if (!assignments) return new Map<string, CleanerWithTasks>();

    const map = new Map<string, CleanerWithTasks>();

    assignments.forEach((assignment) => {
      // Filter by current week
      const assignmentDate = new Date(assignment.dueAt);
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      if (assignmentDate < currentWeekStart || assignmentDate >= weekEnd) {
        return;
      }

      // Filter by status
      if (statusFilter !== 'all' && assignment.status !== statusFilter) {
        return;
      }

      assignment.cleaners.forEach(({ id, name, email, avatarUrl }) => {
        if (!map.has(id)) {
          map.set(id, {
            id,
            name,
            email,
            avatarUrl,
            color:
              CLEANER_COLORS[map.size % CLEANER_COLORS.length] || '#3498db',
            tasksThisWeek: [],
          });
        }

        map.get(id)!.tasksThisWeek.push(assignment);
      });
    });

    return map;
  }, [assignments, currentWeekStart, statusFilter]);

  const cleanersList = useMemo(() => {
    return Array.from(cleanersMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [cleanersMap]);

  const weekData = useMemo((): DayData[] => {
    const today = new Date();

    return weekDays.map((date, index) => {
      const dayTasks =
        assignments?.filter((assignment) => {
          const assignmentDate = new Date(assignment.dueAt);
          if (!isSameDay(assignmentDate, date)) return false;
          if (statusFilter !== 'all' && assignment.status !== statusFilter)
            return false;

          if (viewMode === 'selected' && selectedCleanerId) {
            return assignment.cleaners.some(
              ({ id }) => id === selectedCleanerId
            );
          }

          return true;
        }) || [];

      const dayCleaners = Array.from(
        new Map(
          dayTasks.flatMap((task) =>
            task.cleaners.map(({ id }) => [id, cleanersMap.get(id)!])
          )
        ).values()
      );

      return {
        date,
        dayName: DAY_NAMES[index],
        dayNumber: date.getDate(),
        isToday: isSameDay(date, today),
        isWeekend: index >= 5,
        cleaners: dayCleaners,
        tasks: dayTasks,
      };
    });
  }, [
    weekDays,
    assignments,
    statusFilter,
    viewMode,
    selectedCleanerId,
    cleanersMap,
  ]);

  // ==================== HANDLERS ====================

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const handleCleanerSelect = (cleanerId: string | null) => {
    setSelectedCleanerId(cleanerId);
  };

  const handleReset = () => {
    setSelectedCleanerId(null);
  };

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

  const weekEnd = new Date(currentWeekStart);
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
            {formatDateRange(currentWeekStart, weekEnd)}
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
      <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm overflow-x-auto">
        <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={statusFilter === 'all' ? 'solid' : 'flat'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={
              statusFilter === AssignmentStatus.PENDING ? 'solid' : 'flat'
            }
            onClick={() => setStatusFilter(AssignmentStatus.PENDING)}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={
              statusFilter === AssignmentStatus.IN_PROGRESS ? 'solid' : 'flat'
            }
            onClick={() => setStatusFilter(AssignmentStatus.IN_PROGRESS)}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={
              statusFilter === AssignmentStatus.COMPLETED ? 'solid' : 'flat'
            }
            onClick={() => setStatusFilter(AssignmentStatus.COMPLETED)}
          >
            Completed
          </Button>
        </div>
      </div>

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

// ==================== SUB-COMPONENTS ====================

interface CleanerDropdownProps {
  cleaners: CleanerWithTasks[];
  selectedCleanerId: string | null;
  onSelect: (cleanerId: string | null) => void;
}

function CleanerDropdown({
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
        aria-label="Cleaner selection Dynamic Actions"
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
}

interface DayColumnProps {
  day: DayData;
  viewMode: ViewMode;
  onChipClick: (cleanerId: string) => void;
}

function DayColumn({ day, viewMode, onChipClick }: DayColumnProps) {
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
          // Overview: Show cleaner chips
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
        ) : // Selected: Show task cards
        day.tasks.length > 0 ? (
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
}

interface CleanerChipProps {
  cleaner: CleanerWithTasks;
  taskCount: number;
  onClick: () => void;
}

function CleanerChip({ cleaner, taskCount, onClick }: CleanerChipProps) {
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
}

interface TaskCardProps {
  task: TAssignmentResponse;
}

function TaskCard({ task }: TaskCardProps) {
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
}

interface EmptyDayStateProps {
  mode: 'overview' | 'selected';
}

function EmptyDayState({ mode }: EmptyDayStateProps) {
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
}

function LoadingSkeleton() {
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
}
