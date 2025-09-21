import { parseFormData } from "@/lib";
import { Button, ButtonProps, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useCreateRole, useHotels } from "@hooks";
import { FormEvent, useState } from "react";

export default function JoinHotel(props: ButtonProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedHotelId, setSelectedHotelId] = useState<string>("");
    const FORM = "join_hotel_form";
    const { data: hotels } = useHotels()
    const hotel = hotels?.find(hotel => hotel.id === selectedHotelId);
    const { mutateAsync: join } = useCreateRole({ hotelId: selectedHotelId })
    const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = parseFormData<{ hotelId: string }>(e.currentTarget, { hotelId: "" })
        console.log(data)
        try {
            await join();
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <div>
            <Button color="primary" onPress={onOpen} {...props}>
                Join
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >
                                Join a hotel
                            </ModalHeader>
                            <ModalBody>
                                {
                                    hotels ?
                                        (<>
                                            <Form id={FORM} onSubmit={handleJoin} >
                                                <Select
                                                    className="max-w-xs"
                                                    form={FORM}
                                                    label="Hotel"
                                                    name="hotelId"
                                                    onSelectionChange={(e) => { setSelectedHotelId(e.currentKey!) }}
                                                    placeholder="Choose your hotel"
                                                >
                                                    {
                                                        hotels.map(
                                                            hotel => <SelectItem key={hotel.id}>{hotel.name}</SelectItem>
                                                        )
                                                    }
                                                </Select>
                                            </Form>
                                            <div className="flex flex-col gap-1 bg-lime-600 h-full py-2 px-1 rounded-xl flex-wrap">
                                                {
                                                    hotel
                                                        ? (<ol style={{ border: "solid 1px black" }}>
                                                            <li>
                                                                {hotel.name}
                                                            </li>
                                                            <li>
                                                                {hotel.address}
                                                            </li>
                                                            <li>
                                                                {hotel.description}
                                                            </li>
                                                            <li>
                                                                {hotel.email}
                                                            </li>
                                                            <li>
                                                                {hotel.phone}
                                                            </li>
                                                        </ol>)
                                                        : <ol></ol>
                                                }
                                            </div>
                                        </>)
                                        : <p>We did not recieve the hotel list yet. Loading...</p>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" form={FORM}>
                                    Join
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >

        </div>
    )
}




