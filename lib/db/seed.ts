import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

import { tomorrowAt } from '@/lib/shared/utils/date';
import type { HotelCreationBody } from '@/types';

import {
  hotels,
  roomsKhanAlHarir,
  roomsLaLuna,
  tasksKhanAlHarir,
  tasksLaLuna,
  users,
} from './seeding/data';
import type {
  TSEEDING_RoomCreation,
  TSEEDING_Task,
  TSEEDING_User,
} from './seeding/types';

const prisma = new PrismaClient();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const BCRYPT_ROUNDS = 12;

const log = (message: string, color: string = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Create or get hotel
const createHotel = async ({
  name,
  address,
  phone,
  email,
  description,
}: HotelCreationBody) => {
  let hotel = await prisma.hotel.findUnique({ where: { name } });
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        name,
        address: address ?? null,
        phone: phone ?? null,
        email: email ?? null,
        description: description ?? null,
      },
    });
    log(`  ✓ Created hotel: ${name}`, colors.green);
  } else {
    log(`  ↺ Hotel already exists: ${name}`, colors.yellow);
  }
  return hotel;
};

// Create or get user with role

const createUser = async (userData: TSEEDING_User, hotelId: string) => {
  const { email, level, name, password, avatarUrl } = userData;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await hash(password, BCRYPT_ROUNDS);

    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl: avatarUrl ?? null,
      },
    });
    log(`  ✓ Created user: ${name} (${email})`, colors.green);
  } else {
    log(`  ↺ User already exists: ${name}`, colors.yellow);
  }

  // Check if role exists
  const existingRole = await prisma.role.findUnique({
    where: {
      userId_hotelId_level: {
        userId: user.id,
        hotelId,
        level,
      },
    },
  });

  if (!existingRole) {
    await prisma.role.create({
      data: {
        userId: user.id,
        hotelId,
        level,
        status: 'ACTIVE',
      },
    });
    log(`    → Assigned role: ${level}`, colors.cyan);
  }

  return user;
};

// Create room with default cleaners
const createRoom = async (roomData: TSEEDING_RoomCreation, hotelId: string) => {
  const {
    number,
    occupancy,
    cleanliness,
    type,
    capacity,
    floor,
    notes,
    defaultCleanersEmails,
  } = roomData;

  const existingRoom = await prisma.room.findUnique({
    where: {
      hotelId_number: {
        hotelId,
        number,
      },
    },
  });

  if (existingRoom) {
    log(`  ↺ Room already exists: ${number}`, colors.yellow);
    return existingRoom;
  }

  const room = await prisma.room.create({
    data: {
      number,
      hotelId,
      occupancy,
      cleanliness,
      type,
      capacity,
      floor,
      notes: notes ?? null,
    },
  });

  // Assign default cleaners
  if (defaultCleanersEmails.length > 0) {
    const defaultCleaners = await prisma.user.findMany({
      where: { email: { in: defaultCleanersEmails } },
      select: { id: true },
    });

    const data = defaultCleaners.map(({ id }) => ({
      roomId: room.id,
      userId: id,
    }));

    await prisma.defaultCleaners.createMany({
      data,
    });
  }

  log(`  ✓ Created room: ${number} (${type})`, colors.green);
  return room;
};

// Create task
const createTask = async (
  taskData: TSEEDING_Task,
  hotelId: string,
  cleanersIds: string[],
  managerUserId: string
) => {
  const { roomNumber, status, priority, notes } = taskData;

  // Find room
  const room = await prisma.room.findUnique({
    where: {
      hotelId_number: {
        hotelId,
        number: roomNumber,
      },
    },
  });

  if (!room) {
    log(`  ✗ Room not found: ${roomNumber}`, colors.yellow);
    return;
  }

  const dueAt = tomorrowAt('11:00');

  const task = await prisma.task.create({
    data: {
      roomId: room.id,
      status,
      priority,
      dueAt,
      assignedById: managerUserId,
    },
  });

  // Assign cleaners
  if (cleanersIds.length > 0) {
    for (const userId of cleanersIds) {
      await prisma.taskUser.create({
        data: {
          taskId: task.id,
          userId,
        },
      });
    }
  }

  // Add note if provided
  if (notes) {
    await prisma.note.create({
      data: {
        taskId: task.id,
        authorId: managerUserId,
        content: notes,
      },
    });
  }

  log(`  ✓ Created task: Room ${roomNumber} (${status})`, colors.green);
  return task;
};

