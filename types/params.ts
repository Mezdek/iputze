/* -----------------------------------
   Route Params
----------------------------------- */
export type HotelParams = { hotelId: string };
// Rooms
export type RoomCollectionParams = HotelParams;
export type RoomParams = RoomCollectionParams & { roomId: string };
// Roles
export type RoleCollectionParams = HotelParams;
export type RoleParams = RoleCollectionParams & { roleId: string };
// Assignments
export type AssignmentCollectionParams = HotelParams;
export type AssignmentParams = AssignmentCollectionParams & {
  assignmentId: string;
};
// AssignmentNotes
export type AssignmentNoteCollectionParams = AssignmentParams;
export type AssignmentNoteParams = AssignmentNoteCollectionParams & {
  assignmentNoteId: string;
};

/* -----------------------------------
   Request Bodies
----------------------------------- */
