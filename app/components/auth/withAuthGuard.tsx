'use client';

import { useMe } from "@/hooks";
import { ROUTES } from "@/lib/constants";
import { useAccessToken } from "@/providers/AccessTokenProvider";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
import LoadingScreen from "../LoadingScreen";

export function withAuthGuard<P extends object>(Component: ComponentType<P>) {
  return function Guarded(props: P) {
    const { data: user, isFetching, isLoading } = useMe();
    const router = useRouter();
    const { initialized } = useAccessToken();
    useEffect(() => {
      if (initialized && !user && !isLoading) {
        router.replace(ROUTES.HOME);
      }
    }, [router, user, initialized, isLoading, isFetching]);

    if (isFetching || isLoading) {
      return <LoadingScreen />;
    }

    if (!user) return null; // already redirected

    return <Component {...props} />;
  };
}
