
# Amrutam Healthcare Backend

A role-based telemedicine backend built with Node.js, Express.js, and PostgreSQL. The system supports patient authentication, doctor management, availability scheduling, consultation booking, and prescription management.

## 1. Project Overview

This project implements the core backend functionality of a telemedicine platform.

The system supports three user roles:

- **Patient:** Register, log in, search doctors, book consultations, view appointments, and cancel eligible consultations.
- **Doctor:** Manage availability, view assigned consultations, complete consultations, and create prescriptions.
- **Admin:** Log in and create doctor accounts with their corresponding professional profiles.

The backend follows a modular architecture with separate routes, controllers, services, middleware, and validation layers.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Neon | Managed PostgreSQL hosting |
| pg | PostgreSQL database connectivity |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| dotenv | Environment configuration |

## 3. Project Structure

```text
amrutam-healthcare-backend/
│
├── README.md
│
└── server/
    ├── scripts/
    │   └── seed-admin.js
    │
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   │
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   ├── availability.controller.js
    │   │   ├── consultation.controller.js
    │   │   ├── doctor.controller.js
    │   │   └── prescription.controller.js
    │   │
    │   ├── middleware/
    │   │   ├── auth.middleware.js
    │   │   └── validation.middleware.js
    │   │
    │   ├── models/
    │   │   └── schema.sql
    │   │
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── availability.routes.js
    │   │   ├── consultation.routes.js
    │   │   ├── doctor.routes.js
    │   │   └── prescription.routes.js
    │   │
    │   ├── services/
    │   │   ├── auth.service.js
    │   │   ├── availability.service.js
    │   │   ├── consultation.service.js
    │   │   ├── doctor.service.js
    │   │   └── prescription.service.js
    │   │
    │   ├── validations/
    │   │   ├── auth.validation.js
    │   │   ├── availability.validation.js
    │   │   ├── consultation.validation.js
    │   │   ├── doctor.validation.js
    │   │   └── prescription.validation.js
    │   │
    │   └── app.js
    │
    ├── .env
    ├── package.json
    └── server.js
```

## 4. Installation and Setup

### Prerequisites

- Node.js
- npm
- PostgreSQL database (Neon or local PostgreSQL)
- Postman for API testing

### Step 1: Clone the Repository

```bash
git clone <your-github-repository-url>
cd amrutam-healthcare-backend
```

### Step 2: Install Dependencies

```bash
cd server
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
DB_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=15m

ADMIN_NAME=Assignment Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
```

Replace the example values with your own credentials.

**Important:** Never commit `.env` or expose database credentials, JWT secrets, or admin passwords in the repository.

### Step 4: Set Up the Database

Execute the SQL statements from:

```text
server/src/models/schema.sql
```

in your PostgreSQL database.

This creates the required tables, relationships, constraints, and indexes.

### Step 5: Create the Admin Account

Run the admin seed script from the `server` directory:

```bash
node scripts/seed-admin.js
```

The script securely hashes the admin password and creates or updates the configured admin account.

### Step 6: Start the Backend

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## 5. API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a patient |
| POST | `/auth/login` | Log in a user |

### Doctors

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/doctors` | Public | Search and filter doctors |
| POST | `/doctors` | Admin | Create doctor account and profile |

Doctor search supports:
- Specialization
- Minimum experience
- Maximum consultation fee
- Pagination

### Availability

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/availability` | Doctor | Create availability slots |

### Consultations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/consultations` | Patient | Book a consultation |
| GET | `/consultations` | Patient / Doctor | View consultations |
| PATCH | `/consultations/:id/status` | Patient / Doctor | Update consultation status |

Patients can cancel eligible consultations, while doctors can complete their assigned consultations.

### Prescriptions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/prescriptions` | Doctor | Create a prescription for a completed consultation |

Protected endpoints require a JWT in the Authorization header:

```text
Authorization: Bearer <your_jwt_token>
```

## 6. Database Design

The PostgreSQL database contains the following core tables:

| Table | Purpose |
|---|---|
| users | Stores patient, doctor, and admin accounts |
| profiles | Stores patient profile information |
| doctors | Stores professional doctor information |
| availability_slots | Stores doctor availability |
| consultations | Stores consultation bookings and status |
| prescriptions | Stores prescription information |
| payments | Stores payment records |
| audit_logs | Provides a foundation for audit logging |

The database uses primary keys, foreign keys, unique constraints, check constraints, and indexes to maintain data integrity.

## 7. Security and Validation

The implemented security mechanisms include:

- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based access control.
- Protected admin and doctor endpoints.
- Zod request validation.
- Parameterized SQL queries to prevent SQL injection.
- Database transactions for consultation booking and doctor account creation.
- Passwords and secrets stored through environment variables.

## 8. Current Implementation Status

### Implemented Core Functionality

- Patient registration and login.
- Admin account seeding and login.
- JWT authentication and role authorization.
- Admin-created doctor accounts and professional profiles.
- Doctor search and filtering.
- Doctor availability management.
- Consultation booking and status management.
- Prescription creation.
- PostgreSQL integration.

### Further Improvements

The following areas remain candidates for further development:

- Comprehensive automated testing.
- OpenAPI specification.
- Audit logging implementation.
- Idempotency for critical write operations.
- Payment gateway integration.
- Advanced observability and monitoring.
- CI/CD pipeline.
- Infrastructure automation.
- Production deployment and disaster recovery.

## 9. Future Scope

The backend can be extended with additional production-oriented capabilities, including:

- Redis caching.
- Background job processing.
- Notification services.
- Advanced analytics.
- Improved concurrency management.
- Automated testing and deployment pipelines.

## 10. Project Objective

The objective is to build a modular, secure, and maintainable telemedicine backend that supports essential healthcare workflows and provides a foundation for future scalability.

---

**Project:** Amrutam Healthcare Backend  
**Backend:** Node.js and Express.js  
**Database:** PostgreSQL  
**Architecture:** Modular REST API
