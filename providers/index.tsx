import { ClientSideProviders } from './ClientSideProviders';
import { ServerSideProviders } from './ServerSideProviders';

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <ServerSideProviders>
            <ClientSideProviders>
                {children}
            </ClientSideProviders>
        </ServerSideProviders>

    )
}
