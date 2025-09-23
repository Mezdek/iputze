import { HotelBanner } from "@components";
import { Spinner } from "@heroui/react";
import { TabProps } from "./types";

/**
 * Generic wrapper for hotel tab sections.
 */
interface EntityTabProps extends TabProps {
    isLoading: boolean;
    emptyMessage: string;
    children: React.ReactNode;
    button?: React.ReactNode;
}

export function EntityTab({ hotelName, isLoading, emptyMessage, children, button }: EntityTabProps) {
    return (
        <div className="flex flex-col gap-10 items-center w-full min-h-full">
            <HotelBanner hotelName={hotelName}>
                {button}
            </HotelBanner>
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Spinner label="Loading..." />
                </div>
            ) : (
                <div className="w-full">
                    {children ?? (
                        <p className="text-gray-500 text-center italic">{emptyMessage}</p>
                    )}
                </div>
            )}
        </div>
    );
}
