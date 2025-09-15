'use client'
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-5 items-center justify-around w-full h-screen">
      <div className="flex flex-col gap-1 justify-around w-1/4 h-1/2">
        <p className="text-center font-bold text-4xl">
          iputze
        </p>
        <div className="flex w-full justify-around">
          <Link href="./signin">
            <Button color="primary">Sign In</Button>
          </Link>
          <Link href="./signup">
            <Button color="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
