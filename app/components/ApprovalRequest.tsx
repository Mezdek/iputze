import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure
} from "@heroui/react";

type ApprovalRequest = {
    header: string;
    buttonText: string;
    question: string;
    cancelButtonText: string;
    submitButtonText: string;
    submitAction: (props: any) => void;
    submitVariant: "default" | "danger" | "primary" | "secondary" | "success" | "warning" | undefined;
}

export function ApprovalRequest({ buttonText, cancelButtonText, header, question, submitAction, submitButtonText, submitVariant }: ApprovalRequest) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button color="danger" onPress={onOpen} >
                {buttonText}
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
                                <Button color="secondary" variant="flat" onPress={onClose}>
                                    {cancelButtonText}
                                </Button>
                                <Button color={submitVariant} onPress={submitAction}>
                                    {submitButtonText}
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}