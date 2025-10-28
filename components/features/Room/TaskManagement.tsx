'use client';
import { TasksList } from '@components';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { capitalize } from '@lib/shared';
import { AssignmentStatus } from '@prisma/client';
import { type HTMLAttributes, useState } from 'react';

import type { TAssignmentResponse } from '@/types';

export function TaskManagement({
  tasks,
  ...props
}: { tasks: TAssignmentResponse[] } & HTMLAttributes<HTMLDivElement>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState<AssignmentStatus | undefined>();
  const allStatuses = [undefined, ...Object.values(AssignmentStatus)];
  const pendingTasks = tasks.filter(
    (task) => task.status === AssignmentStatus.PENDING
  );
  const activeTasks = tasks.filter(
    (task) => task.status === AssignmentStatus.IN_PROGRESS
  );

  const handleClick = (status?: AssignmentStatus) => {
    setStatus(status);
    onOpen();
  };
  const { className, ...rest } = props;
  return (
    <>
      <div className={`grid grid-cols-2 gap-2 w-full ${className}`} {...rest}>
        <Button
          className="flex flex-col items-start rounded p-8"
          variant="light"
          onPress={() => handleClick('IN_PROGRESS')}
        >
          <p className="font-bold">{activeTasks.length}</p>
          <p className="text-xs">Active Tasks</p>
        </Button>
        <Button
          className="flex flex-col items-start rounded p-8"
          variant="light"
          onPress={() => handleClick('PENDING')}
        >
          <p className="font-bold">{pendingTasks.length}</p>
          <p className="text-xs">Pending Tasks</p>
        </Button>
      </div>
      <Modal
        className="max-h-2/3"
        isOpen={isOpen}
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-4">
            <div>Manage Assignments</div>
            <div className="flex gap-1">
              {allStatuses.map((st, index) => {
                return (
                  <Button
                    className="w-fit min-w-fit p-1"
                    color={status === st ? 'success' : 'default'}
                    key={index}
                    variant="bordered"
                    onPress={() => {
                      setStatus(st);
                    }}
                  >
                    {capitalize(st, '_', 'ALL_WORDS', 'All')}
                  </Button>
                );
              })}
            </div>
          </ModalHeader>
          <ModalBody>
            <TasksList status={status} tasks={tasks} />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
