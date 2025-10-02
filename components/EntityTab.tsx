'use client';
import { Spinner } from '@heroui/react';
import type { ReactNode } from 'react';

/**
 * Generic wrapper for hotel tab sections.
 */
interface EntityTabProps {
  isLoading: boolean;
  emptyMessage: string;
  children: ReactNode;
  button?: ReactNode;
}

export function EntityTab({
  isLoading,
  emptyMessage,
  children,
  button,
}: EntityTabProps) {
  return (
    <div className="flex flex-col gap-2 items-center w-full min-h-full">
      <div className="w-full flex justify-end items-center p-2 min-h-16">
        {button}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="w-full">
          {children ?? <p className="text-center italic">{emptyMessage}</p>}
        </div>
      )}
    </div>
  );
}
