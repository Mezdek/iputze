import { RoleLevel } from "@prisma/client";

// Hotels
export type THotel = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
};



export const hotels: Record<string, THotel> = {
    zentrale: {
        name: "Zentrale",
        address: "Hauptstraße 1, 10963 Berlin",
        description: "Dies is kein Hotel",
        email: "zentrale@iputze.com",
        phone: "+49303456789"

    },
    laLuna: {
        name: "La Luna",
        address: "Romstraße 1, 10963 Berlin",
        description: "Hotel La Luna",
        email: "manager@laluna.com",
        phone: "+49303456780"
    }
    , khanAlHarir: {
        name: "Khan Al Harir",
        address: "Damascusstraße 1, 10963 Berlin",
        description: "Hotel Khan Al Harir",
        email: "manager@khan-alharir.com",
        phone: "+49303456781"
    }
}




// People

export type TUser = { name: string; email: string; password: string, hotelName: string, level: RoleLevel };

export const people: Record<string, TUser> = {


    admin1: {
        email: "anwar@iputze.com",
        name: "Anwar",
        password: "anwar@shabbout",
        hotelName: "Zentrale",
        level: "ADMIN"

    },
    admin2: {
        email: "mezdek@iputze.com",
        name: "Mezdek",
        password: "mezdek@osman",
        hotelName: "Zentrale",
        level: "ADMIN"
    },

    manager_khanAlHarir: {
        email: "mustafa@khan-alharir.com",
        name: "Mustafa",
        password: "mustafa@harir",
        hotelName: "Khan Al Harir",
        level: "MANAGER"
    },

    manager_laLuna: {
        email: "antonio@laluna.com",
        name: "Antonio",
        password: "antonio@luna",
        hotelName: "La Luna",
        level: "MANAGER"
    },

    cleanerKhanAlHarir1: {
        email: "bertha@cleaners.com",
        name: "Bertha",
        password: "bertha@bernard",
        hotelName: "Khan Al Harir",
        level: "CLEANER"
    },

    cleanerKhanAlHarir2: {
        email: "dora@cleaners.com",
        name: "Dora",
        password: "dora@daniel",
        hotelName: "Khan Al Harir",
        level: "CLEANER"
    },

    cleanerLaLuna1: {
        email: "charles@cleaners.com",
        name: "Charles",
        password: "charles@chaplin",
        hotelName: "La Luna",
        level: "CLEANER"
    },
    cleanerLaLuna2: {
        email: "elon@cleaners.com",
        name: "Elon",
        password: "elon@must",
        hotelName: "La Luna",
        level: "CLEANER"
    },
}