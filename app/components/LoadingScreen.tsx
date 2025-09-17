import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="h-screen w-full flex items-center justify-center text-5xl">
            <Image src={"/download.gif"} alt="loading" width={10} height={10} className="h-1/2 w-fit flex items-center" />
        </div>
    )
}
