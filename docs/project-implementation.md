# Project Implementation Guide

This document summarizes the current implementation of the restaurant management system, including the backend, frontend, database, authentication, and the design choices made to keep the project secure and maintainable.

## Overview

The system is split into two parts:

- Backend: [backend/](../backend)
- Frontend: [frontend/](../frontend)

The database ERD is included here:

- [Restaurant_Management_System_ERD.png](Restaurant_Management_System_ERD.png)

The database and auth reference is documented here:

- [database-and-auth.md](database-and-auth.md)

## What the system now supports

### Employee experience

- Secure login with JWT
- Employee dashboard with profile, schedule summary, coworker visibility, and leave requests
- Schedule page with date-range review and shift context
- Leave request submission and status tracking

### Operations experience

- Inventory view for kitchen staff
- Low-stock visibility for cooks and chefs
- Employee directory for managers and administrators
- Leave approval queue for managers and administrators

### Admin experience

- Full employee CRUD
- Full inventory CRUD
- Full schedule CRUD
- Leave review and approval
- Summary metrics for staffing and stock

## Backend architecture

The backend uses Express, Prisma, PostgreSQL, bcrypt, and JWT.

### Core files

- Application bootstrap: [backend/src/app.ts](../backend/src/app.ts)
- Server entrypoint: [backend/src/server.ts](../backend/src/server.ts)
- Prisma client: [backend/src/config/prisma.ts](../backend/src/config/prisma.ts)
- Auth service: [backend/src/services/authService.ts](../backend/src/services/authService.ts)
- Dashboard service: [backend/src/services/dashboardService.ts](../backend/src/services/dashboardService.ts)
- Leave service: [backend/src/services/leaveService.ts](../backend/src/services/leaveService.ts)
- Schedule service: [backend/src/services/scheduleService.ts](../backend/src/services/scheduleService.ts)
- Inventory service: [backend/src/services/inventoryService.ts](../backend/src/services/inventoryService.ts)
- Employee service: [backend/src/services/employeeService.ts](../backend/src/services/employeeService.ts)

### Security model

- Passwords are hashed with bcrypt before storage.
- JWT bearer tokens are used for all protected endpoints.
- `authenticate` validates the token and attaches the decoded payload to `req.user`.
- `authorize` enforces role-based access on admin and manager routes.
- Sensitive fields like `passwordHash` are never returned to the frontend.

### Why this is scalable

- Database access is isolated inside service files.
- Controllers stay thin and only handle request/response concerns.
- Auth and role checks are centralized in middleware.
- The dashboard aggregates server-side data so the frontend does not need to orchestrate complex joins.
- Self-service endpoints are separate from admin endpoints, reducing accidental overexposure.

## Backend endpoints

### Auth

- `POST /api/auth/login`

### Dashboard

- `GET /api/dashboard`

### Employees

- `GET /api/employees/me`
- `GET /api/employees` for admin and manager
- `GET /api/employees/search` for admin and manager
- `GET /api/employees/:id` for admin and manager
- `POST /api/employees` for admin and manager
- `PUT /api/employees/:id` for admin and manager
- `DELETE /api/employees/:id` for administrator only

### Schedules

- `GET /api/schedules/me`
- `GET /api/schedules/me/current`
- `GET /api/schedules/me/previous`
- `GET /api/schedules/me/next`
- `GET /api/schedules/me/coworkers`
- `GET /api/schedules/me/range`
- `GET /api/schedules` for admin and manager
- `GET /api/schedules/:id` for admin and manager
- `POST /api/schedules` for admin and manager
- `PUT /api/schedules/:id` for admin and manager
- `DELETE /api/schedules/:id` for administrator only

### Inventory

- `GET /api/inventory`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/category/:categoryId`
- `GET /api/inventory/count/:categoryId`
- `GET /api/inventory/:id`
- `POST /api/inventory` for admin and manager
- `PUT /api/inventory/:id` for admin and manager
- `DELETE /api/inventory/:id` for administrator only

### Leave requests

- `GET /api/leaves/me`
- `GET /api/leaves` for admin and manager
- `POST /api/leaves`
- `PUT /api/leaves/:id` for admin and manager

## Frontend architecture

The frontend is a React + Vite application using React Router and Axios.

### Core files

- App shell: [frontend/src/App.tsx](../frontend/src/App.tsx)
- Router setup: [frontend/src/routes/AppRoutes.tsx](../frontend/src/routes/AppRoutes.tsx)
- Auth context: [frontend/src/context/AuthContext.tsx](../frontend/src/context/AuthContext.tsx)
- API client: [frontend/src/lib/api.ts](../frontend/src/lib/api.ts)
- Shared layout: [frontend/src/components/Layout.tsx](../frontend/src/components/Layout.tsx)

### Pages

- Login: [frontend/src/pages/Login.tsx](../frontend/src/pages/Login.tsx)
- Employee dashboard: [frontend/src/pages/EmployeeDashboard.tsx](../frontend/src/pages/EmployeeDashboard.tsx)
- Schedule: [frontend/src/pages/Schedule.tsx](../frontend/src/pages/Schedule.tsx)
- Inventory: [frontend/src/pages/Inventory.tsx](../frontend/src/pages/Inventory.tsx)
- Leave requests: [frontend/src/pages/LeaveRequest.tsx](../frontend/src/pages/LeaveRequest.tsx)
- Employees: [frontend/src/pages/Employees.tsx](../frontend/src/pages/Employees.tsx)
- Admin dashboard: [frontend/src/pages/AdminDashboard.tsx](../frontend/src/pages/AdminDashboard.tsx)
- Categories: [frontend/src/pages/Categories.tsx](../frontend/src/pages/Categories.tsx)
- Not found: [frontend/src/pages/NotFound.tsx](../frontend/src/pages/NotFound.tsx)

### UI principles followed

- Single-purpose pages instead of overloaded screens
- Clear visual hierarchy using cards, tables, and status pills
- Stable navigation with a persistent sidebar and topbar
- Minimal interaction cost for common actions like login, review, and approval
- Responsive layout that collapses cleanly on smaller screens

## Data flow

1. The user signs in through `POST /api/auth/login`.
2. The backend returns a JWT and a sanitized user DTO.
3. The frontend stores the token and user in local storage.
4. Axios attaches the bearer token to every request.
5. Protected routes redirect unauthenticated users to login.
6. Each page fetches only the data it needs from the backend.

## Notes for future changes

- Keep all Prisma queries inside service files.
- Add new role checks in middleware, not inside page code.
- Prefer adding new endpoints over expanding existing response payloads too much.
- If you add new entities, update the ERD, Prisma schema, and this document together.
- For larger data sets, add pagination and server-side filtering before expanding the UI.

## Current build status

- Backend build passes.
- Frontend build passes.
- Prisma client generation passes.
