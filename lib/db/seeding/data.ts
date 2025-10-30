import type { RoleLevel, RoomCleanliness, RoomOccupancy } from '@prisma/client';

// Hotels
export type THotel = {
  name: string;
  address?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  description?: string | undefined;
};

export const hotels = {
  zentrale: {
    name: 'Zentrale',
    address: 'Hauptstraße 1, 10963 Berlin',
    description: 'Dies ist kein Hotel - Verwaltungszentrale',
    email: 'zentrale@iputze.com',
    phone: '+49303456789',
  },
  laLuna: {
    name: 'La Luna',
    address: 'Romstraße 1, 10963 Berlin',
    description:
      'Boutique Hotel La Luna - Italienisches Flair im Herzen Berlins',
    email: 'manager@laluna.com',
    phone: '+49303456780',
  },
  khanAlHarir: {
    name: 'Khan Al Harir',
    address: 'Damascusstraße 1, 10963 Berlin',
    description: 'Hotel Khan Al Harir - Orientalische Gastfreundschaft',
    email: 'manager@khan-alharir.com',
    phone: '+49303456781',
  },
} as const;

// Users
export type TUser = {
  name: string;
  email: string;
  password: string;
  hotelName: string;
  level: RoleLevel;
  avatarUrl?: string | undefined;
};

export const users = {
  admin1: {
    email: 'anwar@iputze.com',
    name: 'Anwar Shabbout',
    password: 'anwar@shabbout',
    hotelName: 'Zentrale',
    level: 'ADMIN',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anwar',
    notes: 'Hauptadministrator - Vollzugriff auf alle Hotels',
  },
  admin2: {
    email: 'mezdek@iputze.com',
    name: 'Mezdek Osman',
    password: 'mezdek@osman',
    hotelName: 'Zentrale',
    level: 'ADMIN',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mezdek',
    notes: 'Administrator - Vollzugriff auf alle Hotels',
  },

  managerKhanAlHarir: {
    email: 'mustafa@khan-alharir.com',
    name: 'Mustafa Harir',
    password: 'mustafa@harir',
    hotelName: 'Khan Al Harir',
    level: 'MANAGER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mustafa',
    notes: 'Hotelmanager Khan Al Harir',
  },

  managerLaLuna: {
    email: 'antonio@laluna.com',
    name: 'Antonio Luna',
    password: 'antonio@luna',
    hotelName: 'La Luna',
    level: 'MANAGER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio',
    notes: 'Hotelmanager La Luna',
  },

  cleanerKhanAlHarir1: {
    email: 'bertha@cleaners.com',
    name: 'Bertha Bernard',
    password: 'bertha@bernard',
    hotelName: 'Khan Al Harir',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bertha',
    notes: 'Zimmermädchen - Erfahren mit Suiten',
  },

  cleanerKhanAlHarir2: {
    email: 'dora@cleaners.com',
    name: 'Dora Daniel',
    password: 'dora@daniel',
    hotelName: 'Khan Al Harir',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dora',
  },

  cleanerKhanAlHarir3: {
    email: 'fatima@cleaners.com',
    name: 'Fatima Al-Rashid',
    password: 'fatima@rashid',
    hotelName: 'Khan Al Harir',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
  },

  cleanerLaLuna1: {
    email: 'charles@cleaners.com',
    name: 'Charles Chaplin',
    password: 'charles@chaplin',
    hotelName: 'La Luna',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charles',
    notes: 'Spezialist für Express-Reinigung',
  },

  cleanerLaLuna2: {
    email: 'elon@cleaners.com',
    name: 'Elon Must',
    password: 'elon@must',
    hotelName: 'La Luna',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon',
  },

  cleanerLaLuna3: {
    email: 'sofia@cleaners.com',
    name: 'Sofia Romano',
    password: 'sofia@romano',
    hotelName: 'La Luna',
    level: 'CLEANER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
  },
} as const;

// Rooms
export type TRoom = {
  number: string;
  occupancy: RoomOccupancy;
  cleanliness: RoomCleanliness;
  type: string;
  capacity: number;
  floor: string;
  notes?: string | undefined;
  defaultCleanerEmails?: string[] | undefined; // Emails of default cleaners
};

export const roomsLaLuna: TRoom[] = [
  // Ground Floor
  {
    number: '101',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['charles@cleaners.com'],
  },
  {
    number: '102',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['elon@cleaners.com'],
  },
  {
    number: '103',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['sofia@cleaners.com'],
  },
  {
    number: '104',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['charles@cleaners.com'],
  },
  {
    number: '105',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['elon@cleaners.com'],
  },

  // First Floor
  {
    number: '201',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '2',
    defaultCleanerEmails: ['sofia@cleaners.com', 'charles@cleaners.com'],
  },
  {
    number: '202',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['elon@cleaners.com'],
  },
  {
    number: '203',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['charles@cleaners.com'],
  },
  {
    number: '204',
    occupancy: 'UNAVAILABLE',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    notes: 'Wartung - Klimaanlage defekt',
    defaultCleanerEmails: [],
  },
  {
    number: '205',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '2',
    defaultCleanerEmails: ['sofia@cleaners.com'],
  },

  // Second Floor
  {
    number: '301',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['charles@cleaners.com'],
  },
  {
    number: '302',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['elon@cleaners.com'],
  },
  {
    number: '303',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['sofia@cleaners.com'],
  },
  {
    number: '304',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 3,
    floor: '3',
    defaultCleanerEmails: ['charles@cleaners.com'],
  },
  {
    number: '305',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '3',
    defaultCleanerEmails: ['sofia@cleaners.com', 'elon@cleaners.com'],
  },
];

