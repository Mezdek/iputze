'use client'

import type { AssignmentCollectionParams, AssignmentCreationBody } from "@/types";
import {
    addToast,
    Button,
    DatePicker,
    Form,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
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
    const { mutateAsync: createAssignment } = useCreateAssignment({ hotelId });

    const allCleaners =
        roles?.filter(
            ({ level, status }) =>
                level === RoleLevel.CLEANER && status === RoleStatus.ACTIVE,
        ) ?? [];

    const handleCreate = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        const data = parseFormData<AssignmentCreationBody>(e.currentTarget, {
            cleaners: [],
            dueAt: new Date(),
            roomId: "",
        });
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
        }
    };

    return (
        <>
            <Button
                color="primary"
                onPress={onOpen}
                disabled={!rooms}
                aria-label="Create assignment"
            >
                Create Assignment
            </Button>

            <Modal
                isOpen={isOpen}
                placement="center"
                onOpenChange={onOpenChange}
                aria-labelledby="create-assignment-title"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader id="create-assignment-title">
                                New Assignment
                            </ModalHeader>

                            <ModalBody>
                                <Form id="assignment_creation_form" onSubmit={handleCreate}>
                                    <Select
                                        name="roomId"
                                        form="assignment_creation_form"
                                        isRequired
                                        fullWidth
                                        label="Room number"
                                        placeholder="Select a room"
                                        errorMessage="Please select a room"
                                        isDisabled={!rooms || rooms.length === 0}
                                    >
                                        {rooms && rooms.length > 0
                                            ? rooms.map((room) => (
                                                <SelectItem key={room.id}>{room.number}</SelectItem>
                                            ))
                                            : null}
                                    </Select>


                                    <Select
                                        name="cleaners"
                                        form="assignment_creation_form"
                                        isRequired
                                        fullWidth
                                        label="Cleaners"
                                        placeholder="Assign cleaners"
                                        selectionMode="multiple"
                                        errorMessage="Please select at least one cleaner"
                                        isDisabled={allCleaners.length === 0}
                                    >
                                        {allCleaners.map((cl) => (
                                            <SelectItem key={cl.userId}>{cl.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <DatePicker
                                        name="dueAt"
                                        form="assignment_creation_form"
                                        isRequired
                                        label="Due Date"
                                        description="Choose when the cleaning should be completed"
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
                                <Button
                                    color="primary"
                                    type="submit"
                                    form="assignment_creation_form"
                                >
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
