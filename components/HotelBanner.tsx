export function HotelBanner({ children, hotelName }: { hotelName: string, children?: React.ReactNode }) {

    return (
        <div className="flex justify-around items-center w-full h-1/8 bg-amber-200 px-3 py-3">
            <p className="text-2xl font-bold self-start">
                Hotel:  {hotelName}
            </p>
            {children}
        </div>
    )
}