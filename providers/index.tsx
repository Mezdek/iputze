import type { ReactNode } from 'react';

import { ClientSideProviders } from './ClientSideProviders';
import { ServerSideProviders } from './ServerSideProviders';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ServerSideProviders>
      <ClientSideProviders>{children}</ClientSideProviders>
    </ServerSideProviders>
  );
}
