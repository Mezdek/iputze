'use client'

import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useCreateRole, useHotels } from "@hooks";
import Image from "next/image";
import { FormEvent, useState } from "react";

export function JoinHotel() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedHotelId, setSelectedHotelId] = useState<string>("");
    const FORM = "join_hotel_form";

    const { data: hotels } = useHotels();
    const hotel = hotels?.find(h => h.id === selectedHotelId);

    const { mutateAsync: join } = useCreateRole({ hotelId: selectedHotelId });

    const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await join();
            onOpenChange();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Button color="primary" onPress={onOpen}>Join</Button>

            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-lg font-semibold">Join a Hotel</ModalHeader>
                            <ModalBody className="flex flex-col gap-4">
                                {hotels ? (
                                    <>
                                        <Form id={FORM} onSubmit={handleJoin}>
                                            <Select
                                                name="hotelId"
                                                form={FORM}
                                                label="Select Hotel"
                                                placeholder="Choose a hotel"
                                                isRequired
                                                className="max-w-xs"
                                                onSelectionChange={(e) => setSelectedHotelId(e.currentKey!)}
                                            >
                                                {hotels.map(h => (
                                                    <SelectItem key={h.id}>{h.name}</SelectItem>
                                                ))}
                                            </Select>
                                        </Form>

                                        {hotel && (
                                            <div className="flex flex-col md:flex-row gap-4 bg-gray-100 rounded-xl p-4 shadow-md w-full">
                                                <div className="flex-shrink-0 w-full md:w-48 h-32 relative rounded-lg overflow-hidden">
                                                    <Image
                                                        // src={hotel.imageUrl || "/default-hotel.jpg"}
                                                        src={`https://picsum.photos/id/${parseInt(`${hotel.id}`.slice(0, 4), 16) % 90 + 10}/200`}
                                                        alt={`Image of ${hotel.name}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-semibold text-lg">{hotel.name}</p>
                                                    {hotel.address && <p className="text-sm text-gray-700">{hotel.address}</p>}
                                                    {hotel.description && <p className="text-sm text-gray-600">{hotel.description}</p>}
                                                    {hotel.email && <p className="text-sm text-gray-600">Email: {hotel.email}</p>}
                                                    {hotel.phone && <p className="text-sm text-gray-600">Phone: {hotel.phone}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Loading hotels...</p>
                                )}
                            </ModalBody>

                            <ModalFooter className="gap-3">
                                <Button color="danger" variant="flat" onPress={onClose}>Cancel</Button>
                                <Button color="primary" type="submit" form={FORM} disabled={!hotel}>Join</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
