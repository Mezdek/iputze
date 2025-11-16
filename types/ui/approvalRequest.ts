import type { ButtonProps } from '@heroui/react';

interface ButtonPropsWithText extends ButtonProps {
  text: string;
}

export type ApprovalRequestProps = {
  header: string;
  modalButtonProps: ButtonPropsWithText;
  question: string;
  submitHandler: () => Promise<void>;
  cancelButtonProps?: Partial<ButtonPropsWithText>;
  submitButtonProps?: Partial<ButtonPropsWithText>;
};
