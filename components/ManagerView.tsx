'use client';
import { Room } from '@components';
import { useState } from 'react';

import { FloorMapView } from '@/components/FloorMapView';
import { WeeklyTimelineView } from '@/components/TimelineView';
import type { InjectedAuthProps, RoomWithHotel } from '@/types';

export type TViews = 'FLOOR_MAP' | 'TIMELINE';

export function ManagerView({ user }: InjectedAuthProps) {
  const [room, setRoom] = useState<RoomWithHotel>();

  const [view, setView] = useState<TViews>('FLOOR_MAP');
  const handleNavigate = (view: TViews | undefined) => {
    switch (view) {
      case 'FLOOR_MAP':
        setRoom(undefined);
        setView('FLOOR_MAP');
        break;
      case 'TIMELINE':
        setView('TIMELINE');
        break;
      default:
        return;
    }
  };
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Room.Nav navigate={handleNavigate} />
      {view === 'FLOOR_MAP' ? (
        <FloorMapView room={room} setRoom={setRoom} user={user} />
      ) : (
        <WeeklyTimelineView />
      )}
    </div>
  );
}
