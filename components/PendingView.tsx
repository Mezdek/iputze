import { useHotels } from "@hooks";
import { useParams } from "next/navigation";

export function PendingView() {
    const { data: hotels } = useHotels();
    const { hotelId } = useParams<{ hotelId: string }>();
    const hotel = hotels?.find(hotel => hotel.id === hotelId);

    return (<div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
        <p>
            Hotel
        </p>
        <p>
            {hotel?.name}
        </p>
        <p>
            The hotel has not yet approved your application, please wait or contact the hotel for more information
        </p>
    </div>)
}
