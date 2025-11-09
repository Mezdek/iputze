import type { RoomWithHotel } from '@/types';

export function RoomInfo({ room }: { room: RoomWithHotel }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-semibold">Floor</p>
        <p>{room.floor ?? 'N/A'}</p>
      </div>
      <div>
        <p className="font-semibold">Capacity</p>
        <p>{room.capacity ?? 'N/A'} people</p>
      </div>
      <p className="text-default-600">{room.notes || 'No notes available'}</p>
    </div>
  );
}
