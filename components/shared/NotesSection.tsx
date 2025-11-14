'use client';
import {
  addToast,
  Avatar,
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { useCreateNote, useDeleteNote, useNotes } from '@hooks';
import { useState } from 'react';

import { datefy } from '@/lib/shared/utils/date';
import type { NotesSectionProps, NoteWithAuthor } from '@/types';

const PREDEFINED_NOTES = [
  'needs blankets',
  'broken lamp',
  'broken bed',
  'extra cleaning needed',
];
const OTHER = 'Write yourself';
const MAX_NOTE_LENGTH = 30;

/**
 * NotesSection Component
 * Displays task notes with author info
 * Supports manager upload with author attribution
 */
export function NotesSection({
  viewMode,
  taskId,
  hotelId,
  onNoteAdded,
}: NotesSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedPredefined, setSelectedPredefined] = useState<string>('');
  const [customNote, setCustomNote] = useState('');
  const [isOther, setIsOther] = useState(false);

  const { data: notes } = useNotes({ hotelId, taskId });
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote({
    taskId,
    hotelId,
  });

  const { mutateAsync: deleteNote } = useDeleteNote({
    taskId,
    hotelId,
  });

  const handleAddNote = async () => {
    const content = isOther ? customNote : selectedPredefined;

    if (!content.trim()) {
      addToast({
        title: 'Empty note',
        description: 'Please enter a note',
        color: 'warning',
      });
      return;
    }

    try {
      await createNote({ content });
      setIsAddingNote(false);
      setSelectedPredefined('');
      setCustomNote('');
      setIsOther(false);
      onNoteAdded?.();
    } catch {
      // Error handled by hook
    }
  };

  const handleDelete = async (note: NoteWithAuthor) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote({ noteId: note.id });
    } catch {
      // Error handled by hook
    }
  };

  const canManageNotes = viewMode === 'manager';

  return (
    <div className="flex flex-col gap-3">
      {/* Add Note Form (Manager Only) */}
      {canManageNotes && (
        <Card className="shadow-sm border border-primary/20">
          <CardBody className="gap-3">
            {!isAddingNote ? (
              <Button
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => setIsAddingNote(true)}
              >
                + Add Note
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Select
                  label="Select or write custom note"
                  placeholder="Choose a note"
                  selectedKeys={selectedPredefined ? [selectedPredefined] : []}
                  size="sm"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedPredefined(value);
                    setIsOther(value === OTHER);
                  }}
                >
                  {[...PREDEFINED_NOTES, OTHER].map((note) => (
                    <SelectItem key={note}>{note}</SelectItem>
                  ))}
                </Select>

                {isOther && (
                  <Textarea
                    description={`${customNote.length}/${MAX_NOTE_LENGTH} characters`}
                    label="Custom note"
                    maxLength={MAX_NOTE_LENGTH}
                    placeholder="Write your note"
                    size="sm"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                  />
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    isDisabled={isCreating}
                    size="sm"
                    variant="flat"
                    onClick={() => {
                      setIsAddingNote(false);
                      setSelectedPredefined('');
                      setCustomNote('');
                      setIsOther(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isLoading={isCreating}
                    size="sm"
                    onClick={handleAddNote}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Notes List */}
      {notes ? (
        notes.length === 0 ? (
          <Card className="shadow-none bg-default-50">
            <CardBody>
              <p className="text-center py-8">
                No notes have been added to this task yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={canManageNotes ? handleDelete : undefined}
              />
            ))}
          </div>
        )
      ) : (
        <>Loading</>
      )}
    </div>
  );
}

/**
 * Individual Note Card
 */
function NoteCard({
  note,
  onDelete,
}: {
  note: NoteWithAuthor;
  onDelete?: (note: NoteWithAuthor) => void;
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="gap-3">
        {/* Header: Author + Timestamp */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              showFallback
              name={note.author.name}
              size="sm"
              src={note.author.avatarUrl ?? undefined}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {note.author.name}
              </p>
              <p className="text-xs  ">{datefy(note.createdAt)}</p>
            </div>
          </div>

          {/* Delete Button (Manager Only) */}
          {onDelete && (
            <Button
              isIconOnly
              aria-label="Delete note"
              color="danger"
              size="sm"
              variant="light"
              onPress={() => onDelete(note)}
            >
              ×
            </Button>
          )}
        </div>

        {/* Note Content */}
        <p className="text-sm text-foreground pl-11 whitespace-pre-wrap">
          {note.content}
        </p>
      </CardBody>
    </Card>
  );
}

/**
 * Compact Notes Display for smaller spaces
 */
export function NotesCompact({ notes }: { notes: NoteWithAuthor[] }) {
  if (notes.length === 0) {
    return <p className="text-sm   italic">No notes</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <div className="flex gap-2 text-sm" key={note.id}>
          <Avatar
            className="flex-shrink-0"
            name={note.author.name}
            size="sm"
            src={note.author.avatarUrl ?? undefined}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs">{note.author.name}</p>
            <p className="text-sm text-foreground truncate">{note.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
