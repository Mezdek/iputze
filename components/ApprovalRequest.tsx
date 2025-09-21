import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@heroui/react";

type THeroUIButtonColors = "default" | "danger" | "primary" | "secondary" | "success" | "warning" | undefined;

type ApprovalRequestProps = {
    header: string;
    question: string;
    cancelButton?: {
        text?: string;
        color?: THeroUIButtonColors
    }
    modalButton: {
        text: string;
        color?: THeroUIButtonColors;
        isDisabled?: boolean;
    }
    submitButton: {
        text?: string;
        action: () => Promise<void>;
        color?: THeroUIButtonColors
    }
}

export function ApprovalRequest({
    submitButton,
    cancelButton,
    header,
    question,
    modalButton
}: ApprovalRequestProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button color={modalButton.color ?? "primary"} onPress={onOpen} isDisabled={modalButton.isDisabled} >
                {modalButton.text}
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} disableAnimation>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1" >{header}</ModalHeader>
                            <ModalBody>
                                <p>
                                    {question}
                                </p>
                            </ModalBody>
                            <ModalFooter className="gap-3">
                                <Button color={cancelButton?.color ?? "default"} variant="flat" onPress={onClose}>
                                    {cancelButton?.text ?? "Cancel"}
                                </Button>
                                <Button color={submitButton.color ?? "primary"} onPress={async () => { await submitButton.action(); onClose(); }}>
                                    {submitButton.text ?? "Yes"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}