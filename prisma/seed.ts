import { prisma } from "@lib/prisma";
import { hash } from "bcrypt";

import { hotels, people, type THotel, type TUser, } from "./seeding/data";


const createHotel = async ({ name, ...rest }: THotel) => {
    let hotel = await prisma.hotel.findUnique({ where: { name } });
    if (!hotel) {
        hotel = await prisma.hotel.create({ data: { name, ...rest, }, });
    }
    return hotel
}


const createUser = async (extendedUser: TUser & { hotelId: string }) => {

    const { email, hotelId, level, name, password } = extendedUser;
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (!existing) {
        const passwordHash = await hash(password, 10);

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        const createdRole = await prisma.role.create({
            data: {
                userId: createdUser.id,
                hotelId,
                level,
                status: "ACTIVE"
            }
        })

        return { createdUser, createdRole };
    }
}





async function main() {
    const zentraleH = (await createHotel(hotels.zentrale))
    const laLunaH = (await createHotel(hotels.laLuna))
    const khanAlHarirH = (await createHotel(hotels.khanAlHarir))

    await createUser({ ...people.admin1, hotelId: zentraleH.id });
    await createUser({ ...people.admin2, hotelId: zentraleH.id });
    await createUser({ ...people.manager_laLuna, hotelId: laLunaH.id });
    await createUser({ ...people.cleanerLaLuna1, hotelId: laLunaH.id });
    await createUser({ ...people.cleanerLaLuna2, hotelId: laLunaH.id });
    await createUser({ ...people.manager_khanAlHarir, hotelId: khanAlHarirH.id });
    await createUser({ ...people.cleanerKhanAlHarir1, hotelId: khanAlHarirH.id });
    await createUser({ ...people.cleanerKhanAlHarir2, hotelId: khanAlHarirH.id });
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
