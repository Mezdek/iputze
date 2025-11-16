'use client';
import {
  FloorMapView,
  Staff,
  TasksView,
  ViewSwitcher,
  WeeklyTimelineView,
} from '@components';
import { useState } from 'react';

import type { HotelViewProps } from '@/app/hotels/[hotelId]/page';
import { useTasks } from '@/hooks';
import type { TRoomView } from '@/lib/shared/constants/features/room';
import { ROOM_VIEWS } from '@/lib/shared/constants/features/room';
import type { RoomWithContext } from '@/types';

const DEFAULT_VIEW: TRoomView = ROOM_VIEWS.FLOOR_MAP;

export function ManagerView({ user, hotelId }: HotelViewProps) {
  const [room, setRoom] = useState<RoomWithContext>();
  const [view, setView] = useState<TRoomView>(DEFAULT_VIEW);
  const { data: tasks } = useTasks({ hotelId });

  const handleViewSetting = (view: TRoomView | undefined) => {
    switch (view) {
      case ROOM_VIEWS.FLOOR_MAP:
        setRoom(undefined);
        setView(ROOM_VIEWS.FLOOR_MAP);
        break;
      case ROOM_VIEWS.TIMELINE:
        setView(ROOM_VIEWS.TIMELINE);
        break;
      case ROOM_VIEWS.TASKS:
        setView(ROOM_VIEWS.TASKS);
        break;
      case ROOM_VIEWS.CLEANERS:
        setView(ROOM_VIEWS.CLEANERS);
        break;
      default:
        return;
    }
  };
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <ViewSwitcher setView={handleViewSetting} view={view} />
      {view === ROOM_VIEWS.FLOOR_MAP && (
        <FloorMapView
          hotelId={hotelId}
          room={room}
          setRoom={setRoom}
          tasks={tasks}
          user={user}
        />
      )}
      {view === ROOM_VIEWS.TASKS && (
        <TasksView
          taskListClassName="md:grid md:grid-cols-3"
          tasks={tasks}
          user={user}
        />
      )}
      {view === ROOM_VIEWS.TIMELINE && (
        <WeeklyTimelineView hotelId={hotelId} user={user} />
      )}
      {view === ROOM_VIEWS.CLEANERS && <Staff hotelId={hotelId} />}
    </div>
  );
}
