import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, useDisclosure
} from "@heroui/react";
import { useUpdateRoom } from "@hooks";
import { Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { useState } from "react";


const RoomCleanlinessText: Record<RoomCleanliness, string> = {
    [RoomCleanliness.CLEAN]: "Clean",
    [RoomCleanliness.DIRTY]: "Dirty"
};

const RoomOccupancyText: Record<RoomOccupancy, string> = {
    [RoomOccupancy.AVAILABLE]: "Available",
    [RoomOccupancy.OCCUPIED]: "Occupied"
}

export function RoomUpdate({ room }: { room: Room }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: updateRoom } = useUpdateRoom({ hotelId: room.hotelId, roomId: room.id });
    const [number, setNumber] = useState<string>(room.number)
    const [numberError, setNumberError] = useState<string | null>()
    const [cleanliness, setCleanliness] = useState<RoomCleanliness>(room.cleanliness)
    const [occupancy, setOccupancy] = useState<RoomOccupancy>(room.occupancy)

    const handleClose = () => {
        setNumber(room.number);
        setNumberError("");
        setCleanliness(room.cleanliness);
        setOccupancy(room.occupancy);
        onClose();
    }

    const handleUpdate = async () => {
        if (!number || number === "") {
            setNumberError("Please provide room number")
            return
        }
        try {
            await updateRoom({ number, cleanliness, occupancy });
            onClose();
            addToast({
                title: "Room Updated!",
                description: `Room has been updated successfully`,
                color: "success",
            });
        } catch (e) {
            setNumberError(`Room ${number} exists already`);
            addToast({
                title: "Room could not be updated!",
                description: `Room ${number} exists already`,
                color: "danger",
            });
            return;
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
                                <Input
                                    label="Room Number"
                                    placeholder="Change room number"
                                    variant="bordered"
                                    onChange={e => { setNumberError(null); setNumber(e.target.value) }}
                                    isInvalid={!!numberError}
                                    errorMessage={numberError}
                                    isRequired
                                    defaultValue={number}
                                    autoFocus
                                />
                                <Select
                                    className="max-w-xs"
                                    label="Cleanliness Status"
                                    defaultSelectedKeys={[cleanliness]}
                                    placeholder="Change the cleanliness status"
                                    onChange={(e) => setCleanliness(e.target.value as RoomCleanliness)}>
                                    {
                                        Object.values(RoomCleanliness).map(
                                            rc => (
                                                <SelectItem key={rc}>{RoomCleanlinessText[rc]}</SelectItem>
                                            ))
                                    }
                                </Select>
                                <Select
                                    className="max-w-xs"
                                    label="Occupancy Status"
                                    defaultSelectedKeys={[occupancy]}
                                    placeholder="Change the occupancy status"
                                    onChange={(e) => setOccupancy(e.target.value as RoomOccupancy)}>
                                    {
                                        Object.values(RoomOccupancy).map(
                                            ro => (
                                                <SelectItem key={ro}>{RoomOccupancyText[ro]}</SelectItem>
                                            ))
                                    }
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={handleClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleUpdate}>
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