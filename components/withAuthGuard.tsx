'use client';

import { InjectedAuthProps } from "@/types";
import { LoadingScreen } from "@components";
import { useMe } from "@hooks";
import { getPath } from "@lib";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";



export function withAuthGuard<P extends object>(Component: ComponentType<P & InjectedAuthProps>) {
  return function Guarded(props: P) {
    const { data: user, isFetching, isLoading } = useMe();
    const router = useRouter();
    useEffect(() => {
      if (!user && !isLoading && !isFetching) router.replace(getPath().HOME);
    }, [router, user, isLoading, isFetching]);

    if (isFetching || isLoading) return <LoadingScreen />;

    if (!user) return null;
    return <Component {...props} user={user} />;
  };
}