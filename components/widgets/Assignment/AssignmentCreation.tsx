'use client'


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
import { useCreateAssignment, useErrorToast, useRoles, useRooms } from "@hooks";
import { getLocalTimeZone, today } from "@internationalized/date";
import { parseFormData } from "@lib";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { FormEvent } from "react";

import type { AssignmentCollectionParams, AssignmentCreationBody } from "@/types";


export function AssignmentCreation({ hotelId }: AssignmentCollectionParams) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { data: rooms } = useRooms({ hotelId });
    const { data: roles } = useRoles({ hotelId });
    const { mutateAsync: createAssignment } = useCreateAssignment({ hotelId });
    const t = useTranslations("assignment.creation")
    const { showErrorToast } = useErrorToast();

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
            showErrorToast(e)
        }
    };

    return (
        <>
            <Button
                aria-label="Create assignment"
                color="primary"
                disabled={!rooms}
                onPress={onOpen}
            >
                {t("modal_button")}
            </Button>

            <Modal
                aria-labelledby="create-assignment-title"
                isOpen={isOpen}
                placement="center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader id="create-assignment-title">
                                {t("header")}
                            </ModalHeader>

                            <ModalBody>
                                <Form id="assignment_creation_form" onSubmit={handleCreate}>
                                    <Select
                                        fullWidth
                                        isRequired
                                        errorMessage={t("inputs.room_number.error_message")}
                                        form="assignment_creation_form"
                                        isDisabled={!rooms || rooms.length === 0}
                                        label={t("inputs.room_number.label")}
                                        name="roomId"
                                        placeholder={t("inputs.room_number.placeholder")}
                                    >
                                        {rooms && rooms.length > 0
                                            ? rooms.map((room) => (
                                                <SelectItem key={room.id}>{room.number}</SelectItem>
                                            ))
                                            : null}
                                    </Select>


                                    <Select
                                        fullWidth
                                        isRequired
                                        errorMessage={t("inputs.cleaners.error_message")}
                                        form="assignment_creation_form"
                                        isDisabled={allCleaners.length === 0}
                                        label={t("inputs.cleaners.label")}
                                        name="cleaners"
                                        placeholder={t("inputs.cleaners.placeholder")}
                                        selectionMode="multiple"
                                    >
                                        {allCleaners.map((cl) => (
                                            <SelectItem key={cl.userId}>{cl.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <DatePicker
                                        isRequired
                                        defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                                        description={t("inputs.dua_date.description")}
                                        errorMessage={t("inputs.dua_date.error_message")}
                                        form="assignment_creation_form"
                                        label={t("inputs.dua_date.label")}
                                        minValue={today(getLocalTimeZone())}
                                        name="dueAt"
                                    />
                                </Form>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    {t("inputs.close_button")}
                                </Button>
                                <Button
                                    color="primary"
                                    form="assignment_creation_form"
                                    type="submit"
                                >
                                    {t("inputs.submit_button")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
