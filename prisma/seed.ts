import { prisma } from "@lib/prisma";
import { hash } from "bcrypt";
import { admin1, admin2, cleanerKhanAlHarir1, cleanerKhanAlHarir2, cleanerLaLuna1, cleanerLaLuna2, khanAlHarir, laLuna, manager_khanAlHarir, manager_laLuna, THotel, TUser, zentrale } from "./people";


const createHotel = async ({ name, ...rest }: THotel) => {
    let hotel = await prisma.hotel.findUnique({ where: { name } });
    if (!hotel) {
        hotel = await prisma.hotel.create({ data: { name, ...rest, }, });
    }
    return hotel
}


const createUser = async (extendedUser: TUser & { hotelId: number }) => {

    const { email, hotelId, level, name, password } = extendedUser;
    console.log({ ...extendedUser })
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
    const zentraleH = (await createHotel(zentrale))
    const laLunaH = (await createHotel(laLuna))
    const khanAlHarirH = (await createHotel(khanAlHarir))

    await createUser({ ...admin1, hotelId: zentraleH.id });
    await createUser({ ...admin2, hotelId: zentraleH.id });
    await createUser({ ...manager_laLuna, hotelId: laLunaH.id });
    await createUser({ ...cleanerLaLuna1, hotelId: laLunaH.id });
    await createUser({ ...cleanerLaLuna2, hotelId: laLunaH.id });
    await createUser({ ...manager_khanAlHarir, hotelId: khanAlHarirH.id });
    await createUser({ ...cleanerKhanAlHarir1, hotelId: khanAlHarirH.id });
    await createUser({ ...cleanerKhanAlHarir2, hotelId: khanAlHarirH.id });
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
