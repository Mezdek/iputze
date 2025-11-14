# 🏨 iputze - Hotel Cleaning Management System

> Modern, full-stack platform for coordinating hotel cleaning operations across multiple properties with role-based access control and real-time task management.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 Features

### Core Functionality

- 🏢 **Multi-Hotel Management** - Manage multiple properties from a single platform
- 👥 **Role-Based Access Control** - Four role levels: Admin, Manager, Cleaner, Pending
- ✅ **Task Management** - Create, assign, track, and complete cleaning tasks
- 📅 **Timeline View** - Weekly task scheduling and workload visualization
- 🏠 **Room Management** - Track room status (occupancy, cleanliness)
- 📸 **Task Documentation** - Image uploads and notes for quality assurance
- 🌐 **Internationalization** - Multi-language support (currently English)

### Security & Performance

- 🔐 **Secure Authentication** - Session-based auth with bcrypt password hashing
- 🛡️ **CSRF Protection** - Origin validation for state-changing requests
- 🚦 **Rate Limiting** - API request throttling (configured, implementation pending)
- ⚡ **Modern Stack** - Built on Next.js 15, React 19, TypeScript
- 🗃️ **Optimized Database** - Indexed queries, soft deletes, audit trails

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Database**: PostgreSQL (production) or SQLite (development)
- **Optional**: Redis (for rate limiting)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Mezdek/iputze.git
cd iputze
```

2.**Install dependencies**

```bash
npm install
```

3.**Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/iputze"

# For development, you can use SQLite:
# DATABASE_URL="file:./dev.db"

# Authentication
SESSION_COOKIE_EXP="7d"
SESSION_SECRET="your-secret-key-here"  # Generate: openssl rand -base64 32

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Upstash Redis (optional, for rate limiting)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

4.**Initialize the database**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

5.**Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 👤 Default Login Credentials

After running `npm run db:seed`, you can log in with these accounts:

### Admin Account

- **Email**: `admin@iputze.com`
- **Password**: `Admin123!`
- **Access**: Full system access

### Manager Accounts

- **La Luna Hotel**:
  - Email: `manager.laluna@iputze.com`
  - Password: `Manager123!`
- **Khan Al Harir Hotel**:
  - Email: `manager.khan@iputze.com`
  - Password: `Manager123!`

### Cleaner Accounts

- **La Luna Hotel**:
  - Email: `cleaner1.laluna@iputze.com`
  - Password: `Cleaner123!`
- **Khan Al Harir Hotel**:
  - Email: `cleaner1.khan@iputze.com`
  - Password: `Cleaner123!`

⚠️ **Important**: Change these credentials in production!

---

## 🏗️ Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Components**: [HeroUI 2.8](https://heroui.com/)
- **Animation**: [Framer Motion 12](https://www.framer.com/motion/)
- **Forms**: [React Hook Form 7](https://react-hook-form.com/)
- **Validation**: [Zod 4](https://zod.dev/)
- **State Management**: [TanStack Query 5](https://tanstack.com/query)

### Backend

- **Database**: [PostgreSQL](https://www.postgresql.org/) / [SQLite](https://www.sqlite.org/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Authentication**: Custom session-based auth with JWT
- **Password Hashing**: [bcrypt 6](https://www.npmjs.com/package/bcrypt)
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)

### Image Management

- **Cloud Storage**: [Cloudinary 2](https://cloudinary.com/)
- **EXIF Processing**: [ExifReader 4](https://www.npmjs.com/package/exifreader)

### Internationalization

- **i18n**: [next-intl 4](https://next-intl-docs.vercel.app/)
- **Date Handling**: [date-fns 4](https://date-fns.org/)
- **Timezone**: [date-fns-tz 3](https://www.npmjs.com/package/date-fns-tz)

### Development Tools

- **Linting**: [ESLint 9](https://eslint.org/) with TypeScript support
- **Formatting**: [Prettier 3](https://prettier.io/)
- **Type Checking**: TypeScript strict mode

---

## 📁 Project Structure

``` shell
iputze/
├── app/                      # Next.js App Router
│   ├── api/v1/              # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── hotels/          # Hotel & resource endpoints
│   ├── dashboard/           # Dashboard page
│   ├── hotels/[hotelId]/    # Hotel detail pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
│
├── components/              # React components
│   ├── features/            # Feature-specific components
│   │   ├── FloorMapView/    # Floor plan visualization
│   │   └── TimeLineView/    # Weekly timeline view
│   ├── shared/              # Shared components
│   ├── ui/                  # UI primitives
│   └── widgets/             # Composite widgets
│
├── hooks/                   # Custom React hooks
│   ├── mutations/           # Data mutation hooks
│   ├── useFloorMap.ts       # Floor map logic
│   └── useTimelineData.ts   # Timeline data processing
│
├── lib/                     # Business logic & utilities
│   ├── client/              # Client-side utilities
│   │   ├── api/             # API client
│   │   └── features/        # Client business logic
│   ├── server/              # Server-side utilities
│   │   ├── db/              # Database utilities
│   │   │   ├── schema.prisma # Prisma schema
│   │   │   ├── migrations/  # DB migrations
│   │   │   ├── seed.ts      # Seed script
│   │   │   └── utils/       # DB helper functions
│   │   └── utils/           # Server utilities
│   │       ├── cloudinary.ts # Image upload
│   │       ├── exif.ts      # EXIF processing
│   │       └── rateLimit.ts # Rate limiting
│   └── shared/              # Shared between client/server
│       ├── constants/       # App constants & errors
│       ├── errors/          # Error handling
│       ├── utils/           # Shared utilities
│       │   └── permissions/ # Permission system
│       └── validation/      # Zod schemas
│
├── i18n/                    # Internationalization
│   ├── messages/            # Translation files
│   └── request.ts           # i18n configuration
│
├── providers/               # React context providers
│   ├── ClientSideProviders.tsx
│   └── ServerSideProviders.tsx
│
├── config/                  # App configuration
│   └── company.ts           # Company settings
│
├── middleware.ts            # Next.js middleware (CSRF)
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

