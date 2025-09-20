'use client'

import { Login } from "@components";

export default function Home() {

  return (
    <div className="flex gap-5 items-center justify-around w-full h-screen">
      <p className="text-center font-bold text-4xl">
        iputze
      </p>
      <Login />
    </div>
  );
}
