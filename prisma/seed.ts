import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

import {
  assignmentsKhanAlHarir,
  assignmentsLaLuna,
  hotels,
  roomsKhanAlHarir,
  roomsLaLuna,
  type TAssignmentTemplate,
  type THotel,
  type TRoom,
  type TUser,
  users,
} from './seeding/data';

const prisma = new PrismaClient();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const log = (message: string, color: string = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Create or get hotel
const createHotel = async ({ name, ...rest }: THotel) => {
  let hotel = await prisma.hotel.findUnique({ where: { name } });
  if (!hotel) {
    hotel = await prisma.hotel.create({ data: { name, ...rest } });
    log(`  ✓ Created hotel: ${name}`, colors.green);
  } else {
    log(`  ↺ Hotel already exists: ${name}`, colors.yellow);
  }
  return hotel;
};

// Create or get user with role
const createUser = async (userData: TUser & { hotelId: string }) => {
  const { email, hotelId, level, name, password, avatarUrl, notes } = userData;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await hash(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl,
        notes,
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
const createRoom = async (
  roomData: TRoom,
  hotelId: string,
  userEmailMap: Map<string, string>
) => {
  const { number, defaultCleanerEmails, ...rest } = roomData;

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
      ...rest,
    },
  });

  // Assign default cleaners
  if (defaultCleanerEmails && defaultCleanerEmails.length > 0) {
    for (const email of defaultCleanerEmails) {
      const userId = userEmailMap.get(email);
      if (userId) {
        await prisma.defaultCleaners.create({
          data: {
            roomId: room.id,
            userId,
          },
        });
      }
    }
  }

  log(`  ✓ Created room: ${number} (${rest.type})`, colors.green);
  return room;
};

// Create assignment
const createAssignment = async (
  assignmentData: TAssignmentTemplate,
  hotelId: string,
  userEmailMap: Map<string, string>,
  managerUserId: string
) => {
  const {
    roomNumber,
    status,
    priority,
    dueHoursFromNow,
    assignedCleanerEmails,
    notes,
  } = assignmentData;

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

  // Check if assignment already exists
  const existingAssignment = await prisma.assignment.findFirst({
    where: {
      roomId: room.id,
      status: { in: ['PENDING', 'IN_PROGRESS'] },
    },
  });

  if (existingAssignment) {
    log(`  ↺ Active assignment exists for room: ${roomNumber}`, colors.yellow);
    return existingAssignment;
  }

  const dueAt = new Date();
  dueAt.setHours(dueAt.getHours() + dueHoursFromNow);

  const startedAt = status === 'IN_PROGRESS' ? new Date() : null;

  const assignment = await prisma.assignment.create({
    data: {
      roomId: room.id,
      status,
      priority,
      dueAt,
      startedAt,
      assignedById: managerUserId,
    },
  });

  // Assign cleaners
  for (const email of assignedCleanerEmails) {
    const userId = userEmailMap.get(email);
    if (userId) {
      await prisma.assignmentUser.create({
        data: {
          assignmentId: assignment.id,
          userId,
        },
      });
    }
  }

  // Add note if provided
  if (notes) {
    await prisma.assignmentNote.create({
      data: {
        assignmentId: assignment.id,
        authorId: managerUserId,
        content: notes,
      },
    });
  }

  log(`  ✓ Created assignment: Room ${roomNumber} (${status})`, colors.green);
  return assignment;
};

