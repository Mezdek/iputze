'use client'

import { LoginWidget } from "@components";
import { useMe } from "@hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;
  
  return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-screen p-4">
      <h1 className="text-center font-bold text-4xl">
        iputze
      </h1>
      <LoginWidget />
    </div>
  );
}
