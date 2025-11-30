# 🚀 Clean Architecture Backend – TypeScript, Prisma, MySQL, Redis

A scalable and modular backend boilerplate built with **TypeScript**, **Express**, **Prisma ORM**, **MySQL**, and **Redis**.  
The project follows a clean and maintainable architecture using the **Clean Architecture** approach with a feature-based modular structure under `internal/`.

---

## ✨ Features

- **Clean Architecture** (adapter → infrastructure → module → routes)
- **Prisma ORM** with schema & migration system
- **Redis integration** (token storage & caching)
- **Modular, feature-based service layer**
- **Repository pattern** with Transaction Helper
- **JWT Authentication**
- **Environment-based configuration**
- **Auto-generated Prisma Client**
- **Production-ready folder structure**

---

## 📁 Project Structure

internal/
├── adapter/ # DB, Redis, storage adapters
├── infrastructure/ # Repository implementations, transaction helper
├── middleware/ # JWT middleware, request validation
├── module/ # Business logic per module (auth, account, etc.)
├── routes/ # API route definitions
generated/ # Auto-generated Prisma Client
prisma/ # Prisma schema & migration files

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | MySQL |
| Cache / Token Store | Redis |
| Authentication | JWT |
| Architecture | Clean Architecture + Repository Pattern |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash

git clone https://github.com/IamNobody99/setup-backend-clean-architecture-expressJs.git

cd setup-backend-clean-architecture-expressJs

```

### 2. Install Dependencies

```bash

npm install

```

### 3. Create Environment File

---

## 🗄️ Database Setup

### 4. Generate Prisma Client

```bash

npx prisma generate

```

### 5. Run Migrations

```bash

npx prisma migrate dev --name init

```


### ▶️ Running the Server

```bash

npm run dev

```

### 🧱 Architecture Overview

This project uses a hybrid combination of:

- Clean Architecture
- Separation of concerns
- Clear boundary between layers
- Easy to extend new modules
- Feature-Based Modularization
- Each module (e.g., auth/, account/) contains:
    1. service
    2. repository
    3. controller
    4. DTO/validation
    5. ports
- Repository Pattern

All database logic is abstracted inside repository classes:
- Easier to test
- Easier to swap data sources
- Clean service layer

### 🔐 Authentication

- Uses JWT access tokens
- Token verification handled in middleware/auth.ts
- Redis used for:
    1. Refresh token storage
    2. Login attempt tracking
    3. Session-based verification

### 📡 API Structure

All routes are registered inside:
    - internal/routes/

Each module exposes its own router and gets mounted in the main router.

### 🧪 Testing (Optional)

You may integrate:
    - Jest
    - Supertest

Project structure already supports easy testing per module.

### 🧱 Architecture Diagram
                           ┌──────────────────────────┐
                           │        Presentation       │
                           │         (Routes)          │
                           └──────────────┬────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────┐
                           │        Modules            │
                           │ (Controller + Service)    │
                           └──────────────┬────────────┘
                                          │
                                Business Logic Layer
                                          │
                                          ▼
                           ┌──────────────────────────┐
                           │      Infrastructure       │
                           │  (Repositories + Utils)   │
                           └──────────────┬────────────┘
                                          │
                               Abstraction Layer (Ports)
                                          │
                                          ▼
                           ┌──────────────────────────┐
                           │         Adapter           │
                           │ (DB, Redis, External API) │
                           └──────────────┬────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────┐
                           │     External Services     │
                           │  MySQL • Redis • Storage  │
                           └──────────────────────────┘
