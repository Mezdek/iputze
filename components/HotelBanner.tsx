export function HotelBanner({ children, hotelName }: { hotelName: string; children?: React.ReactNode }) {
    return (
        <header className="flex items-center justify-center w-full bg-primary-500 px-6 py-4 shadow-sm">
            <h2 className="text-2xl font-semibold">
                {hotelName}
            </h2>
            <div className="flex items-center gap-4">{children}</div>
        </header>
    );
}
