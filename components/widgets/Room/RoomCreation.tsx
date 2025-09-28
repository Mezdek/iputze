'use client'

import type { RoomCollectionParams, RoomCreationBody } from "@/types";
import {
    addToast,
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure
} from "@heroui/react";
import { useCreateRoom, useErrorToast } from "@hooks";
import { parseFormData } from "@lib";
import { RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

export function RoomCreation({ hotelId }: RoomCollectionParams) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: createRoom } = useCreateRoom({ hotelId });
    const t = useTranslations("room");
    const { showErrorToast } = useErrorToast();

    const FORM = "room_creation_form";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = parseFormData<RoomCreationBody>(e.currentTarget, {
            number: "",
            cleanliness: RoomCleanliness.CLEAN,
            occupancy: RoomOccupancy.AVAILABLE,
        });

        try {
            const res = await createRoom(data);
            onClose();
            addToast({
                title: "Room Created!",
                description: `Room ${res.number} created successfully`,
                color: "success",
            });
        }
        catch (error) {
            showErrorToast(error)
        }
    };

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                {
                    t("creation_panel.buttons.open")
                }
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                                {t("creation_panel.header")}
                            </ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <Input
                                        autoFocus
                                        isRequired
                                        errorMessage={t("creation_panel.inputs.room_number.error_message")}
                                        form={FORM}
                                        label={t("creation_panel.inputs.room_number.label")}
                                        name="number"
                                        placeholder={t("creation_panel.inputs.room_number.placeholder")}
                                        variant="bordered"
                                    />

                                    <Select
                                        className="max-w-xs"
                                        form={FORM}
                                        isRequired
                                        label={t("creation_panel.inputs.cleanliness.label")}
                                        name="cleanliness"
                                        placeholder={t("creation_panel.inputs.cleanliness.placeholder")}
                                        defaultSelectedKeys={[RoomCleanliness.CLEAN]}
                                    >
                                        {Object.values(RoomCleanliness).map(
                                            (status) => (
                                                <SelectItem key={status}>
                                                    {t(`cleanliness_status.${status}`)}
                                                </SelectItem>
                                            )
                                        )}
                                    </Select>

                                    <Select
                                        className="max-w-xs"
                                        form={FORM}
                                        isRequired
                                        label={t("creation_panel.inputs.occupancy.label")}
                                        name="occupancy"
                                        placeholder={t("creation_panel.inputs.occupancy.placeholder")}
                                        defaultSelectedKeys={[RoomOccupancy.AVAILABLE]}
                                    >
                                        {Object.values(RoomOccupancy).map(
                                            (status) => (
                                                <SelectItem key={status}>
                                                    {t(`occupancy_status.${status}`)}
                                                </SelectItem>
                                            )
                                        )}
                                    </Select>
                                </Form>
                            </ModalBody>
                            <ModalFooter className="gap-3">
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    {t("creation_panel.buttons.close")}
                                </Button>
                                <Button color="primary" type="submit" form={FORM}>
                                    {t("creation_panel.buttons.submit")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}


