# Database Seeding Guide

## 📁 File Structure

```shell
prisma/
├── schema.prisma
├── seed.ts
└── seeding/
    └── data.ts
```

## 🚀 Quick Start

### 1. Setup the seed script in `package.json`

Add this to your `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  }
}
```

### 2. Install required dependencies

```bash
npm install -D tsx
# or
pnpm add -D tsx
# or
yarn add -D tsx
```

### 3. Run migrations (first time)

```bash
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npm run db:seed
```

## 🔄 Reset Database (Clear & Reseed)

```bash
npm run db:reset
```

This will:

1. Drop the database
2. Run all migrations
3. Run the seed script automatically

## 📊 What Gets Seeded

### Hotels (3)

- **Zentrale** - Administrative center (not a real hotel)
- **La Luna** - Boutique hotel with 15 rooms
- **Khan Al Harir** - Larger hotel with 19 rooms

### Users (10)

- **2 Admins** - Full system access
- **2 Managers** - One per hotel
- **6 Cleaners** - 3 per hotel

### Rooms

- **La Luna**: 15 rooms across 3 floors
  - Mix of Standard, Deluxe, and Suite rooms
  - Various occupancy states (Occupied, Vacant, Unavailable)
  
- **Khan Al Harir**: 19 rooms across 4 floors
  - Includes a Presidential Suite
  - Rooms with different cleanliness states

### Assignments

- **La Luna**: 5 active assignments (mix of PENDING and IN_PROGRESS)
- **Khan Al Harir**: 8 active assignments

### Default Cleaners

- Each room has assigned default cleaners
- Cleaners are automatically linked to specific rooms

## 🔑 Login Credentials

### Admins

| Email | Password |
|-------|----------|
| <anwar@iputze.com> | anwar@shabbout |
| <mezdek@iputze.com> | mezdek@osman |

### Managers

| Hotel | Email | Password |
|-------|-------|----------|
| La Luna | <antonio@laluna.com> | antonio@luna |
| Khan Al Harir | <mustafa@khan-alharir.com> | mustafa@harir |

### Cleaners - La Luna

| Name | Email | Password |
|------|-------|----------|
| Charles Chaplin | <charles@cleaners.com> | charles@chaplin |
| Elon Must | <elon@cleaners.com> | elon@must |
| Sofia Romano | <sofia@cleaners.com> | sofia@romano |

### Cleaners - Khan Al Harir

| Name | Email | Password |
|------|-------|----------|
| Bertha Bernard | <bertha@cleaners.com> | bertha@bernard |
| Dora Daniel | <dora@cleaners.com> | dora@daniel |
| Fatima Al-Rashid | <fatima@cleaners.com> | fatima@rashid |

## 🛠️ Customization

### Modify Seed Data

Edit `prisma/seeding/data.ts` to:

- Add/remove hotels
- Add/remove users
- Modify room configurations
- Adjust assignment templates

### Re-run Seed (Without Clearing)

The seed script is idempotent - it won't create duplicates:

```bash
npm run db:seed
```

### Clear Specific Data

To start fresh, uncomment the clearing section in `seed.ts`:

```typescript
// Uncomment these lines in seed.ts
await prisma.assignmentNote.deleteMany();
await prisma.assignmentUser.deleteMany();
await prisma.assignment.deleteMany();
await prisma.defaultCleaners.deleteMany();
await prisma.room.deleteMany();
await prisma.role.deleteMany();
await prisma.session.deleteMany();
await prisma.refreshToken.deleteMany();
await prisma.user.deleteMany();
await prisma.hotel.deleteMany();
await prisma.auditLog.deleteMany();
```

## 🔍 Explore Your Data

Open Prisma Studio to browse the seeded data:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555`

## 📝 Notes

- **Passwords** are hashed using bcrypt (10 rounds)
- **UUIDs** are generated automatically for all IDs
- **Timestamps** are set automatically
- **Default cleaners** are linked through junction table
- **Assignments** have realistic due dates (1-5 hours from now)
- **Room states** reflect real-world scenarios (occupied/vacant/dirty/clean)

## 🐛 Troubleshooting

### "Table doesn't exist" error

```bash
npx prisma migrate deploy
```

### "Cannot find module" error

Make sure `tsx` is installed:

```bash
npm install -D tsx
```

### "Unique constraint failed" error

The data already exists. Either:

1. Run `npm run db:reset` to start fresh
2. Let the seed script skip existing records (default behavior)

### Check database connection

```bash
npx prisma db pull
```

## 🎯 Next Steps

After seeding:

1. Test login with different user roles
2. Explore room assignments in your app
3. Test cleaner assignment workflows
4. Verify role-based access control
5. Check audit log functionality

## 📚 Additional Commands

```bash
# Generate Prisma Client
npx prisma generate

# View current schema
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```
