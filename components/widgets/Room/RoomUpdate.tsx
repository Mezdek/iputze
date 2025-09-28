'use client'

import type { RoomUpdateBody } from "@/types";
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
import { useErrorToast, useUpdateRoom } from "@hooks";
import { parseFormData } from "@lib";
import { Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

export function RoomUpdate({ room }: { room: Room }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: updateRoom } = useUpdateRoom({ hotelId: room.hotelId, roomId: room.id });
    const t = useTranslations("room")
    const { showErrorToast } = useErrorToast()
    const FORM = `room_update_form_${room.id}`;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = parseFormData<RoomUpdateBody>(e.currentTarget, {});
        try {
            await updateRoom(data);
            onClose();
            addToast({
                title: "Room Updated!",
                description: `Room #${data.number} has been updated successfully`,
                color: "success",
            });
        } catch (e: unknown) {
            showErrorToast(e);
        }
    }

    return (
        <>
            <Button
                color="secondary"
                onPress={onOpen}
                aria-label={`Edit room ${room.number}`}
            >
                {
                    t("update_panel.buttons.open")
                }
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >
                                {
                                    t("update_panel.header", { number: room.number })
                                }
                            </ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleSubmit}>
                                    <Input
                                        autoFocus
                                        className="w-full"
                                        defaultValue={room.number}
                                        errorMessage={t("update_panel.inputs.room_number.error_message")}
                                        form={FORM}
                                        label={t("update_panel.inputs.room_number.label")}
                                        name="number"
                                        placeholder={t("update_panel.inputs.room_number.placeholder")}
                                        required
                                        variant="bordered"
                                    />
                                    <Select
                                        className="w-full"
                                        defaultSelectedKeys={[room.cleanliness]}
                                        form={FORM}
                                        label={t("update_panel.inputs.cleanliness.label")}
                                        name="cleanliness"
                                        placeholder={t("update_panel.inputs.cleanliness.placeholder")}
                                        required
                                    >
                                        {Object.values(RoomCleanliness).map(status => (
                                            <SelectItem key={status}>
                                                {t(`cleanliness_status.${status}`)}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        className="w-full"
                                        defaultSelectedKeys={[room.occupancy]}
                                        form={FORM}
                                        label={t("update_panel.inputs.occupancy.label")}
                                        name="occupancy"
                                        placeholder={t("update_panel.inputs.occupancy.placeholder")}
                                        required
                                    >
                                        {Object.values(RoomOccupancy).map(status => (
                                            <SelectItem key={status}>
                                                {t(`occupancy_status.${status}`)}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </Form>
                            </ModalBody>
                            <ModalFooter className="gap-3">
                                <Button color="danger" variant="flat" onPress={onCloseModal}>
                                    {t("update_panel.buttons.close")}
                                </Button>
                                <Button color="primary" form={FORM} type="submit">
                                    {t("update_panel.buttons.submit")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
