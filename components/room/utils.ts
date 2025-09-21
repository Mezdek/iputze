import { RoomCleanliness, RoomOccupancy } from "@prisma/client";

export const RoomCleanlinessText: Record<RoomCleanliness, string> = {
    [RoomCleanliness.CLEAN]: "Clean",
    [RoomCleanliness.DIRTY]: "Dirty"
};

export const RoomOccupancyText: Record<RoomOccupancy, string> = {
    [RoomOccupancy.AVAILABLE]: "Available",
    [RoomOccupancy.OCCUPIED]: "Occupied"
}
