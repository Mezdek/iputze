
import { Button } from '@heroui/react';
import type { Room} from '@prisma/client';
import { RoomCleanliness } from '@prisma/client';
import { useState } from 'react';

import { useAssignments, useRooms } from '@/hooks';
import type { AssignmentResponse } from '@/types';

import { ClickableNames } from './ClickableNames';



export default function Dash({ hotelId }: { hotelId: string }) {
    const { data: rooms } = useRooms({ hotelId });
    const { data: assignments } = useAssignments({ hotelId })
    const [room, setRoom] = useState<Room>()

    const roomColor = (cleanliness: RoomCleanliness) => cleanliness === RoomCleanliness.CLEAN ? "bg-success-600" : "bg-danger-600"

    return (
        <div className='flex bg-blue-50 gap-4 p-4 h-full'>
            <div className='grid grid-cols-6 w-2/3 h-full p-12 gap-4 bg-blue-200 rounded-sm'>
                {rooms?.map(
                    room =>
                        <Button
                            className={`${roomColor(room.cleanliness)} text-3xl rounded-sm h-30`}
                            key={room.id}
                            onPress={() => setRoom(room)}>
                            {room.number}
                        </Button>
                )}
            </div>
            <div className='grid grid-cols-1 w-1/3'>
                {
                    room
                        ? <RoomDetails assignments={getRoomAssignments(assignments, room.id)} room={room} />
                        : <p className='flex h-full items-center justify-center'>
                            Select a room to view details
                            Click on any room to see cleaning status and assignment information.
                        </p>
                }
            </div>
        </div >
    )
}

export const getRoomAssignments = (assignments: AssignmentResponse[] | undefined | null, roomId: string) => {
    if (assignments === undefined || assignments === null) return []
    return assignments.filter(assignment => assignment.roomId === roomId)
}

export const getLastAssignment = (assignments: AssignmentResponse[] | null | undefined) => {
    if (assignments === undefined || assignments === null || assignments.length === 0) return undefined
    const sorted = assignments.sort(
        (b, a) => {
            const dateA = new Date(a.dueAt);
            const dateB = new Date(b.dueAt);
            return dateA.getTime() - dateB.getTime();
        });
    return sorted[0];
}


const RoomDetails = ({ room, assignments }: { room: Room, assignments: AssignmentResponse[] }) => {
    const lastAssignment = getLastAssignment(assignments);

    return (
        <div className='border-primary-400 border-2 p-2 rounded-md'>
            <div className='bg-cyan-100 p-4'>
                <p className='bg-secondary-100 border-1 border-amber-900 p-1 rounded-md'>
                    <b>Room {room.number}</b>
                </p>
                <p className='p-1'>
                    <b>Status: </b>
                    {room.cleanliness}
                </p>
                <p className='p-1'>
                    <b>Vacancy: </b>
                    {room.occupancy}
                </p>
                {
                    room.notes &&
                    <p className='p-1'>
                        {room.notes}
                    </p>
                }
                {
                    <AssignmentTile assignment={lastAssignment} />
                }
            </div>
        </div>
    )
}

const AssignmentTile = ({ assignment }: { assignment: AssignmentResponse | undefined }) => {
    if (!assignment) return null;
    const txt = new Date(assignment.dueAt) < new Date() ? "Last assignment" : "Current assignment";

    return (
        <div className='border-1 border-danger-600 p-2'>
            <p>
                {txt}
            </p>
            <ul>
                <li>{assignment.room.number}</li>
                <li>{new Date(assignment.dueAt).toLocaleDateString("de")}</li>
                <li>{assignment.status}</li>
                <li>Assigned by: {assignment.assignedByUser?.name}</li>
                <li>Cleaners: <ClickableNames users={assignment.cleaners} /></li>
                <li className='flex flex-wrap gap-2'>
                    {
                        assignment.AssignmentNote.map(
                            note => <span className='p-1 bg-secondary-100' key={note.id}>{note.content}</span>
                        )
                    }
                </li>
            </ul>
        </div>
    )
}