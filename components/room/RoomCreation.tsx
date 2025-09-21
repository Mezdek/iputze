import type { RoomCollectionParams, RoomCreationBody } from "@apptypes";
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
import { useCreateRoom } from "@hooks";
import { parseFormData } from "@lib";
import { RoomCleanliness, RoomOccupancy } from "@prisma/client";
import { isAxiosError } from "axios";
import { FormEvent } from "react";
import { RoomCleanlinessText, RoomOccupancyText } from "./utils";


export function RoomCreation({ hotelId }: RoomCollectionParams) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { mutateAsync: createRoom } = useCreateRoom({ hotelId });

    const FORM = "room_creation_form"

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = parseFormData<RoomCreationBody>(e.currentTarget, { number: "1", cleanliness: "CLEAN", occupancy: "AVAILABLE" });
        console.log(data)
        try {
            const res = await createRoom(data);
            onClose();
            addToast({
                title: "Room Created!",
                description: `Room ${res.number} created successfully`,
                color: "success",
            });
        } catch (e: unknown) {
            if (isAxiosError(e) && e.status === 400) {
                addToast({
                    title: "Room could not be created!",
                    description: `Room ${data.number} exists already`,
                    color: "danger",
                })
            }
            addToast({
                title: "Room could not be created!",
                description: "Unknown Error was thrown",
                color: "danger",
            })
            console.error(e)
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
                                <Form id={FORM} onSubmit={handleSubmit}>

                                    <Input
                                        autoFocus
                                        errorMessage="Please provide room number"
                                        form={FORM}
                                        isRequired
                                        label="Room Number"
                                        name="number"
                                        placeholder="What is th room number"
                                        variant="bordered"
                                    />
                                    <Select
                                        className="max-w-xs"
                                        form={FORM}
                                        isRequired
                                        label="Cleanliness Status"
                                        name="cleanliness"
                                        placeholder="Select the cleanliness status"
                                        defaultSelectedKeys={[RoomCleanliness.CLEAN.toString()]}
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
                                        form={FORM}
                                        isRequired
                                        label="Occupancy Status"
                                        name="occupancy"
                                        placeholder="Select the occupancy status"
                                        defaultSelectedKeys={[RoomOccupancy.AVAILABLE.toString()]}
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
                                <Button color="primary" type="submit" form={FORM}>
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
