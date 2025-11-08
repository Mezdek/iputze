import type { TSEEDING_RoomCreation, TSEEDING_Task } from '@/types';

// Hotels

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

export const roomsLaLuna: TSEEDING_RoomCreation[] = [
  // Ground Floor
  {
    number: '101',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['charles@cleaners.com'],
  },
  {
    number: '102',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['elon@cleaners.com'],
  },
  {
    number: '103',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['sofia@cleaners.com'],
  },
  {
    number: '104',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['charles@cleaners.com'],
  },
  {
    number: '105',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['elon@cleaners.com'],
  },

  // First Floor
  {
    number: '201',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '2',
    defaultCleanersEmails: ['sofia@cleaners.com', 'charles@cleaners.com'],
  },
  {
    number: '202',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['elon@cleaners.com'],
  },
  {
    number: '203',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['charles@cleaners.com'],
  },
  {
    number: '204',
    occupancy: 'UNAVAILABLE',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    notes: 'Wartung - Klimaanlage defekt',
    defaultCleanersEmails: [],
  },
  {
    number: '205',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '2',
    defaultCleanersEmails: ['sofia@cleaners.com'],
  },

  // Second Floor
  {
    number: '301',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['charles@cleaners.com'],
  },
  {
    number: '302',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['elon@cleaners.com'],
  },
  {
    number: '303',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['sofia@cleaners.com'],
  },
  {
    number: '304',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 3,
    floor: '3',
    defaultCleanersEmails: ['charles@cleaners.com'],
  },
  {
    number: '305',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '3',
    defaultCleanersEmails: ['sofia@cleaners.com', 'elon@cleaners.com'],
  },
];
export const roomsKhanAlHarir: TSEEDING_RoomCreation[] = [
  // Ground Floor
  {
    number: '101',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
  {
    number: '102',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['dora@cleaners.com'],
  },
  {
    number: '103',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },
  {
    number: '104',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
  {
    number: '105',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['dora@cleaners.com'],
  },
  {
    number: '106',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '1',
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },

  // First Floor
  {
    number: '201',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '2',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
  {
    number: '202',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['dora@cleaners.com'],
  },
  {
    number: '203',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },
  {
    number: '204',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
  {
    number: '205',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Suite',
    capacity: 4,
    floor: '2',
    notes: 'VIP Gast - Extra sorgfältig',
    defaultCleanersEmails: ['bertha@cleaners.com', 'fatima@cleaners.com'],
  },
  {
    number: '206',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '2',
    defaultCleanersEmails: ['dora@cleaners.com'],
  },

  // Second Floor
  {
    number: '301',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },
  {
    number: '302',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
  {
    number: '303',
    occupancy: 'VACANT',
    cleanliness: 'CLEAN',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    defaultCleanersEmails: ['dora@cleaners.com'],
  },
  {
    number: '304',
    occupancy: 'OCCUPIED',
    cleanliness: 'DIRTY',
    type: 'Deluxe',
    capacity: 3,
    floor: '3',
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },
  {
    number: '305',
    occupancy: 'UNAVAILABLE',
    cleanliness: 'DIRTY',
    type: 'Standard',
    capacity: 2,
    floor: '3',
    notes: 'Renovierung',
    defaultCleanersEmails: [],
  },
  {
    number: '306',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Suite',
    capacity: 4,
    floor: '3',
    defaultCleanersEmails: ['bertha@cleaners.com', 'fatima@cleaners.com'],
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
    defaultCleanersEmails: [
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
    defaultCleanersEmails: ['fatima@cleaners.com'],
  },
  {
    number: '403',
    occupancy: 'OCCUPIED',
    cleanliness: 'CLEAN',
    type: 'Deluxe',
    capacity: 2,
    floor: '4',
    defaultCleanersEmails: ['bertha@cleaners.com'],
  },
];

// Task Templates (will be created as pending/in-progress)

export const tasksLaLuna: TSEEDING_Task[] = [
  {
    roomNumber: '101',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['charles@cleaners.com'],
    notes: 'Gast checkt bald aus',
  },
  {
    roomNumber: '104',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['charles@cleaners.com'],
  },
  {
    roomNumber: '201',
    status: 'PENDING',
    priority: 'HIGH',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['sofia@cleaners.com', 'charles@cleaners.com'],
    notes: 'Urgent - VIP Gast kommt',
  },
  {
    roomNumber: '301',
    status: 'PENDING',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['charles@cleaners.com'],
  },
  {
    roomNumber: '303',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['sofia@cleaners.com'],
  },
];

function tomorrowAt(time: string): Date {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // matches HH:MM in 24-hour format

  if (typeof time !== 'string') {
    throw new Error('Time must be a string');
  }

  if (!timePattern.test(time)) {
    throw new Error('Invalid time format. Expected HH:MM in 24-hour format.');
  }

  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(hour, minute, 0, 0);

  return tomorrow;
}

export const tasksKhanAlHarir: TSEEDING_Task[] = [
  {
    roomNumber: '101',
    status: 'PENDING',
    priority: 'LOW',
    cleaners: ['bertha@cleaners.com'],
    dueAt: tomorrowAt('11:00'),
  },
  {
    roomNumber: '104',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['bertha@cleaners.com'],
  },
  {
    roomNumber: '201',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['bertha@cleaners.com'],
  },
  {
    roomNumber: '202',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['dora@cleaners.com'],
  },
  {
    roomNumber: '205',
    status: 'PENDING',
    priority: 'HIGH',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['bertha@cleaners.com', 'fatima@cleaners.com'],
    notes: 'VIP Suite - Extra sorgfältig',
  },
  {
    roomNumber: '301',
    status: 'PENDING',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['fatima@cleaners.com'],
  },
  {
    roomNumber: '304',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueAt: tomorrowAt('11:00'),
    cleaners: ['fatima@cleaners.com'],
  },
  {
    roomNumber: '401',
    status: 'PENDING',
    priority: 'HIGH',
    dueAt: tomorrowAt('11:00'),
    cleaners: [
      'bertha@cleaners.com',
      'fatima@cleaners.com',
      'dora@cleaners.com',
    ],
    notes: 'Präsidentensuite - Team-Aufgabe',
  },
];
