# Database and Authentication

This project uses Prisma with PostgreSQL for the backend data layer and JWT-based authentication for protected API access.

## ERD

The entity relationship diagram is stored here:

- [Restaurant_Management_System_ERD.png](Restaurant_Management_System_ERD.png)

## Where the database is implemented

The database implementation lives in the backend:

- Prisma schema: [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)
- Prisma client setup: [backend/src/config/prisma.ts](../backend/src/config/prisma.ts)
- Connection config: [backend/.env](../backend/.env)

The Prisma client is initialized with the PostgreSQL driver adapter in `backend/src/config/prisma.ts`, which is required by Prisma 7.

## Data model

The schema currently defines these core models:

- `Role`: role catalog for access control
- `Employee`: employee profile data
- `User`: application login account linked 1:1 to an employee
- `Category`: inventory category lookup
- `Inventory`: inventory items linked to a category
- `Schedule`: employee shift schedule linked to an employee

### Relationships

- `Role` 1-to-many `User`
- `Employee` 1-to-0/1 `User`
- `Employee` 1-to-many `Schedule`
- `Category` 1-to-many `Inventory`
- `User` belongs to one `Role` and one `Employee`

### Enums

The schema also defines the following enums:

- `RoleName`: `ADMINISTRATOR`, `MANAGER`, `CHEF`, `COOK`, `CASHIER`
- `EmploymentStatus`: `ACTIVE`, `INACTIVE`, `TERMINATED`
- `ShiftStatus`: `SCHEDULED`, `COMPLETED`, `CANCELLED`

## Database access pattern

All database access goes through Prisma in the service layer.

- Authentication queries: [backend/src/services/authService.ts](../backend/src/services/authService.ts)
- Employee queries and employee-user creation: [backend/src/services/employeeService.ts](../backend/src/services/employeeService.ts)
- Inventory queries: [backend/src/services/inventoryService.ts](../backend/src/services/inventoryService.ts)
- Schedule queries: [backend/src/services/scheduleService.ts](../backend/src/services/scheduleService.ts)

The API routes do not query the database directly. Controllers call services, and services call Prisma.

## Authentication flow

### Login

The login endpoint is exposed at:

- `POST /api/auth/login`

Implementation:

- Route: [backend/src/routes/authRoutes.ts](../backend/src/routes/authRoutes.ts)
- Controller: [backend/src/controllers/authController.ts](../backend/src/controllers/authController.ts)
- Service: [backend/src/services/authService.ts](../backend/src/services/authService.ts)

Login flow:

1. Look up the user by `username`.
2. Include the linked `role` and `employee` records.
3. Compare the supplied password with the stored `passwordHash` using `bcrypt`.
4. Sign a JWT with `userId`, `username`, and `role`.
5. Return the token and the user payload.

The token expires after 24 hours.

### JWT payload

The JWT currently contains:

- `userId`
- `username`
- `role`

### Auth middleware

- `authenticate`: validates the `Authorization: Bearer <token>` header and attaches the decoded user to `req.user`
- `authorize`: checks the decoded role against allowed roles

Implementation:

- [backend/src/middleware/authenticate.ts](../backend/src/middleware/authenticate.ts)
- [backend/src/middleware/authorize.ts](../backend/src/middleware/authorize.ts)

## Protected routes

The following resource routes require authentication:

- `GET /api/employees`
- `GET /api/inventory`
- `GET /api/schedules`

Role-based write access is applied as follows:

- `POST`, `PUT` on employees, inventory, and schedules: `ADMINISTRATOR` or `MANAGER`
- `DELETE` on employees, inventory, and schedules: `ADMINISTRATOR` only

Implementation:

- [backend/src/routes/employeeRoutes.ts](../backend/src/routes/employeeRoutes.ts)
- [backend/src/routes/inventoryRoutes.ts](../backend/src/routes/inventoryRoutes.ts)
- [backend/src/routes/scheduleRoutes.ts](../backend/src/routes/scheduleRoutes.ts)

## Employee and user creation

When a new employee is created, the backend also creates the linked login account in the same transaction path.

Implementation:

- [backend/src/services/employeeService.ts](../backend/src/services/employeeService.ts)

Behavior:

- The service checks for duplicate usernames.
- The service checks for duplicate employee emails.
- The password is hashed with `bcrypt` before storage.
- The `User` record is created as a nested create under `Employee`.

## Environment variables

The backend expects at least:

- `DATABASE_URL` for Prisma/PostgreSQL access
- `JWT_SECRET` for token signing and verification

## Summary

The ERD reflects a Prisma-backed PostgreSQL schema centered on employees, users, roles, inventory, categories, and schedules. Authentication is implemented with `bcrypt` password verification and JWT bearer tokens, with role-based authorization enforced in middleware.