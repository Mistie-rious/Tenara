# Tenara

## Project Description
**Tenara** is a full-stack multi-tenancy application built with **NestJS** for the backend and **React (Vite + TypeScript)** for the frontend.
It allows organizations to register, manage users, create and manage projects, and track activity across multiple tenants.
The architecture follows modular principles, separating frontend pages, shared/UI components, state management, and backend features.

---

## Tech Stack

### Frontend
- React 18 + Vite  
- TypeScript  
- React Router  
- TanStack Query + Zustand for state management and API interactions  
- ShadCN UI components  

### Backend
- NestJS  
- TypeScript  
- Prisma ORM (PostgreSQL)  
- JWT Authentication  

---

## Folder Structure

### Frontend (`src/`)
```
src/
├── pages/        # Feature pages (auth, dashboard, projects, users)
├── components/   # Shared & UI components
├── hooks/        # Custom hooks for queries and mutations
├── store/        # Zustand stores
├── lib/          # Utilities, API client, types
```

### Backend (`src/`)
```
src/
├── auth/         # Auth controllers, services, DTOs, strategies
├── users/        # User controllers, services, DTOs, entities
├── projects/     # Project controllers, services, DTOs, types
├── common/       # Decorators, guards, filters, interceptors
├── prisma/       # Prisma module and service
├── config/       # Configuration service and modules
```

---

## Setup Instructions

### Frontend
```bash
# Clone the repository
git clone <repository-url>
cd <repository-folder>/frontend
```
```bash
# Install dependencies
pnpm install
```
```bash
# Run development server
pnpm dev
```

### Backend
```bash
# Clone the repository
git clone <repository-url>
cd <repository-folder>/backend
```
```bash
# Install dependencies
pnpm install
```
```bash
# Run migrations
npx prisma migrate dev
```
```bash
# Start backend server
pnpm start:dev
```

### Environment Variables
Create a `.env` file in the backend root with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=port_number
```

---

## Notes
- Frontend and backend communicate via REST APIs.  
- JWT token is required for protected routes.  
- TanStack Query + Zustand handle state management and API interactions.  
- Prisma manages database interactions and migrations.  
- The application supports multiple organizations (tenants) with isolated data and user management.

