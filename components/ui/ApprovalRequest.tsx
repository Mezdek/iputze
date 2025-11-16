'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useTranslations } from 'next-intl';

import { useErrorToast } from '@/hooks';
import { GeneralErrors } from '@/lib/shared/constants';
import type { ApprovalRequestProps } from '@/types';

export function ApprovalRequest({
  submitButtonProps,
  cancelButtonProps,
  header,
  question,
  modalButtonProps,
  submitHandler,
}: ApprovalRequestProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const t = useTranslations('ApprovalRequest');
  const { showErrorToast } = useErrorToast();
  const { text: modalText, ...modalButtonRestProps } = modalButtonProps;

  const handleSubmit = async () => {
    try {
      if (!submitHandler) throw new Error(GeneralErrors.NO_SUBMIT_FUNCTION);
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
            <Button color="success" onPress={onClose} {...cancelButtonProps}>
              {cancelButtonProps?.text ?? t('closeButton')}
            </Button>
            <Button
              color="warning"
              onPress={handleSubmit}
              {...submitButtonProps}
            >
              {submitButtonProps?.text ?? t('submitButton')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
