import { AssignmentNoteCreationBody, AssignmentResponse } from "@apptypes";
import { parseFormData } from "@helpers";
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
import { useAssignmentNotes, useCreateAssignmentNote, useMe, useRooms } from "@hooks";
import { FormEvent, useState } from "react";


export function AddNote({ assignment }: { assignment: AssignmentResponse }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { room: { hotelId }, id: assignmentId } = assignment;
    const { data: rooms } = useRooms({ hotelId });
    const { mutateAsync: add } = useCreateAssignmentNote({ assignmentId, hotelId });
    const { data: assignmentNotes } = useAssignmentNotes({ assignmentId, hotelId })
    const { data: user } = useMe();

    const FORM = "notes_form"
    const OTHER = "Write yourself"
    const [isOther, setIsOther] = useState<boolean>(false)
    // const [assignmentNotes, setAssignmentNotes] = useState<AssignmentNote[]>([])

    const handleAddNote = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!user) return
        const data = parseFormData<AssignmentNoteCreationBody>(e.currentTarget, { content: "" });
        try {
            // setAssignmentNotes(e => [...e, { assignmentId, authorId: user.id, content: data.content, createdAt: new Date(), updatedAt: new Date(), id: (Math.random() * 7653928).toString() }])
            await add(data);
            onClose();
            setIsOther(false)
            addToast({
                title: "Assignment Created!",
                description: `Assignment created successfully`,
                color: "success",
            });
        } catch (e: unknown) {
            console.error(e);
            addToast({
                title: "Assignment could not be created!",
                description: `Assignment creation failed`,
                color: "danger",
            });
            return;
        }
    }

    const notes = [
        "needs blankets",
        "broken lamp",
        "broken bed"
    ]

    return (
        <>
            <Button color="primary" onPress={onOpen} disabled={!rooms}>
                Notes
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >Add Note</ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleAddNote} >
                                    <Select
                                        name="content"
                                        form={FORM}
                                        className="max-w-xs"
                                        label="Note"
                                        onSelectionChange={(e) => { setIsOther(e.currentKey === OTHER) }}
                                        placeholder="Choose a note or other"
                                    >
                                        {
                                            [...notes, OTHER].map(
                                                note => <SelectItem key={note}>{note}</SelectItem>
                                            )
                                        }
                                    </Select>
                                    <Input
                                        name="content"
                                        form={FORM}
                                        className="max-w-xs"
                                        label="Custom note"
                                        placeholder="Write your note"
                                        disabled={!isOther}
                                        type="text"
                                    />
                                </Form>
                                <div className="flex gap-1 bg-lime-600 h-full py-2 px-1 rounded-xl flex-wrap">
                                    {
                                        assignmentNotes?.map(
                                            an =>
                                            (
                                                <Chip
                                                    key={an.id}
                                                    color="secondary"
                                                    avatar
                                                    size="md">
                                                    {an.content}
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