async function main() {
  log('\n🌱 Starting database seed...', colors.blue);
  log('╔═══════════════════════════════════╗\n', colors.blue);

  // Clear existing data (optional - uncomment if you want to start fresh)
  log('🗑️  Clearing existing data...', colors.yellow);
  await prisma.note.deleteMany();
  await prisma.taskUser.deleteMany();
  await prisma.task.deleteMany();
  await prisma.defaultCleaners.deleteMany();
  await prisma.room.deleteMany();
  await prisma.role.deleteMany();
  await prisma.session.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.auditLog.deleteMany();
  log('✓ Cleared all data\n', colors.green);

  // 1. Create Hotels
  log('🏨 Creating hotels...', colors.blue);
  const zentraleH = await createHotel(hotels['zentrale']);
  const laLunaH = await createHotel(hotels['laLuna']);
  const khanAlHarirH = await createHotel(hotels['khanAlHarir']);
  log('');

  // 2. Create Users and Roles
  log('👥 Creating users and roles...', colors.blue);

  await createUser(users['admin1'], zentraleH.id);
  await createUser(users['admin2'], zentraleH.id);

  const managerLaLuna = await createUser(users['managerLaLuna'], laLunaH.id);
  const cleanerLaLuna1 = await createUser(users['cleanerLaLuna1'], laLunaH.id);
  await createUser(users['cleanerLaLuna2'], laLunaH.id);
  await createUser(users['cleanerLaLuna3'], laLunaH.id);

  const managerKhanAlHarir = await createUser(
    users['managerKhanAlHarir'],
    khanAlHarirH.id
  );
  await createUser(users['cleanerKhanAlHarir1'], khanAlHarirH.id);
  const cleanerKhanAlHarir2 = await createUser(
    users['cleanerKhanAlHarir2'],
    khanAlHarirH.id
  );
  const cleanerKhanAlHarir3 = await createUser(
    users['cleanerKhanAlHarir3'],
    khanAlHarirH.id
  );
  log('');

  // 3. Create Rooms for La Luna
  log('🛏️  Creating rooms for La Luna...', colors.blue);
  for (const roomData of roomsLaLuna) {
    await createRoom(roomData, laLunaH.id);
  }
  log('');

  // 4. Create Rooms for Khan Al Harir
  log('🛏️  Creating rooms for Khan Al Harir...', colors.blue);
  for (const roomData of roomsKhanAlHarir) {
    await createRoom(roomData, khanAlHarirH.id);
  }
  log('');

  // 5. Create Tasks for La Luna
  log('📋 Creating tasks for La Luna...', colors.blue);
  for (const taskData of tasksLaLuna) {
    await createTask(
      taskData,
      laLunaH.id,
      [cleanerLaLuna1.id],
      managerLaLuna.id
    );
  }
  log('');

  // 6. Create Tasks for Khan Al Harir
  log('📋 Creating tasks for Khan Al Harir...', colors.blue);
  for (const taskData of tasksKhanAlHarir) {
    await createTask(
      taskData,
      khanAlHarirH.id,
      [cleanerKhanAlHarir3.id, cleanerKhanAlHarir2.id],
      managerKhanAlHarir.id
    );
  }
  log('');

  // Summary
  log('╔═══════════════════════════════════╗', colors.blue);
  log('✅ Database seeding completed!', colors.green);
  log('╚═══════════════════════════════════╝\n', colors.blue);

  // Print summary statistics
  const hotelCount = await prisma.hotel.count();
  const userCount = await prisma.user.count();
  const roomCount = await prisma.room.count();
  const taskCount = await prisma.task.count();

  log('📊 Summary:', colors.cyan);
  log(`   Hotels: ${hotelCount}`, colors.cyan);
  log(`   Users: ${userCount}`, colors.cyan);
  log(`   Rooms: ${roomCount}`, colors.cyan);
  log(`   Tasks: ${taskCount}`, colors.cyan);
  log('');

  // Print login credentials
  log('🔐 Login Credentials:', colors.blue);
  log('╔═══════════════════════════════════╗', colors.blue);
  log('\n👑 Admins:', colors.yellow);
  log('   Email: anwar@iputze.com', colors.cyan);
  log('   Password: anwar@shabbout', colors.cyan);
  log('   ---');
  log('   Email: mezdek@iputze.com', colors.cyan);
  log('   Password: mezdek@osman', colors.cyan);

  log('\n👔 Managers:', colors.yellow);
  log('   La Luna:', colors.green);
  log('   Email: antonio@laluna.com', colors.cyan);
  log('   Password: antonio@luna', colors.cyan);
  log('   ---');
  log('   Khan Al Harir:', colors.green);
  log('   Email: mustafa@khan-alharir.com', colors.cyan);
  log('   Password: mustafa@harir', colors.cyan);

  log('\n🧹 Cleaners:', colors.yellow);
  log('   La Luna:', colors.green);
  log('   - charles@cleaners.com / charles@chaplin', colors.cyan);
  log('   - elon@cleaners.com / elon@must', colors.cyan);
  log('   - sofia@cleaners.com / sofia@romano', colors.cyan);
  log('');
  log('   Khan Al Harir:', colors.green);
  log('   - bertha@cleaners.com / bertha@bernard', colors.cyan);
  log('   - dora@cleaners.com / dora@daniel', colors.cyan);
  log('   - fatima@cleaners.com / fatima@rashid', colors.cyan);
  log('\n╚═══════════════════════════════════╝\n', colors.blue);
}

main()
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('❌ Error seeding database:', message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
