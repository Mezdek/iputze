'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'

export function UIProvider({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider toastProps={{
                timeout: 2000,
            }} />
            {children}
        </HeroUIProvider>
    )
}
