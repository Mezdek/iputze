'use client'



import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useCreateRole, useErrorToast, useHotels } from "@hooks";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FormEvent} from "react";
import { useState } from "react";

type controlledProps = { isOpen: boolean, onOpenChange: (open: boolean) => void }
type noProps = { isOpen?: never, onOpenChange?: never }
type Props = controlledProps | noProps

export function JoinHotel(props: Props) {

    const { isOpen: isOpenInternal, onOpen, onOpenChange: onOpenChangeInternal } = useDisclosure();
    const isOpen = props ? props.isOpen : isOpenInternal;
    const onOpenChange = props.onOpenChange ? props.onOpenChange : onOpenChangeInternal

    const [selectedHotelId, setSelectedHotelId] = useState<string>("");
    const FORM = "join_hotel_form";

    const { data: hotels } = useHotels();
    const { showErrorToast } = useErrorToast()
    const hotel = hotels?.find(h => h.id === selectedHotelId);
    const t = useTranslations("join")
    const { mutateAsync: join } = useCreateRole({ hotelId: selectedHotelId });

    const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await join();
            onOpenChange(false);
        } catch (e) {
            showErrorToast(e)
        }
    };

    return (
        <>
            {!props && <Button color="primary" onPress={onOpen}>{t("buttons.open")}</Button>}

            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-lg font-semibold">{t("header")}</ModalHeader>

                            <ModalBody className="flex flex-col gap-4">
                                {hotels ? (
                                    <>
                                        <Form id={FORM} onSubmit={handleJoin}>
                                            <Select
                                                isRequired
                                                className="max-w-xs"
                                                form={FORM}
                                                label={t("inputs.hotel_name.label")}
                                                name="hotelId"
                                                placeholder={t("inputs.hotel_name.placeholder")}
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
                                                        fill
                                                        alt={`Image of ${hotel.name}`}
                                                        className="object-cover"
                                                        src={`https://picsum.photos/id/${parseInt(`${hotel.id}`.slice(0, 4), 16) % 90 + 10}/200`}
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
                                    <p>{t("loading_message")}</p>
                                )}
                            </ModalBody>

                            <ModalFooter className="gap-3">
                                <Button color="danger" variant="flat" onPress={onClose}>{t("buttons.close")}</Button>
                                <Button color="primary" disabled={!hotel} form={FORM} type="submit">{t("buttons.submit")} </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
