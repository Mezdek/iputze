'use client';
import {
  Avatar,
  AvatarGroup,
  Button,
  type ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { capitalize, datefy } from '@lib/shared';

import type { TAssignmentResponse } from '@/types';

export function TaskDetails({
  task,
  className,
  ...props
}: { task: TAssignmentResponse } & ButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    id,
    actualMinutes,
    assignedBy,
    cancelledAt,
    cleaners,
    completedAt,
    createdAt,
    dueAt,
    estimatedMinutes,
    notes,
    priority,
    startedAt,
    status,
  } = task;
  return (
    <>
      {
        <Button
          isIconOnly
          className={`italic ${className}`}
          onPress={onOpen}
          {...props}
        >
          i
        </Button>
      }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Assignment Details</ModalHeader>
          <ModalBody className="p-0">
            <Table
              hideHeader
              aria-label="static collection table"
              classNames={{ wrapper: 'shadow-none' }}
            >
              <TableHeader>
                <TableColumn align="end">TYPE</TableColumn>
                <TableColumn>VALUE</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>{id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    {capitalize(status, '_', 'FIRST_WORD_ONLY')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Assigned by</TableCell>
                  <TableCell>{assignedBy?.name ?? 'Deleted Account'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created at</TableCell>
                  <TableCell>{datefy(createdAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Actual minutes</TableCell>
                  <TableCell>{actualMinutes || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Completed at</TableCell>
                  <TableCell>{datefy(completedAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cancelled at</TableCell>
                  <TableCell>{datefy(cancelledAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Due at</TableCell>
                  <TableCell>{datefy(dueAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated minutes</TableCell>
                  <TableCell>{estimatedMinutes ?? 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Priority</TableCell>
                  <TableCell>{priority}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Started at</TableCell>
                  <TableCell>{datefy(startedAt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Notes</TableCell>
                  <TableCell>
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <Tooltip
                          content={
                            <>
                              <p>authorId:{note.authorId}</p>
                              <p>createdAt:{datefy(note.createdAt)}</p>
                            </>
                          }
                          key={note.id}
                        >
                          <p>{note.content}</p>
                        </Tooltip>
                      ))
                    ) : (
                      <p>There are no notes avaialbe</p>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cleaners</TableCell>
                  <TableCell>
                    <AvatarGroup className="mt-2" size="sm">
                      {cleaners.map(({ id, name, avatarUrl }) => (
                        <Tooltip content={name} key={id}>
                          <Avatar name={name} src={avatarUrl ?? undefined} />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
