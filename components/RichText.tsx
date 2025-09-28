import { ReactNode } from 'react';

// These tags are available
type Tag = 'p' | 'b' | 'i' | 'strong';

type Props = {
    children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode
};

export function RichText({ children }: Props) {
    return (
        <div className="prose inline">
            {children({
                p: (chunks: ReactNode) => <p>{chunks}</p>,
                b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
                i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
                strong: (chunks: ReactNode) => <strong>{chunks}</strong>
            })}
        </div>
    );
}