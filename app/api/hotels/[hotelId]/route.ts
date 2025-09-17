import { CustomSuccessMessages, DefaultMessages, GeneralErrors, HttpStatus } from "@constants";
import { canDeleteHotel, canUpdateHotel, canViewHotel, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import type { HotelParams } from "@lib/types";
import { NextRequest, NextResponse } from "next/server";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: HotelParams }) => {

        const hotel = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canViewHotel({ roles, hotelId: hotel.id })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);

        return NextResponse.json(hotel);
    })


export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: HotelParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId)

        const { roles } = await getUserOrThrow(req);

        if (!canUpdateHotel({ roles })) throw APP_ERRORS.forbidden();

        //to-do: validate update fields
        const data: Record<string, any> = await req.json();

        const updateFields: string[] = Object.keys(data);
        const forbiddenFields: string[] = ["id", "createdAt", "updatedAt"];

        const forbiddenFieldsContained = updateFields.filter(f => forbiddenFields.includes(f));
        const allowedFields: string[] = updateFields.filter(f => !forbiddenFields.includes(f));

        // Filtered object containing only allowed fields
        const filteredData: Record<string, any> = allowedFields.reduce((acc, field) => {
            acc[field] = data[field];
            return acc;
        }, {} as Record<string, any>);

        // Now, `filteredData` contains only the allowed fields
        const updatedHotel = await prisma.hotel.update({ where: { id: hotelId }, data: filteredData, });
        const forbiddenMessage = `These Fields Are Not Allowed To Be Updated: ${forbiddenFieldsContained.reduce((acc, cur) => { acc += `${cur}, `; return acc }, "")}`;


        return NextResponse.json(updatedHotel, { status: HttpStatus.OK, statusText: forbiddenFieldsContained.length > 0 ? forbiddenMessage : DefaultMessages[200] });

    })


export const DELETE = withErrorHandling(
    async (req: NextRequest, { params }: { params: HotelParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canDeleteHotel({ roles })) throw APP_ERRORS.forbidden();

        await prisma.hotel.delete({ where: { id: hotelId } });

        return NextResponse.json({ message: CustomSuccessMessages.HOTEL_DELETED_SUCCESSFULLY });
    })