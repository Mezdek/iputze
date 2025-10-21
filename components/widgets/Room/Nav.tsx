'use client';
import { Button } from '@heroui/react';
import type { HTMLAttributes } from 'react';

export function Nav({
  goToOverview,
  ...props
}: {
  goToOverview: (props?: unknown) => void;
} & HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={`grid grid-cols-4 justify-between gap-2 w-full h-1/10 ${className}`}
      {...rest}
    >
      <Button
        className="rounded-tl-full text-default-50 text-xl"
        color="primary"
      >
        X
      </Button>
      <Button
        className="rounded-none col-span-2 text-default-50 text-xl"
        color="primary"
        onPress={goToOverview}
      >
        Overview
      </Button>
      <Button
        className="rounded-tr-full text-default-50 text-xl"
        color="primary"
      >
        Y
      </Button>
    </div>
  );
}
