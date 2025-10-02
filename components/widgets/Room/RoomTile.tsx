'use client'

import { RichText, RoomDeletion, RoomUpdate, Tile } from "@components";
import type { Room } from "@prisma/client";
import { useTranslations } from "next-intl";

export function RoomTile({ room }: { room: Room }) {

    const t = useTranslations("room")
    return (
        <Tile
            body={
                <>
                    <RichText>
                        {(tags) => t.rich('cleanliness', { ...tags, status: t(`cleanliness_status.${room.cleanliness}`) })}
                    </RichText>
                    <RichText>
                        {(tags) => t.rich('occupancy', { ...tags, status: t(`occupancy_status.${room.occupancy}`) })}
                    </RichText>
                    <RichText>
                        {(tags) => t.rich('notes', { ...tags, notes: room.notes && room.notes.trim() !== "" ? room.notes : t("no_notes") })}
                    </RichText>
                </>
            }

            footer={
                <>
                    <RoomUpdate room={room} />
                    <RoomDeletion room={room} />
                </>
            }

            header={<h2 className="font-semibold">{room.number}</h2>}
        />
    );
}
