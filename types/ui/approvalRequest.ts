import type { ButtonProps } from '@heroui/react';

interface ButtonPropsWithText extends ButtonProps {
  text?: string;
}

interface SubmitButtonProps extends ButtonPropsWithText {
  submitHandler: () => Promise<void>;
}

export type ApprovalRequestProps = Partial<{
  header: string;
  question: string;
  cancelButtonProps: ButtonPropsWithText;
  modalButtonProps: ButtonPropsWithText;
  submitButtonProps: Partial<SubmitButtonProps>;
}>;