export const roomsKhanAlHarir: TRoom[] = [
  // Ground Floor
  {
    number: '101',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    number: '102',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['dora@cleaners.com'],
  },
  {
    number: '103',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    number: '104',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    number: '105',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['dora@cleaners.com'],
  },
  {
    number: '106',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },

  // First Floor
  {
    number: '201',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '2',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    number: '202',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['dora@cleaners.com'],
  },
  {
    number: '203',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    number: '204',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    number: '205',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Suite',
    capacity: 4,
    floor: '2',
    notes: 'VIP Gast - Extra sorgfältig',
    defaultCleanerEmails: ['bertha@cleaners.com', 'fatima@cleaners.com'],
  },
  {
    number: '206',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanerEmails: ['dora@cleaners.com'],
  },

  // Second Floor
  {
    number: '301',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    number: '302',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    number: '303',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanerEmails: ['dora@cleaners.com'],
  },
  {
    number: '304',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '3',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    number: '305',
    occupancy: 'UNAVAILABLE',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    notes: 'Renovierung',
    defaultCleanerEmails: [],
  },
  {
    number: '306',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '3',
    defaultCleanerEmails: ['bertha@cleaners.com', 'fatima@cleaners.com'],
  },

  // Third Floor
  {
    number: '401',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Presidential Suite',
    capacity: 6,
    floor: '4',
    notes: 'Präsidentensuite - Besondere Aufmerksamkeit',
    defaultCleanerEmails: [
      'bertha@cleaners.com',
      'fatima@cleaners.com',
      'dora@cleaners.com',
    ],
  },
  {
    number: '402',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '4',
    defaultCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    number: '403',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '4',
    defaultCleanerEmails: ['bertha@cleaners.com'],
  },
];

// Task Templates (will be created as pending/in-progress)
export type TTaskTemplate = {
  roomNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: number;
  dueHoursFromNow: number; // Hours from now
  assignedCleanerEmails: string[];
  notes?: string | undefined;
};

export const tasksLaLuna: TTaskTemplate[] = [
  {
    roomNumber: '101',
    status: 'PENDING',
    priority: 1,
    dueHoursFromNow: 2,
    assignedCleanerEmails: ['charles@cleaners.com'],
    notes: 'Gast checkt bald aus',
  },
  {
    roomNumber: '104',
    status: 'IN_PROGRESS',
    priority: 0,
    dueHoursFromNow: 3,
    assignedCleanerEmails: ['charles@cleaners.com'],
  },
  {
    roomNumber: '201',
    status: 'PENDING',
    priority: 2,
    dueHoursFromNow: 1,
    assignedCleanerEmails: ['sofia@cleaners.com', 'charles@cleaners.com'],
    notes: 'Urgent - VIP Gast kommt',
  },
  {
    roomNumber: '301',
    status: 'PENDING',
    priority: 0,
    dueHoursFromNow: 4,
    assignedCleanerEmails: ['charles@cleaners.com'],
  },
  {
    roomNumber: '303',
    status: 'IN_PROGRESS',
    priority: 0,
    dueHoursFromNow: 2,
    assignedCleanerEmails: ['sofia@cleaners.com'],
  },
];

export const tasksKhanAlHarir: TTaskTemplate[] = [
  {
    roomNumber: '101',
    status: 'PENDING',
    priority: 0,
    dueHoursFromNow: 2,
    assignedCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    roomNumber: '104',
    status: 'IN_PROGRESS',
    priority: 0,
    dueHoursFromNow: 3,
    assignedCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    roomNumber: '201',
    status: 'PENDING',
    priority: 1,
    dueHoursFromNow: 2,
    assignedCleanerEmails: ['bertha@cleaners.com'],
  },
  {
    roomNumber: '202',
    status: 'IN_PROGRESS',
    priority: 0,
    dueHoursFromNow: 4,
    assignedCleanerEmails: ['dora@cleaners.com'],
  },
  {
    roomNumber: '205',
    status: 'PENDING',
    priority: 2,
    dueHoursFromNow: 1,
    assignedCleanerEmails: ['bertha@cleaners.com', 'fatima@cleaners.com'],
    notes: 'VIP Suite - Extra sorgfältig',
  },
  {
    roomNumber: '301',
    status: 'PENDING',
    priority: 0,
    dueHoursFromNow: 5,
    assignedCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    roomNumber: '304',
    status: 'IN_PROGRESS',
    priority: 0,
    dueHoursFromNow: 3,
    assignedCleanerEmails: ['fatima@cleaners.com'],
  },
  {
    roomNumber: '401',
    status: 'PENDING',
    priority: 2,
    dueHoursFromNow: 2,
    assignedCleanerEmails: [
      'bertha@cleaners.com',
      'fatima@cleaners.com',
      'dora@cleaners.com',
    ],
    notes: 'Präsidentensuite - Team-Aufgabe',
  },
];
