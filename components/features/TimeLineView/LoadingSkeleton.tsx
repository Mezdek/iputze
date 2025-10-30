'use client';
import { Skeleton } from '@heroui/react';
import { memo } from 'react';

export const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2 h-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          className="flex flex-col border rounded-lg overflow-hidden bg-content1"
          key={i}
        >
          <Skeleton className="h-16 rounded-none" />
          <div className="flex-1 p-2 space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton className="h-16 rounded-lg" key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
