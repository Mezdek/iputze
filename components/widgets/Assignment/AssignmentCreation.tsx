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
import { useCreateAssignment, useErrorToast, useRoles, useRooms } from "@hooks";
import { getLocalTimeZone, today } from "@internationalized/date";
import { parseFormData } from "@lib";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

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
                color="primary"
                onPress={onOpen}
                disabled={!rooms}
                aria-label="Create assignment"
            >
                {t("modal_button")}
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
                                {t("header")}
                            </ModalHeader>

                            <ModalBody>
                                <Form id="assignment_creation_form" onSubmit={handleCreate}>
                                    <Select
                                        name="roomId"
                                        form="assignment_creation_form"
                                        isRequired
                                        fullWidth
                                        label={t("inputs.room_number.label")}
                                        placeholder={t("inputs.room_number.placeholder")}
                                        errorMessage={t("inputs.room_number.error_message")}
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
                                        label={t("inputs.cleaners.label")}
                                        placeholder={t("inputs.cleaners.placeholder")}
                                        selectionMode="multiple"
                                        errorMessage={t("inputs.cleaners.error_message")}
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
                                        label={t("inputs.dua_date.label")}
                                        description={t("inputs.dua_date.description")}
                                        minValue={today(getLocalTimeZone())}
                                        defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                                        errorMessage={t("inputs.dua_date.error_message")}
                                    />
                                </Form>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    {t("inputs.close_button")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    form="assignment_creation_form"
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
