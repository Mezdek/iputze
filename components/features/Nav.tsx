'use client';
import { Button } from '@heroui/react';
import { ROOM_VIEW_LABELS, ROOM_VIEWS, type RoomView } from '@lib/shared';
import type { HTMLAttributes } from 'react';

export function Nav({
  navigate,
  currentView,
  ...props
}: {
  navigate: (view: RoomView) => void;
  currentView?: RoomView;
} & HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const views: { key: RoomView; className: string }[] = [
    { key: ROOM_VIEWS.FLOOR_MAP, className: 'rounded-tl-full' },
    { key: ROOM_VIEWS.OVERVIEW, className: 'rounded-none col-span-2' },
    { key: ROOM_VIEWS.TIMELINE, className: 'rounded-tr-full' },
  ];

  return (
    <div
      className={`grid grid-cols-4 justify-between gap-2 w-full h-1/10 ${className}`}
      {...rest}
    >
      {views.map(({ key, className: btnClassName }) => (
        <Button
          className={`${btnClassName} text-default-50 text-xl`}
          color={currentView === key ? 'secondary' : 'primary'}
          key={key}
          variant={currentView === key ? 'solid' : 'flat'}
          onPress={() => navigate(key)}
        >
          {ROOM_VIEW_LABELS[key]}
        </Button>
      ))}
    </div>
  );
}
