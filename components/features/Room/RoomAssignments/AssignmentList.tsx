'use client';

import { AssignmentItem } from '@components';
import { Card, CardBody } from '@heroui/react';
import type { AssignmentStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import type { TAssignmentResponse } from '@/types';

interface AssignmentListProps {
  assignments: TAssignmentResponse[];
  onAssignmentClick?: (assignment: TAssignmentResponse) => void;
  emptyMessage?: string;
  filterStatus?: AssignmentStatus;
}

export function AssignmentList({
  assignments,
  onAssignmentClick,
  emptyMessage,
  filterStatus,
}: AssignmentListProps) {
  const t = useTranslations('assignment');

  // Filter assignments if filterStatus is provided
  const filteredAssignments = filterStatus
    ? assignments.filter((a) => a.status === filterStatus)
    : assignments;

  // Sort by priority (descending) then by dueAt (ascending)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Then by due date
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });

  if (sortedAssignments.length === 0) {
    return (
      <Card className="shadow-none bg-default-50">
        <CardBody>
          <p className="text-center text-default-500 py-8">
            {emptyMessage ||
              t('list.empty', { default: 'No assignments found' })}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedAssignments.map((assignment) => (
        <AssignmentItem
          assignment={assignment}
          key={assignment.id}
          onClick={onAssignmentClick}
        />
      ))}
    </div>
  );
}
