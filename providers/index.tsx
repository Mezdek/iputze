'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AccessTokenProvider } from './AccessTokenProvider'
import { UIProvider } from './UIProvider'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <AccessTokenProvider>
            <QueryClientProvider client={queryClient}>
                <UIProvider>
                    {children}
                </UIProvider>
            </QueryClientProvider>
        </AccessTokenProvider>

    )
}
