import type { RoomUpdateBody } from "@apptypes";
import {
    addToast,
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, useDisclosure
} from "@heroui/react";
import { useUpdateRoom } from "@hooks";
import { parseFormData } from "@lib";
import { Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { isAxiosError } from "axios";
import { FormEvent } from "react";
import { RoomCleanlinessText, RoomOccupancyText } from "./utils";


export function RoomUpdate({ room }: { room: Room }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: updateRoom } = useUpdateRoom({ hotelId: room.hotelId, roomId: room.id });

    const FORM = "room_update_form";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = parseFormData<RoomUpdateBody>(e.currentTarget, {})
        try {
            await updateRoom(data);
            onClose();
            addToast({
                title: "Room Updated!",
                description: `Room has been updated successfully`,
                color: "success",
            });
        } catch (e: unknown) {
            if (isAxiosError(e) && e.status === 409) {
                addToast({
                    title: "Room could not be updated!",
                    description: `Room ${data.number} exists already`,
                    color: "danger",
                });
            } else {
                addToast({
                    title: "Room could not be updated!",
                    description: "An unknown error was thrown",
                    color: "danger",
                });
            }
            onClose()
        }
    }


    return (
        <>
            <Button color="secondary" onPress={onOpen}>
                Edit
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >New room</ModalHeader>
                            <ModalBody>
                                <Form id={FORM} onSubmit={handleSubmit}>
                                    <Input
                                        autoFocus
                                        defaultValue={room.number}
                                        errorMessage="Please provide room number"
                                        form={FORM}
                                        label="Room Number"
                                        name="number"
                                        placeholder="Change room number"
                                        variant="bordered"
                                    />
                                    <Select
                                        className="max-w-xs"
                                        defaultSelectedKeys={[room.cleanliness]}
                                        form={FORM}
                                        label="Cleanliness Status"
                                        name="cleanliness"
                                        placeholder="Change the cleanliness status"
                                    >
                                        {
                                            Object.values(RoomCleanliness).map(
                                                rc => (
                                                    <SelectItem key={rc}>{RoomCleanlinessText[rc]}</SelectItem>
                                                ))
                                        }
                                    </Select>
                                    <Select
                                        className="max-w-xs"
                                        defaultSelectedKeys={[room.occupancy]}
                                        form={FORM}
                                        label="Occupancy Status"
                                        name="occupancy"
                                        placeholder="Change the occupancy status"
                                    >
                                        {
                                            Object.values(RoomOccupancy).map(
                                                ro => (
                                                    <SelectItem key={ro}>{RoomOccupancyText[ro]}</SelectItem>
                                                ))
                                        }
                                    </Select>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
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