---

## 🔧 Available Scripts

### Development

```bash
npm run dev              # Start dev server with Turbopack
npm run tsc              # Type checking without emitting
```

### Building

```bash
npm run next:build       # Build production bundle
npm run next:start       # Start production server
npm run next:lint        # Run Next.js linter
```

### Database

```bash
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema changes (dev only)
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (⚠️ destroys data)
npm run db:studio        # Open Prisma Studio GUI
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run lint:format      # Run both linting and format check
```

---

## 🗃️ Database Schema

### Core Models

#### **Hotel**

Properties that contain rooms and manage staff.

- Unique name, contact information
- Related: Rooms, Roles

#### **Room**

Individual rooms in hotels.

- Room number, type, floor, capacity
- Status: Occupancy (vacant/occupied/unavailable)
- Status: Cleanliness (clean/dirty)
- Related: Hotel, Tasks, DefaultCleaners

#### **User**

System users (admins, managers, cleaners).

- Authentication credentials
- Profile information (name, avatar, bio)
- Timezone preference
- Related: Roles, Tasks, Sessions

#### **Role**

Defines user access levels per hotel.

- Levels: ADMIN, MANAGER, CLEANER, PENDING
- Status: ACTIVE, DISABLED
- Related: User, Hotel

#### **Task**

Cleaning tasks assigned to rooms.

- Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- Priority: HIGH, MEDIUM, LOW
- Timestamps: due, started, completed, cancelled
- Related: Room, Creator, Cleaners, Notes, Images

#### **Cleaner**

Many-to-many relationship: Tasks ↔ Users

- Tracks which cleaners are assigned to which tasks
- Assignment timestamp

#### **DefaultCleaners**

Default cleaner assignments for rooms.

- Automatically assigns tasks to preferred cleaners

#### **Note**

Text notes on tasks for communication.

- Related: Task, Author

#### **Image**

Photos uploaded for task documentation.

- Cloudinary URL, EXIF data
- Related: Task, Uploader, Deletor

#### **Session**

User authentication sessions.

- Session tokens, expiry
- Device and location tracking
- Related: User

### Relationships Diagram

``` shell
Hotel 1──────∞ Room
  │              │
  │              │
  ∞              ∞
Role           Task
  │              │
  │              ├───∞ Cleaner
  │              ├───∞ Note  
  │              └───∞ Image
  │              
  ∞
User
  │
  └───∞ Session
```

