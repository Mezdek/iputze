export function ListRenderer<T>({ data, isLoading, empty, children }: {
    data?: T[] | null;
    isLoading?: boolean;
    empty: React.ReactNode;
    children: (item: T) => React.ReactNode;
}) {
    if (isLoading) return <div>Loading...</div>;
    if (!data || data.length === 0) return <>{empty}</>;
    return (
        <div className="flex gap-2 w-full p-4 h-full flex-wrap">
            {data.map(children)}
        </div>
    )
}
