'use client'



import { LoginWidget } from "@components";
import { useMe } from "@hooks";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Home() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen p-4">
      <h1 className="text-center font-bold text-4xl">
        {t("app_name")}
      </h1>
      <LoginWidget />
    </div>
  );
}
