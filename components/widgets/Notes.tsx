'use client'

import type { AssignmentNoteCollectionParams, AssignmentNoteCreationBody } from "@/types";
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
    useDisclosure
} from "@heroui/react";
import { useAssignmentNotes, useCreateAssignmentNote, useDeleteAssignmentNote } from "@hooks";
import { parseFormData } from "@lib";
import { AssignmentNote } from "@prisma/client";
import { FormEvent, useEffect, useRef, useState } from "react";

const PREDEFINED_NOTES = ["needs blankets", "broken lamp", "broken bed"];
const OTHER = "Write yourself";

export function Notes({
    assignmentId,
    hotelId,
    userId,
    isDisabled = false
}: AssignmentNoteCollectionParams & { isDisabled?: boolean } & { userId: string }) {
    const { isOpen, onOpen, onOpenChange, onClose, isControlled } = useDisclosure();

    const { mutateAsync: add } = useCreateAssignmentNote({ assignmentId, hotelId });
    const { mutateAsync: deleteNote } = useDeleteAssignmentNote({ assignmentId, hotelId });
    const { data: notes } = useAssignmentNotes({ assignmentId, hotelId });
    const [isOther, setIsOther] = useState<boolean>(false)

    const FORM = "notes_form";
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const inputRefBase = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (isOpen) return;
        setIsOther(false)
    }, [isOther, isOpen])

    const handleAddNote = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const data = parseFormData<AssignmentNoteCreationBody>(e.currentTarget, { content: "" });

        if (!data.content?.trim()) {
            addToast({ title: "Empty note!", description: "You submitted an empty note!", color: "warning" });
            return;
        }

        try {
            await add(data);
            addToast({ title: "Note added!", description: "Note created successfully", color: "success" });
        } catch (err) {
            console.error(err);
            addToast({ title: "Error!", description: "Note could not be created", color: "danger" });
        }
    };

    const handleDelete = async (assignmentNote: AssignmentNote) => {
        try {
            if (assignmentNote.authorId !== userId) {
                throw new Error("NOT_AUTHOR");
            }
            await deleteNote({ assignmentNoteId: assignmentNote.id });
            addToast({ title: "Deleted!", description: "Note deleted successfully", color: "success" });
        } catch (err: any) {
            if (err.message === "NOT_AUTHOR") {
                addToast({ title: "Not allowed", description: "Only the author can delete this note", color: "warning" });
            } else {
                console.error(err);
                addToast({ title: "Error!", description: "Note deletion failed", color: "danger" });
            }
        }
    };

    return (
        <>
            <Button color="secondary" onPress={onOpen} isDisabled={isDisabled}>
                Notes
            </Button>

            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Assignment Notes</ModalHeader>
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
                                                setIsOther(true)
                                            } else {
                                                setIsOther(false)
                                            }
                                        }}
                                    >
                                        {[...PREDEFINED_NOTES, OTHER].map((note) => (
                                            <SelectItem key={note}>{note}</SelectItem>
                                        ))}
                                    </Select>

                                    <Textarea
                                        ref={inputRef}
                                        baseRef={inputRefBase}
                                        className={isOther ? "" : "hidden"}
                                        form={FORM}
                                        label="Custom note"
                                        name="content"
                                        placeholder="Write your note"
                                        type="text"
                                        isDisabled={!isOther}
                                        maxLength={30}
                                        size="sm"
                                        endContent={<span>{inputRef.current?.value.length}/30</span>}
                                    />
                                </Form>

                                <div className="flex flex-wrap gap-2 bg-primary-50 border border-primary-600 rounded-lg p-2 min-h-12">
                                    {notes?.map((assignmentNote) => (
                                        <Chip
                                            key={assignmentNote.id}
                                            className="px-2 py-5 text-medium border-1 border-default"
                                            color="secondary"
                                            size="md"
                                            radius="sm"
                                            onClose={() => handleDelete(assignmentNote)}
                                            isCloseable
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
                                <Button color="primary" type="submit" form={FORM}>
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
