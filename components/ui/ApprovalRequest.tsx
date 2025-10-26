'use client';

import {
  Button,
  type ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useTranslations } from 'next-intl';

import { useErrorToast } from '@/hooks';

type TCancelButtonProps = { text?: string } & ButtonProps;
type TModalButtonProps = { text?: string } & ButtonProps;
type TSubmitButtonProps = {
  text?: string;
  submitHandler: () => Promise<void>;
} & ButtonProps;

export type ApprovalRequestProps = {
  header: string;
  question: string;
  cancelButtonProps: TCancelButtonProps;
  modalButtonProps: TModalButtonProps;
  submitButtonProps: TSubmitButtonProps;
};

export function ApprovalRequest({
  submitButtonProps,
  cancelButtonProps,
  header,
  question,
  modalButtonProps,
}: Partial<ApprovalRequestProps>) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const t = useTranslations('ApprovalRequest');
  const { showErrorToast } = useErrorToast();
  const {
    submitHandler,
    text: submitText,
    ...submitButtonRestProps
  } = submitButtonProps!;
  const { text: modalText, ...modalButtonRestProps } = modalButtonProps!;
  const cancelText = cancelButtonProps?.text;
  const handleSubmit = async () => {
    try {
      await submitHandler();
    } catch (e) {
      showErrorToast(e);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen} {...modalButtonRestProps}>
        {modalText}
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
              color="default"
              variant="flat"
              onPress={onClose}
              {...cancelButtonProps}
            >
              {cancelText ?? t('closeButton')}
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              {...submitButtonRestProps}
            >
              {submitText ?? t('submitButton')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
