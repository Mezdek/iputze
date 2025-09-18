import { useDeleteRoom } from "@/hooks/mutations/useDeleteRoom";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure
} from "@heroui/react";
import { Room } from "@prisma/client";



export function RoomDelete({ room }: { room: Room }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { mutate: deleteRoom } = useDeleteRoom({ roomId: room.id, hotelId: room.hotelId })


    return (
        <>
            <Button color="danger" onPress={onOpen}>
                Delete
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >Room Deletion</ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to delete room {room.number} ?
                                </p>
                                <Button color="secondary" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="danger" onPress={() => deleteRoom()}>
                                    Delete
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}