async function main() {
  log('\n🌱 Starting database seed...', colors.blue);
  log('═══════════════════════════════════════\n', colors.blue);

  // Clear existing data (optional - uncomment if you want to start fresh)
  // log('🗑️  Clearing existing data...', colors.yellow);
  // await prisma.assignmentNote.deleteMany();
  // await prisma.assignmentUser.deleteMany();
  // await prisma.assignment.deleteMany();
  // await prisma.defaultCleaners.deleteMany();
  // await prisma.room.deleteMany();
  // await prisma.role.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.refreshToken.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.hotel.deleteMany();
  // await prisma.auditLog.deleteMany();
  // log('✓ Cleared all data\n', colors.green);

  // 1. Create Hotels
  log('🏨 Creating hotels...', colors.blue);
  const zentraleH = await createHotel(hotels.zentrale);
  const laLunaH = await createHotel(hotels.laLuna);
  const khanAlHarirH = await createHotel(hotels.khanAlHarir);
  log('');

  // 2. Create Users and Roles
  log('👥 Creating users and roles...', colors.blue);

  const admin1 = await createUser({ ...users.admin1, hotelId: zentraleH.id });
  const admin2 = await createUser({ ...users.admin2, hotelId: zentraleH.id });

  const managerLaLuna = await createUser({
    ...users.managerLaLuna,
    hotelId: laLunaH.id,
  });
  const cleanerLaLuna1 = await createUser({
    ...users.cleanerLaLuna1,
    hotelId: laLunaH.id,
  });
  const cleanerLaLuna2 = await createUser({
    ...users.cleanerLaLuna2,
    hotelId: laLunaH.id,
  });
  const cleanerLaLuna3 = await createUser({
    ...users.cleanerLaLuna3,
    hotelId: laLunaH.id,
  });

  const managerKhanAlHarir = await createUser({
    ...users.managerKhanAlHarir,
    hotelId: khanAlHarirH.id,
  });
  const cleanerKhanAlHarir1 = await createUser({
    ...users.cleanerKhanAlHarir1,
    hotelId: khanAlHarirH.id,
  });
  const cleanerKhanAlHarir2 = await createUser({
    ...users.cleanerKhanAlHarir2,
    hotelId: khanAlHarirH.id,
  });
  const cleanerKhanAlHarir3 = await createUser({
    ...users.cleanerKhanAlHarir3,
    hotelId: khanAlHarirH.id,
  });
  log('');

  // Create email-to-userId map
  const userEmailMap = new Map<string, string>();
  const allUsers = await prisma.user.findMany();
  allUsers.forEach((user) => userEmailMap.set(user.email, user.id));

  // 3. Create Rooms for La Luna
  log('🛏️  Creating rooms for La Luna...', colors.blue);
  for (const roomData of roomsLaLuna) {
    await createRoom(roomData, laLunaH.id, userEmailMap);
  }
  log('');

  // 4. Create Rooms for Khan Al Harir
  log('🛏️  Creating rooms for Khan Al Harir...', colors.blue);
  for (const roomData of roomsKhanAlHarir) {
    await createRoom(roomData, khanAlHarirH.id, userEmailMap);
  }
  log('');

  // 5. Create Assignments for La Luna
  log('📋 Creating assignments for La Luna...', colors.blue);
  for (const assignmentData of assignmentsLaLuna) {
    await createAssignment(
      assignmentData,
      laLunaH.id,
      userEmailMap,
      managerLaLuna.id
    );
  }
  log('');

  // 6. Create Assignments for Khan Al Harir
  log('📋 Creating assignments for Khan Al Harir...', colors.blue);
  for (const assignmentData of assignmentsKhanAlHarir) {
    await createAssignment(
      assignmentData,
      khanAlHarirH.id,
      userEmailMap,
      managerKhanAlHarir.id
    );
  }
  log('');

  // Summary
  log('═══════════════════════════════════════', colors.blue);
  log('✅ Database seeding completed!', colors.green);
  log('═══════════════════════════════════════\n', colors.blue);

  // Print summary statistics
  const hotelCount = await prisma.hotel.count();
  const userCount = await prisma.user.count();
  const roomCount = await prisma.room.count();
  const assignmentCount = await prisma.assignment.count();

  log('📊 Summary:', colors.cyan);
  log(`   Hotels: ${hotelCount}`, colors.cyan);
  log(`   Users: ${userCount}`, colors.cyan);
  log(`   Rooms: ${roomCount}`, colors.cyan);
  log(`   Assignments: ${assignmentCount}`, colors.cyan);
  log('');

  // Print login credentials
  log('🔑 Login Credentials:', colors.blue);
  log('═══════════════════════════════════════', colors.blue);
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
  log('\n═══════════════════════════════════════\n', colors.blue);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
