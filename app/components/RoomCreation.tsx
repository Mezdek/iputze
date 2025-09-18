import { useCreateRoom } from "@/hooks/mutations/useCreateRoom";
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
import { RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { useState } from "react";


const RoomCleanlinessText: Record<RoomCleanliness, string> = {
    [RoomCleanliness.CLEAN]: "Clean",
    [RoomCleanliness.DIRTY]: "Dirty"
};

const RoomOccupancyText: Record<RoomOccupancy, string> = {
    [RoomOccupancy.AVAILABLE]: "Available",
    [RoomOccupancy.OCCUPIED]: "Occupied"
}

export function RoomCreation({ hotelId }: { hotelId: number }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: createRoom, isError, error, isSuccess, isPending } = useCreateRoom({ hotelId });

    const [number, setNumber] = useState<string>()
    const [numberError, setNumberError] = useState<string | null>()
    const [cleanliness, setCleanliness] = useState<RoomCleanliness>(RoomCleanliness.CLEAN)
    const [occupancy, setOccupancy] = useState<RoomOccupancy>(RoomOccupancy.AVAILABLE)

    const handleCreate = async () => {
        if (!number || number === "") {
            setNumberError("Please provide room number")
            return
        }
        try {
            await createRoom({ number, cleanliness, occupancy });
            onClose();
            addToast({
                title: "Room Created!",
                description: `Room ${number} created successfully`,
                color: "success",
            });
        } catch (e) {
            setNumberError(`Room ${number} exists already`);
            addToast({
                title: "Room could not be created!",
                description: `Room ${number} exists already`,
                color: "danger",
            });
            return;
        }
    }
    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Create Room
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >New room</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Room Number"
                                    placeholder="What is th room number"
                                    variant="bordered"
                                    onChange={e => { setNumberError(null); setNumber(e.target.value) }}
                                    isInvalid={!!numberError}
                                    errorMessage={numberError}
                                    isRequired
                                    autoFocus
                                />
                                <Select
                                    className="max-w-xs"
                                    label="Cleanliness Status"
                                    defaultSelectedKeys={[RoomCleanliness.CLEAN.toString()]}
                                    placeholder="Select the cleanliness status"
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
                                    defaultSelectedKeys={[RoomOccupancy.AVAILABLE.toString()]}
                                    placeholder="Select the occupancy status"
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
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleCreate}>
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








// import {addToast, Button} from "@heroui/react";

// export default function App() {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {["Default", "Primary", "Secondary", "Success", "Warning", "Danger"].map((color) => (
//         <Button
//           key={color}
//           color={color.toLowerCase()}
//           variant={"flat"}
//           onPress={() =>
//             addToast({
//               title: "Toast title",
//               description: "Toast displayed successfully",
//               color: color.toLowerCase(),
//             })
//           }
//         >
//           {color}
//         </Button>
//       ))}
//     </div>
//   );
// }
