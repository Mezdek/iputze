'use client'
import { NavigationBar } from "@components";

export default function ClientSideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
