'use client';

import { Spinner } from '@heroui/react';
import type { ReactNode } from 'react';

export function ListRenderer<T>({
  data,
  isLoading,
  children,
}: {
  data?: T[] | null;
  isLoading?: boolean;
  children: (item: T) => ReactNode;
}) {
  if (isLoading) return <Spinner />;
  if (!data || data.length === 0) return <></>;
  return (
    <div className="flex gap-4 w-full p-2 h-full flex-wrap">
      {data.map(children)}
    </div>
  );
}
