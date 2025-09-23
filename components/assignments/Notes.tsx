'use client'

import type { AssignmentNoteCollectionParams, AssignmentNoteCreationBody } from "@/types";
import {
    addToast,
    Button,
    Chip,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem,
    useDisclosure
} from "@heroui/react";
import { useAssignmentNotes, useCreateAssignmentNote, useDeleteAssignmentNote } from "@hooks";
import { parseFormData } from "@lib";
import { AssignmentNote } from "@prisma/client";
import { FormEvent, useState } from "react";


export function Notes({ assignmentId, hotelId, userId, isDisabled = false }: AssignmentNoteCollectionParams & { isDisabled?: boolean } & { userId: string }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const { mutateAsync: add } = useCreateAssignmentNote({ assignmentId, hotelId });
    const { mutateAsync: deleteNote } = useDeleteAssignmentNote({ assignmentId, hotelId });
    const { data: notes } = useAssignmentNotes({ assignmentId, hotelId })

    const FORM = "notes_form"
    const OTHER = "Write yourself"
    const [isOther, setIsOther] = useState<boolean>(false)

    const predifinedNotes = [
        "needs blankets",
        "broken lamp",
        "broken bed"
    ]

    const handleAddNote = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const data = parseFormData<AssignmentNoteCreationBody>(e.currentTarget, { content: "" });
        try {
            if (data.content === "") return
            await add(data);
            onClose();
            setIsOther(false)
            addToast({
                title: "Assignment Created!",
                description: `Assignment created successfully`,
                color: "success",
            });
        } catch (e: unknown) {
            if (e instanceof Error && e.message === "EMPTY_NOTE") {
                addToast({
                    title: "Empty note!",
                    description: `You submitted an empty note!`,
                    color: "warning",
                });
                return;
            }
            console.error(e);
            addToast({
                title: "Assignment could not be created!",
                description: `Assignment creation failed`,
                color: "danger",
            });
            setIsOther(false)
            onClose();
        }
    }


    const handleDelete = async ({ assignmentNote }: { assignmentNote: AssignmentNote }) => {
        try {
            if (assignmentNote.authorId === userId) {
                await deleteNote({ assignmentNoteId: assignmentNote.id })
                addToast({
                    title: "Note deleted successfully!",
                    description: `Note deletion was successfull`,
                    color: "success",
                });
                return;
            }
            throw new Error("NOT_AUTHOR")
        } catch (e: unknown) {
            if ((e as any).message === "NOT_AUTHOR") {
                addToast({
                    title: "You are not the author!",
                    description: `Notes can only be deleted by their author`,
                    color: "warning",
                });
                return;
            }
            console.error(e)
            addToast({
                title: "Note could not be deleted!",
                description: `Note deletion failed`,
                color: "danger",
            });
        }
    }

    return (
        <>
            <Button color="primary" onPress={onOpen} isDisabled={isDisabled}>
                Notes
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >Assignment Notes</ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleAddNote} >
                                    <Select
                                        className="max-w-xs"
                                        form={FORM}
                                        label="Note"
                                        name="content"
                                        onSelectionChange={(e) => { setIsOther(e.currentKey === OTHER) }}
                                        placeholder="Choose a note or other"
                                    >
                                        {
                                            [...predifinedNotes, OTHER].map(
                                                note => <SelectItem key={note}>{note}</SelectItem>
                                            )
                                        }
                                    </Select>
                                    <Input
                                        className="max-w-xs"
                                        disabled={!isOther}
                                        form={FORM}
                                        label="Custom note"
                                        name="content"
                                        placeholder="Write your note"
                                        type="text"
                                    />
                                </Form>
                                <div className="flex gap-1 bg-lime-600 h-full py-2 px-1 rounded-xl flex-wrap">
                                    {
                                        notes?.map(
                                            assignmentNote =>
                                            (
                                                <Chip
                                                    key={assignmentNote.id}
                                                    color="secondary"
                                                    avatar
                                                    size="md"
                                                    onClose={async () => { await handleDelete({ assignmentNote }) }}
                                                    isCloseable
                                                >
                                                    {assignmentNote.content}
                                                </Chip>
                                            )
                                        )
                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" form={FORM}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
