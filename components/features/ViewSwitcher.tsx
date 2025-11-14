'use client';

import { Button } from '@heroui/react';

import {
  ROOM_VIEW_LABELS,
  ROOM_VIEWS,
  type TRoomView,
} from '@/lib/shared/constants';

export function ViewSwitcher({
  setView,
  view,
}: {
  setView: (view: TRoomView) => void;
  view: TRoomView;
}) {
  const RoomViews = Object.keys(ROOM_VIEWS) as TRoomView[];

  return (
    <div className="bg-default-200 flex flex-row flex-nowrap p-1 gap-2 rounded-2xl">
      {RoomViews.map((roomView, i, { length }) => (
        <Button
          className={`p-3 w-1/3
            ${roomView === view ? 'bg-success-400' : 'bg-default-200'}
            ${i === 0 ? 'rounded-r-none' : i === length - 1 ? 'rounded-l-none' : 'rounded-none'}
            `}
          key={i}
          onPress={() => setView(roomView)}
        >
          {ROOM_VIEW_LABELS[roomView]}
        </Button>
      ))}
    </div>
  );
}
