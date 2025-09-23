# Commit PT Backend

Backend for Commit PT Platform built with NestJS and Prisma.

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- PostgreSQL database

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/commitpt_db"
PORT=3000
```

Replace the database connection string with your PostgreSQL credentials.

### 3. Database Setup

#### Generate Prisma Client

```bash
pnpm prisma:generate
```

#### Run Database Migrations

```bash
pnpm prisma:migrate
```

This will create the database tables based on the Prisma schema.

### 4. Run the Application

#### Development Mode

```bash
pnpm start:dev
```

#### Production Mode

```bash
pnpm build
pnpm start:prod
```

The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `pnpm start:dev` - Start in development mode with hot reload
- `pnpm start:debug` - Start in debug mode
- `pnpm build` - Build the application
- `pnpm start:prod` - Start in production mode
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:push` - Push schema changes to database
- `pnpm prisma:validate` - Validate Prisma schema

## Database Schema

The application uses the following main entities:

- **users** - User accounts with authentication
- **roles** - User roles and permissions
- **user_roles** - Many-to-many relationship between users and roles
- **access_tokens** - JWT access tokens for authentication
- **refresh_tokens** - Refresh tokens for token renewal

## API Endpoints

The API provides authentication endpoints for user registration and login. Check the controller files for detailed endpoint documentation.
