export function FormError({ message }: { message?: string }) {
    return (message ? <p className="text-red-500 text-sm">{message}</p> : null)
}
