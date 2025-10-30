import { useRooms, useTasks } from '@hooks';
import { calculateRoomStatus } from '@lib/client';
import { groupByKey } from '@lib/shared';
import { useMemo } from 'react';

import type { FloorMapData, RoomWithStatus, TaskResponse } from '@/types';

interface UseFloorMapDataParams {
  hotelId: string;
  selectedRoomId?: string;
}

/**
 * Custom hook to manage floor map data and task lookups
 * Optimizes performance with O(1) task lookups using Map
 */
export function useFloorMapData({
  hotelId,
  selectedRoomId,
}: UseFloorMapDataParams): FloorMapData {
  const {
    data: rooms,
    isLoading: roomsLoading,
    error: roomsError,
  } = useRooms({ hotelId });

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks({ hotelId });

  // Create task lookup map for O(1) access by room ID
  const tasksByRoomId = useMemo(() => {
    if (!tasks) return new Map<string, TaskResponse[]>();

    return tasks.reduce((map, task) => {
      const roomId = task.room.id;
      const existing = map.get(roomId) ?? [];
      map.set(roomId, [...existing, task]);
      return map;
    }, new Map<string, TaskResponse[]>());
  }, [tasks]);

  // Group rooms by floor and enhance with status information
  const floorsWithStatus = useMemo(() => {
    if (!rooms || rooms.length === 0) return undefined;

    // Group by floor
    const grouped = groupByKey({ items: rooms, key: 'floor' });

    // Enhance each room with status and task count
    return grouped.map((floor) =>
      floor.map((room): RoomWithStatus => {
        const roomTasks = tasksByRoomId.get(room.id) ?? [];
        const status = calculateRoomStatus(room, roomTasks);

        return {
          ...room,
          status,
          taskCount: roomTasks.length,
          tasks: roomTasks,
        };
      })
    );
  }, [rooms, tasksByRoomId]);

  // Get tasks for selected room (memoized for performance)
  const selectedRoomTasks = useMemo(() => {
    if (!selectedRoomId) return [];
    return tasksByRoomId.get(selectedRoomId) ?? [];
  }, [selectedRoomId, tasksByRoomId]);

  // Aggregate loading and error states
  const isLoading = roomsLoading || tasksLoading;
  const error = roomsError || tasksError;

  return {
    floors: floorsWithStatus,
    selectedRoomTasks,
    isLoading,
    error: error ? new Error(String(error)) : null,
    hasRooms: Boolean(rooms && rooms.length > 0),
  };
}
