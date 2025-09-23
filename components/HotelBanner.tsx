export function HotelBanner({ children, hotelName }: { hotelName: string; children?: React.ReactNode }) {
    return (
        <header className="flex items-center justify-between w-full bg-amber-200 px-6 py-4 shadow-sm rounded-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Hotel: {hotelName}
            </h2>
            <div className="flex items-center gap-4">{children}</div>
        </header>
    );
}
