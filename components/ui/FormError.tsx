export function FormError({ message }: { message?: string | undefined }) {
  return message ? <p className="text-red-500 text-sm">{message}</p> : null;
}