---

## 📚 API Documentation

### Base URL

``` shell
Development: http://localhost:3000/api/v1
Production:  https://your-domain.com/api/v1
```

### Authentication

All protected endpoints require a valid session cookie.

### Endpoints

#### Authentication Endpoints

```http
POST   /api/v1/auth/signup    # Create new user account
POST   /api/v1/auth/signin    # Log in
POST   /api/v1/auth/signout   # Log out
GET    /api/v1/auth/me        # Get current user
```

#### Hotels

```http
GET    /api/v1/hotels                      # List all hotels
GET    /api/v1/hotels/:hotelId             # Get hotel details
GET    /api/v1/hotels/:hotelId/tasks       # List tasks (with date filtering)
POST   /api/v1/hotels/:hotelId/tasks       # Create task
```

#### Rooms

```http
GET    /api/v1/hotels/:hotelId/rooms              # List rooms
POST   /api/v1/hotels/:hotelId/rooms              # Create room
GET    /api/v1/hotels/:hotelId/rooms/:roomId      # Get room
PATCH  /api/v1/hotels/:hotelId/rooms/:roomId      # Update room
DELETE /api/v1/hotels/:hotelId/rooms/:roomId      # Delete room
```

#### Tasks

```http
GET    /api/v1/hotels/:hotelId/tasks/:taskId                 # Get task
PATCH  /api/v1/hotels/:hotelId/tasks/:taskId                 # Update task
DELETE /api/v1/hotels/:hotelId/tasks/:taskId                 # Delete task
GET    /api/v1/hotels/:hotelId/tasks/:taskId/notes           # List notes
POST   /api/v1/hotels/:hotelId/tasks/:taskId/notes           # Create note
DELETE /api/v1/hotels/:hotelId/tasks/:taskId/notes/:noteId   # Delete note
POST   /api/v1/hotels/:hotelId/tasks/:taskId/images          # Upload image
DELETE /api/v1/hotels/:hotelId/tasks/:taskId/images/:imageId # Delete image
```

#### Roles

```http
GET    /api/v1/hotels/:hotelId/roles           # List roles
POST   /api/v1/hotels/:hotelId/roles           # Create role
PATCH  /api/v1/hotels/:hotelId/roles/:roleId   # Update role
DELETE /api/v1/hotels/:hotelId/roles/:roleId   # Delete role
```

### Query Parameters

#### Task Filtering (GET /hotels/:hotelId/tasks)

```shell
?startDate=2025-01-01T00:00:00Z  # Filter by date range
&endDate=2025-01-31T23:59:59Z
```

### Response Format

#### Success Response

```json
{
  "id": "uuid",
  "status": "PENDING",
  "priority": "HIGH",
  "dueAt": "2025-01-15T10:00:00Z",
  "room": {
    "id": "uuid",
    "number": "101",
    "floor": "1"
  },
  "cleaners": [
    {
      "id": "uuid",
      "name": "John Doe",
      "assignedAt": "2025-01-14T08:00:00Z"
    }
  ]
}
```

#### Error Response

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

---

## 🔐 Permission System

### Role Hierarchy

```shell
ADMIN    → Full system access (all hotels)
  └─ MANAGER → Hotel-specific management (CRUD on rooms, tasks, roles)
      └─ CLEANER  → Task execution (view + update assigned tasks)
          └─ PENDING  → No access (awaiting approval)
```

### Permission Matrix

| Action | Admin | Manager | Cleaner | Pending |
|--------|-------|---------|---------|---------|
| View all hotels | ✅ | ❌ | ❌ | ❌ |
| Manage hotels | ✅ | ❌ | ❌ | ❌ |
| Create rooms | ✅ | ✅* | ❌ | ❌ |
| Update rooms | ✅ | ✅* | ❌ | ❌ |
| Delete rooms | ✅ | ✅* | ❌ | ❌ |
| View rooms | ✅ | ✅* | ✅* | ❌ |
| Create tasks | ✅ | ✅* | ❌ | ❌ |
| View all tasks | ✅ | ✅* | ❌ | ❌ |
| View assigned tasks | ✅ | ✅* | ✅ | ❌ |
| Update task status | ✅ | ❌ | ✅** | ❌ |
| Update task priority | ✅ | ✅* | ❌ | ❌ |
| Cancel tasks | ✅ | ✅* | ✅** | ❌ |
| Delete tasks | ✅ | ✅* | ❌ | ❌ |
| Manage roles | ✅ | ✅* | ❌ | ❌ |
| Upload images | ✅ | ✅* | ✅** | ❌ |
| Add notes | ✅ | ✅* | ✅** | ❌ |
| Delete own notes | ✅ | ✅ | ✅ | ❌ |
| Delete any notes | ✅ | ❌ | ❌ | ❌ |

