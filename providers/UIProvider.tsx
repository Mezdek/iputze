'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import type { ReactNode } from 'react';

export function UIProvider({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          timeout: 2000,
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
