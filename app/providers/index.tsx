'use client'

import { HeroUIProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AccessTokenProvider } from './AccessTokenProvider'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <AccessTokenProvider>
            <QueryClientProvider client={queryClient}>
                <HeroUIProvider>
                    {children}
                </HeroUIProvider>
            </QueryClientProvider>
        </AccessTokenProvider>

    )
}