\* Only for their hotel  
\** Only for tasks assigned to them

---

## 🚀 Deployment

### Environment Setup

1. **Set production environment variables**

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@prod-host:5432/iputze"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
SESSION_SECRET="your-production-secret"  # Use strong random value
```

2.**Configure Cloudinary**

- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your cloud name, API key, and secret
- Add to environment variables

3.**Optional: Set up Redis**

- Create Upstash Redis instance
- Add connection details to environment

### Deployment Platforms

#### Vercel (Recommended)

1. **Connect repository**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

2.**Configure environment variables** in Vercel dashboard

3.**Set up PostgreSQL**

- Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- Or [Supabase](https://supabase.com/)
- Or [Railway](https://railway.app/)

4.**Run migrations**

```bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:migrate
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t iputze .
docker run -p 3000:3000 --env-file .env iputze
```

#### Traditional VPS (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Clone and setup
git clone https://github.com/Mezdek/iputze.git
cd iputze
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "iputze" -- start
pm2 save
pm2 startup
```

### Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificate installed (HTTPS)
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Error monitoring set up (Sentry)
- [ ] Database backups automated
- [ ] Health check endpoint tested
- [ ] Default admin password changed
- [ ] API documentation updated
- [ ] DNS records configured
- [ ] CDN configured (optional)

---

## 🧪 Testing

### Setup Testing (Coming Soon)

```bash
npm install --save-dev vitest @testing-library/react
```

### Run Tests

```bash
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # Generate coverage report
```

### Test Structure

``` shell
__tests__/
├── unit/
│   ├── permissions.test.ts
│   └── validation.test.ts
├── integration/
│   ├── api/
│   │   ├── auth.test.ts
│   │   └── tasks.test.ts
└── e2e/
    └── workflows.test.ts
```

---

## 🐛 Troubleshooting

### Common Issues

1.**Database Connection Failed**

```bash
# Check connection string
echo $DATABASE_URL

# For SQLite, ensure directory exists
mkdir -p prisma

# For PostgreSQL, test connection
psql $DATABASE_URL
```

2.**Prisma Client Out of Sync**

```bash
# Regenerate Prisma client
npm run db:generate

# Reset and resync
npm run db:reset
npm run db:seed
```

3.**TypeScript Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

4.**Port Already in Use**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

5.**Session Issues**

- Clear browser cookies
- Check `SESSION_SECRET` is set
- Verify `SESSION_COOKIE_EXP` format

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3.**Make your changes**

- Follow existing code style
- Add tests for new features
- Update documentation

4.**Commit with conventional commits**

```bash
git commit -m "feat: add bulk task creation"
git commit -m "fix: resolve date filtering bug"
git commit -m "docs: update API documentation"
```

5.**Push and create pull request**

```bash
git push origin feature/amazing-feature
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write descriptive variable names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Pull Request Guidelines

- Describe what the PR does
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [HeroUI](https://heroui.com/) - Beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📞 Support

- **Documentation**: [docs.iputze.com](https://docs.iputze.com) *(coming soon)*
- **Issues**: [GitHub Issues](https://github.com/Mezdek/iputze/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mezdek/iputze/discussions)

---

## 🗺️ Roadmap

### Version 1.1

- [ ] Mobile responsive improvements
- [ ] Push notifications
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Performance metrics dashboard

### Version 1.2

- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] Export reports (PDF, Excel)
- [ ] API rate limiting implementation
- [ ] Automated tests

### Version 2.0

- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Team chat integration
- [ ] Analytics and insights
- [ ] Custom workflows

---

### Built with ❤️ by the iputze team

---

#### Last updated: November 14, 2025
