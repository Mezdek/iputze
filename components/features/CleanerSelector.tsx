'use client';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { type Key, memo } from 'react';

import type { CleanerWithTasks } from '@/types';

interface CleanerSelectorProps {
  cleaners: CleanerWithTasks[];
  selectedCleanerId: string | null;
  onSelect: (cleanerId: string | null) => void;
}

export const CleanerSelector = memo(function CleanerSelector({
  cleaners,
  selectedCleanerId,
  onSelect,
}: CleanerSelectorProps) {
  const selectedCleaner = cleaners.find((c) => c.id === selectedCleanerId);

  const handleAction = (key: Key) => {
    const keyStr = key.toString();
    if (keyStr === 'manage') {
      // Handle navigation to cleaners management
      return;
    }
    onSelect(keyStr);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="min-w-[200px] justify-between"
          color="primary"
          size="sm"
          variant="flat"
        >
          {selectedCleaner ? (
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: selectedCleaner.color }}
              >
                {selectedCleaner.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{selectedCleaner.name}</span>
            </div>
          ) : (
            'Select Cleaner'
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Cleaner selection"
        selectedKeys={selectedCleanerId ? [selectedCleanerId] : []}
        selectionMode="single"
        onAction={handleAction}
      >
        <>
          {cleaners.map(({ id, name, tasksThisWeek, color }) => (
            <DropdownItem key={id} textValue={name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: color }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground">{name}</span>
                <span className="ml-auto text-xs text-default-500">
                  [{tasksThisWeek.length}]
                </span>
              </div>
            </DropdownItem>
          ))}
          <DropdownItem key="manage" textValue="View all cleaners">
            View all cleaners
          </DropdownItem>
        </>
      </DropdownMenu>
    </Dropdown>
  );
});
