import type { AssignmentCollectionParams, AssignmentCreationBody } from "@apptypes";
import {
    addToast,
    Button,
    DatePicker,
    Form,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem,
    useDisclosure
} from "@heroui/react";
import { useCreateAssignment, useRoles, useRooms } from "@hooks";
import { getLocalTimeZone, today } from "@internationalized/date";
import { parseFormData } from "@lib";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { FormEvent } from "react";


export function AssignmentCreation({ hotelId }: AssignmentCollectionParams) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { data: rooms } = useRooms({ hotelId });
    const { data: roles } = useRoles({ hotelId });
    const { mutateAsync: createAssignment } = useCreateAssignment({ hotelId })

    const allCleaners = roles?.filter(({ level, status }) => level === RoleLevel.CLEANER && status === RoleStatus.ACTIVE)

    const handleCreate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const data = parseFormData<AssignmentCreationBody>(e.currentTarget, { cleaners: [], dueAt: new Date(), roomId: "" });
        try {
            await createAssignment(data);
            onClose();
            addToast({
                title: "Assignment Created!",
                description: "Assignment created successfully",
                color: "success",
            });
        } catch (e: unknown) {
            console.error(e);
            addToast({
                title: "Assignment could not be created!",
                description: "Assignment creation failed",
                color: "danger",
            });
            return;
        }
    }


    return (
        <>
            <Button color="primary" onPress={onOpen} disabled={!rooms}>
                Create Assignment
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >New assignment</ModalHeader>
                            <ModalBody>
                                <Form id="assignment_creation_form" onSubmit={handleCreate} >
                                    <Select
                                        name="roomId"
                                        form="assignment_creation_form"
                                        isRequired
                                        className="max-w-xs"
                                        label="Room number"
                                        placeholder="Which room should be cleaned"
                                        errorMessage="Please select a room"
                                    >
                                        {
                                            rooms!.map(
                                                room => (
                                                    <SelectItem key={room.id}>{room.number}</SelectItem>
                                                ))
                                        }
                                    </Select>
                                    <Select
                                        name="cleaners"
                                        isRequired
                                        className="max-w-xs"
                                        label="Cleaners"
                                        placeholder="Who should clean the room"
                                        selectionMode="multiple"
                                        errorMessage="Please select cleaners"
                                    >
                                        {
                                            allCleaners ? allCleaners.map(
                                                cl => (
                                                    <SelectItem key={cl.userId}>{cl.name}</SelectItem>
                                                ))
                                                : <SelectItem key={0}>No Cleaners Available</SelectItem>
                                        }
                                    </Select>
                                    <DatePicker
                                        name="dueAt"
                                        isRequired
                                        minValue={today(getLocalTimeZone())}
                                        defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                                        errorMessage="Please select a due date"
                                    />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" form="assignment_creation_form">
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
