import Image from "next/image";

export function LoadingScreen() {
    return (
        <div
            className="h-screen w-full flex flex-col items-center justify-center"
            role="status"
            aria-live="polite"
        >
            <Image
                src="/download.gif"
                alt="Loading..."
                width={200} // approximate displayed size
                height={200}
                className="object-contain"
            />
            <span className="sr-only">Loading…</span>
        </div>
    );
}
