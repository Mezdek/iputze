import Image from "next/image";

export function LoadingScreen() {
    return (
        <div
            aria-live="polite"
            className="h-screen w-full flex flex-col items-center justify-center"
            role="status"
        >
            <Image
                alt="Loading..."
                className="object-contain"
                height={200}
                src="/download.gif"
                width={200}
            />
            <span className="sr-only">Loading…</span>
        </div>
    );
}
