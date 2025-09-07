import { RoleLevel } from "@prisma/client";

// Hotels
type THotel = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
};
const zentrale: THotel = {
    name: "Zentrale",
    address: "Hauptstraße 1, 10963 Berlin",
    description: "Dies is kein Hotel",
    email: "zentrale@iputze.com",
    phone: "+49303456789"
};

const laLuna: THotel = {
    name: "La Luna",
    address: "Romstraße 1, 10963 Berlin",
    description: "Hotel La Luna",
    email: "manager@laluna.com",
    phone: "+49303456780"
};

const khanAlHarir: THotel = {
    name: "Khan Al Harir",
    address: "Damascusstraße 1, 10963 Berlin",
    description: "Hotel Khan Al Harir",
    email: "manager@khan-alharir.com",
    phone: "+49303456781"
};


// People

type TUser = { name: string; email: string; password: string, hotelName: string, level: RoleLevel };
const admin1: TUser = {
    email: "anwar@iputze.com",
    name: "Anwar",
    password: "anwar@shabbout",
    hotelName: "Zentrale",
    level: "ADMIN"

};
const admin2: TUser = {
    email: "mezdek@iputze.com",
    name: "Mezdek",
    password: "mezdek@osman",
    hotelName: "Zentrale",
    level: "ADMIN"
};

const manager_khanAlHarir: TUser = {
    email: "mustafa@khan-alharir.com",
    name: "Mustafa",
    password: "mustafa@harir",
    hotelName: "Khan Al Harir",
    level: "MANAGER"
};

const manager_laLuna: TUser = {
    email: "antonio@lalauna.com",
    name: "Antonio",
    password: "antonio@luna",
    hotelName: "La Luna",
    level: "MANAGER"
};

const cleanerKhanAlHarir1: TUser = {
    email: "bertha@cleaners.com",
    name: "Bertha",
    password: "bertha@bernard",
    hotelName: "Khan Al Harir",
    level: "CLEANER"
};

const cleanerKhanAlHarir2: TUser = {
    email: "dora@cleaners.com",
    name: "Dora",
    password: "dora@daniel",
    hotelName: "Khan Al Harir",
    level: "CLEANER"
};

const cleanerLaLuna1: TUser = {
    email: "charles@cleaners.com",
    name: "Charles",
    password: "charles@chaplin",
    hotelName: "La Luna",
    level: "CLEANER"
};
const cleanerLaLuna2: TUser = {
    email: "elon@cleaners.com",
    name: "Elon",
    password: "elon@must",
    hotelName: "La Luna",
    level: "CLEANER"
};


export { admin1, admin2, cleanerKhanAlHarir1, cleanerKhanAlHarir2, cleanerLaLuna1, cleanerLaLuna2, khanAlHarir, laLuna, manager_khanAlHarir, manager_laLuna, zentrale, type THotel, type TUser };

