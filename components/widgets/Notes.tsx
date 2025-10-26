'use client';

//TODO add showErrorToast here
//TODO replace all strings with constants

import {
  addToast,
  Button,
  Chip,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  useAssignmentNotes,
  useCreateAssignmentNote,
  useDeleteAssignmentNote,
} from '@hooks';
import { parseFormData } from '@lib/shared';
import type { AssignmentNote } from '@prisma/client';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type {
  AssignmentNoteCollectionParams,
  AssignmentNoteCreationBody,
} from '@/types';

const PREDEFINED_NOTES = ['needs blankets', 'broken lamp', 'broken bed'];
const OTHER = 'Write yourself';
const MAX_NOTE_LENGTH = 30;

export function Notes({
  assignmentId,
  hotelId,
  userId,
  isDisabled = false,
}: AssignmentNoteCollectionParams & { isDisabled?: boolean } & {
  userId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutateAsync: add } = useCreateAssignmentNote({
    assignmentId,
    hotelId,
  });
  const { mutateAsync: deleteNote } = useDeleteAssignmentNote({
    assignmentId,
    hotelId,
  });
  const { data: notes } = useAssignmentNotes({ assignmentId, hotelId });
  const [isOther, setIsOther] = useState<boolean>(false);

  const FORM = 'notes_form';
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputRefBase = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) return;
    setIsOther(false);
  }, [isOther, isOpen]);

  const handleAddNote = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const data = parseFormData<AssignmentNoteCreationBody>(e.currentTarget, {
      content: '',
    });

    if (!data.content?.trim()) {
      addToast({
        title: 'Empty note!',
        description: 'You submitted an empty note!',
        color: 'warning',
      });
      return;
    }

    try {
      await add(data);
      addToast({
        title: 'Note added!',
        description: 'Note created successfully',
        color: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      addToast({
        title: 'Error!',
        description: 'Note could not be created',
        color: 'danger',
      });
    }
  };

  const handleDelete = async (assignmentNote: AssignmentNote) => {
    try {
      await deleteNote({ assignmentNoteId: assignmentNote.id });
      addToast({
        title: 'Deleted!',
        description: 'Note deleted successfully',
        color: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      addToast({
        title: 'Error!',
        description: 'Note deletion failed',
        color: 'danger',
      });
    }
  };

  return (
    <>
      <Button color="secondary" isDisabled={isDisabled} onPress={onOpen}>
        Notes
      </Button>

      <Modal
        disableAnimation
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Assignment Notes
              </ModalHeader>
              <ModalBody>
                <Form id={FORM} onSubmit={handleAddNote}>
                  <Select
                    form={FORM}
                    label="Note"
                    name="content"
                    placeholder="Choose a note or other"
                    onSelectionChange={(e) => {
                      if (e.currentKey === OTHER) {
                        setTimeout(() => inputRef.current?.focus(), 50);
                        setIsOther(true);
                      } else {
                        setIsOther(false);
                      }
                    }}
                  >
                    {[...PREDEFINED_NOTES, OTHER].map((note) => (
                      <SelectItem key={note}>{note}</SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    baseRef={inputRefBase}
                    className={isOther ? '' : 'hidden'}
                    endContent={
                      <span>
                        {inputRef.current?.value.length}/{MAX_NOTE_LENGTH}
                      </span>
                    }
                    form={FORM}
                    isDisabled={!isOther}
                    label="Custom note"
                    maxLength={MAX_NOTE_LENGTH}
                    name="content"
                    placeholder="Write your note"
                    ref={inputRef}
                    size="sm"
                    type="text"
                  />
                </Form>

                <div className="flex flex-wrap gap-2 bg-primary-50 border border-primary-600 rounded-lg p-2 min-h-12">
                  {notes?.map((assignmentNote) => (
                    <Chip
                      isCloseable
                      className="px-2 py-5 text-medium border-1 border-default"
                      color="secondary"
                      key={assignmentNote.id}
                      radius="sm"
                      size="md"
                      onClose={() => handleDelete(assignmentNote)}
                    >
                      {assignmentNote.content}
                    </Chip>
                  ))}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="warning" variant="solid" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" form={FORM} type="submit">
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
