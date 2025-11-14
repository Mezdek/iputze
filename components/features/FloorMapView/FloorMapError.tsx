'use client';

import { Button, Card } from '@heroui/react';
import { memo } from 'react';

interface FloorMapErrorProps {
  error: Error;
  onRetry?: () => void;
}

export const FloorMapError = memo(function FloorMapError({
  error,
  onRetry,
}: FloorMapErrorProps) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="max-w-md p-6">
        <div className="text-center space-y-4">
          <div className="text-danger text-5xl">⚠️</div>
          <h3 className="text-xl font-bold text-foreground">
            Failed to Load Floor Map
          </h3>
          <p className="text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
          {onRetry && (
            <Button color="primary" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
});
