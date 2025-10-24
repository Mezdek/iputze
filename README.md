# 🏨 iputze - Hotel Cleaning Management System

Modern hotel cleaning coordination platform connecting managers and cleaning staff.

## 🎯 Key Features

- **Multi-hotel management** - Single platform for multiple properties
- **Role-based access** - Admin, Manager, Cleaner, Pending
- **Real-time assignments** - Task creation, tracking, and completion
- **Timeline view** - Weekly scheduling and workload visualization
- **Task documentation** - Notes and image uploads for quality assurance
- **Performance tracking** - XP system and achievement badges

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or SQLite for development)

### Installation

```bash
# Clone and install
git clone [repo-url]
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations and seed
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Default Login Credentials

See [Database Seeding Guide](#database-seeding) below for credentials.

## 🏗️ Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **UI**: HeroUI, TailwindCSS, Framer Motion
- **State**: TanStack Query
- **Auth**: Custom JWT sessions
- **i18n**: next-intl

## 📁 Project Structure

```
├── app/              # Next.js app router
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Business logic & utilities
├── prisma/           # Database schema & migrations
└── types/            # TypeScript definitions
```

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/iputze"
SESSION_COOKIE_EXP="7d"
NODE_ENV="development"
```

## 📚 API Documentation

API follows RESTful conventions:

- `GET /api/hotels` - List hotels
- `POST /api/hotels/:id/rooms` - Create room
- `GET /api/hotels/:id/assignments` - List assignments
- `PATCH /api/hotels/:id/assignments/:id` - Update assignment

## 🧪 Testing

```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🚢 Deployment

```bash
npm run build
npm run start
```

Deploy to Vercel with one click: [Deploy Button]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[Your License]

---

## Database Seeding

[Your existing seeding documentation here]
