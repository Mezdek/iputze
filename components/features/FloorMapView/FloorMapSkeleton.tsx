'use client';

import { Card, Skeleton } from '@heroui/react';
import { memo } from 'react';

export const FloorMapSkeleton = memo(function FloorMapSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 p-2 h-full">
      {/* Map skeleton */}
      <div className="lg:col-span-5 h-full space-y-4">
        {/* Floor sections */}
        {Array.from({ length: 3 }).map((_, floorIdx) => (
          <Card className="p-4" key={floorIdx}>
            <Skeleton className="h-6 w-24 mb-3 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {Array.from({ length: 8 }).map((_, roomIdx) => (
                <Skeleton className="h-24 rounded-lg" key={roomIdx} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Sidebar skeleton */}
      <Card className="lg:col-span-2 p-4 space-y-4">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </Card>
    </div>
  );
});
