'use client';
import { FloorMapView, Nav, WeeklyTimelineView } from '@components';
import { useState } from 'react';

import type { RoomView } from '@/lib/shared';
import type { InjectedAuthProps, RoomWithHotel } from '@/types';

export type TViews = 'FLOOR_MAP' | 'TIMELINE';

export function ManagerView({ user }: InjectedAuthProps) {
  const [room, setRoom] = useState<RoomWithHotel>();

  const [view, setView] = useState<TViews>('FLOOR_MAP');
  const handleNavigate = (view: RoomView | undefined) => {
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
      <Nav navigate={handleNavigate} />
      {view === 'FLOOR_MAP' ? (
        <FloorMapView room={room} setRoom={setRoom} />
      ) : (
        <WeeklyTimelineView />
      )}
    </div>
  );
}
