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
import { useUpdateRoom } from "@hooks";
import { parseFormData } from "@lib";
import { Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { isAxiosError } from "axios";
import { FormEvent } from "react";
import { RoomCleanlinessText, RoomOccupancyText } from "../utils";

export function RoomUpdate({ room }: { room: Room }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: updateRoom } = useUpdateRoom({ hotelId: room.hotelId, roomId: room.id });

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
            const description = isAxiosError(e) && e.status === 409
                ? `Room #${data.number} already exists`
                : "An unknown error occurred";

            addToast({
                title: "Room could not be updated!",
                description,
                color: "danger",
            });
            onClose();
        }
    }

    return (
        <>
            <Button
                color="secondary"
                onPress={onOpen}
                aria-label={`Edit room ${room.number}`}
            >
                Edit
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >
                                Edit Room #{room.number}
                            </ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleSubmit}>
                                    <Input
                                        autoFocus
                                        defaultValue={room.number}
                                        errorMessage="Please provide room number"
                                        form={FORM}
                                        label="Room Number"
                                        name="number"
                                        placeholder="Enter new room number"
                                        variant="bordered"
                                        required
                                    />
                                    <Select
                                        className="max-w-xs"
                                        defaultSelectedKeys={[room.cleanliness]}
                                        form={FORM}
                                        label="Cleanliness Status"
                                        name="cleanliness"
                                        placeholder="Select cleanliness status"
                                        required
                                    >
                                        {Object.values(RoomCleanliness).map(rc => (
                                            <SelectItem key={rc}>{RoomCleanlinessText[rc]}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        className="max-w-xs"
                                        defaultSelectedKeys={[room.occupancy]}
                                        form={FORM}
                                        label="Occupancy Status"
                                        name="occupancy"
                                        placeholder="Select occupancy status"
                                        required
                                    >
                                        {Object.values(RoomOccupancy).map(ro => (
                                            <SelectItem key={ro}>{RoomOccupancyText[ro]}</SelectItem>
                                        ))}
                                    </Select>
                                </Form>
                            </ModalBody>
                            <ModalFooter className="gap-3">
                                <Button color="danger" variant="flat" onPress={onCloseModal}>
                                    Cancel
                                </Button>
                                <Button color="primary" form={FORM} type="submit">
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
