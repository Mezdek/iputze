'use client'

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@heroui/react";
import { useTranslations } from "next-intl";

import { useErrorToast } from "@/hooks";

type THeroUIButtonColors =
    | "default"
    | "danger"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | undefined;

type ApprovalRequestProps = {
    header: string;
    question: string;
    cancelButton?: {
        text?: string;
        color?: THeroUIButtonColors;
    };
    modalButton: {
        text: string;
        color?: THeroUIButtonColors;
        isDisabled?: boolean;
    };
    submitButton: {
        text?: string;
        action: () => Promise<void>;
        color?: THeroUIButtonColors;
    };
};

export function ApprovalRequest({
    submitButton,
    cancelButton,
    header,
    question,
    modalButton
}: ApprovalRequestProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const t = useTranslations("ApprovalRequest");
    const { showErrorToast } = useErrorToast()
    const handleSubmit = async () => {
        try {
            await submitButton.action();
        } catch (e) {
            showErrorToast(e);
        } finally {
            onClose();
        }
    };

    return (
        <>
            <Button
                color={modalButton.color ?? "primary"}
                isDisabled={modalButton.isDisabled}
                onPress={onOpen}
            >
                {modalButton.text}
            </Button>

            <Modal
                disableAnimation
                aria-label={header}
                isOpen={isOpen}
                placement="top-center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="text-lg font-semibold">{header}</ModalHeader>
                    <ModalBody>
                        <p className="text-base">{question}</p>
                    </ModalBody>
                    <ModalFooter className="flex justify-end gap-3">
                        <Button
                            color={cancelButton?.color ?? "default"}
                            variant="flat"
                            onPress={onClose}
                        >
                            {cancelButton?.text ?? t("closeButton")}
                        </Button>
                        <Button
                            color={submitButton.color ?? "primary"}
                            onPress={handleSubmit}
                        >
                            {submitButton.text ?? t("submitButton")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
