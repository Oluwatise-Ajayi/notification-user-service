# Notification User Service API

## Overview
This is a user management and authentication API built with NestJS and TypeScript. It utilizes TypeORM for database interaction with a PostgreSQL database and JWT for securing endpoints.

## Features
- **NestJS**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **TypeORM**: An ORM that can run in NodeJS and can be used with TypeScript.
- **PostgreSQL**: A powerful, open source object-relational database system.
- **JWT Authentication**: Implements JSON Web Tokens for secure, stateless authentication.
- **Docker**: Provides a containerized environment for consistent development and deployment.
- **Class-Validator**: Enables decorator-based validation for request data transfer objects (DTOs).
- **Terminus**: Integrated health checks for monitoring service status, database connectivity, and resource usage.

## Getting Started
### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Oluwatise-Ajayi/notification-user-service.git
cd notification-user-service
```

**2. Set up Environment Variables**
Create a `.env` file in the root directory and populate it using the `.env.example` file as a template.
```bash
cp .env.example .env
```

**3. Install Dependencies**
```bash
npm install
```

**4. Run with Docker (Recommended)**
This will start the NestJS application and a PostgreSQL database instance.
```bash
docker-compose up --build
```
The service will be available at `http://localhost:3001`.

**5. Run Locally (Alternative)**
If you have a local PostgreSQL instance running, you can start the application directly.
```bash
npm run start:dev
```

### Environment Variables
All required environment variables must be defined in a `.env` file.

| Variable        | Description                                  | Example                                                      |
| --------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `DB_HOST`       | Database host name.                          | `localhost`                                                  |
| `DB_PORT`       | Port number for the database connection.     | `5432`                                                       |
| `DB_USERNAME`   | Username for the database user.              | `postgres`                                                   |
| `DB_PASSWORD`   | Password for the database user.              | `postgres`                                                   |
| `DB_DATABASE`   | The name of the database.                    | `user_service`                                               |
| `JWT_SECRET`    | Secret key for signing JWTs (min 32 chars).  | `your-super-secret-jwt-key-change-in-production-min-32-chars`|
| `NODE_ENV`      | Application environment.                     | `development`                                                |
| `PORT`          | The port the application will listen on.     | `3001`                                                       |

## API Documentation
### Base URL
`http://localhost:3001`

### Endpoints
---
#### **Auth Module**

#### `POST /auth/register`
Registers a new user and returns a JWT access token.

**Request**:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890",
  "push_token": "fcm_token_string_here"
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "user": {
            "email": "test@example.com",
            "phone": "1234567890",
            "push_token": "fcm_token_string_here",
            "push_enabled": true,
            "email_enabled": true,
            "sms_enabled": false,
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User registered successfully"
}
```

**Errors**:
- `400 Bad Request`: Invalid payload (e.g., invalid email, password too short).
- `409 Conflict`: A user with the provided email already exists.

#### `POST /auth/login`
Authenticates a user and returns a JWT access token.

**Request**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "test@example.com",
            "phone": "1234567890",
            "push_token": "fcm_token_string_here"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Login successful"
}
```

**Errors**:
- `400 Bad Request`: Invalid payload.
- `401 Unauthorized`: Invalid credentials (email or password incorrect).

---
#### **Users Module**

#### `POST /users`
Creates a new user. Primarily for administrative purposes; standard registration should use `/auth/register`.

**Request**:
```json
{
  "email": "new.user@example.com",
  "phone": "0987654321",
  "push_token": "another_fcm_token",
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": true
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "email": "new.user@example.com",
        "phone": "0987654321",
        "push_token": "another_fcm_token",
        "push_enabled": true,
        "email_enabled": true,
        "sms_enabled": true,
        "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
        "created_at": "2023-10-27T10:05:00.000Z",
        "updated_at": "2023-10-27T10:05:00.000Z"
    },
    "message": "User created successfully"
}
```

**Errors**:
- `400 Bad Request`: Invalid request body.

#### `GET /users`
Retrieves a paginated list of all users.

**Request**:
*Query Parameters*:
- `page` (optional, number): The page number to retrieve. Default: `1`.
- `limit` (optional, number): The number of items per page. Default: `10`, Max: `100`.

*Example URL*: `/users?page=1&limit=20`

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "test@example.com",
            "phone": "1234567890",
            "push_token": "fcm_token_string_here",
            "push_enabled": true,
            "email_enabled": true,
            "sms_enabled": false,
            "created_at": "2023-10-27T10:00:00.000Z",
            "updated_at": "2023-10-27T10:00:00.000Z"
        }
    ],
    "message": "Users retrieved successfully",
    "meta": {
        "total": 1,
        "limit": 10,
        "page": 1,
        "total_pages": 1,
        "has_next": false,
        "has_previous": false
    }
}
```

**Errors**:
- `400 Bad Request`: Invalid query parameters.

#### `GET /users/:id`
Retrieves a single user by their ID.

**Request**:
*Path Parameter*:
- `id` (string, UUID): The unique identifier of the user.

**Response**:
```json
{
    "success": true,
    "data": {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "email": "test@example.com",
        "phone": "1234567890",
        "push_token": "fcm_token_string_here",
        "push_enabled": true,
        "email_enabled": true,
        "sms_enabled": false,
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:00:00.000Z"
    },
    "message": "User retrieved successfully"
}
```

**Errors**:
- `404 Not Found`: User with the specified ID does not exist.

#### `PUT /users/:id`
Updates a user's details by their ID.

**Request**:
*Path Parameter*:
- `id` (string, UUID): The unique identifier of the user.
*Body*:
```json
{
  "phone": "1112223333",
  "push_enabled": false
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "email": "test@example.com",
        "phone": "1112223333",
        "push_token": "fcm_token_string_here",
        "push_enabled": false,
        "email_enabled": true,
        "sms_enabled": false,
        "created_at": "2023-10-27T10:00:00.000Z",
        "updated_at": "2023-10-27T10:15:00.000Z"
    },
    "message": "User updated successfully"
}
```

**Errors**:
- `400 Bad Request`: Invalid request body.
- `404 Not Found`: User with the specified ID does not exist.

#### `DELETE /users/:id`
Deletes a user by their ID.

**Request**:
*Path Parameter*:
- `id` (string, UUID): The unique identifier of the user.

**Response**:
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

**Errors**:
- `404 Not Found`: User with the specified ID does not exist.

---
#### **Health Module**

#### `GET /health`
Performs a comprehensive health check of the service, including database connectivity, memory usage, and disk space.

**Response**:
```json
{
    "status": "ok",
    "info": {
        "database": {
            "status": "up"
        },
        "memory_heap": {
            "status": "up"
        },
        "memory_rss": {
            "status": "up"
        },
        "storage": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
      ...
    }
}
```

**Errors**:
- `503 Service Unavailable`: One or more health checks failed.

#### `GET /health/live`
A simple liveness probe to confirm the service is running.

**Response**:
```json
{
    "status": "ok",
    "info": {
        "liveness": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
        "liveness": {
            "status": "up"
        }
    }
}
```

**Errors**:
- `503 Service Unavailable`: The service is not responding.

#### `GET /health/ready`
A readiness probe to confirm the service is ready to accept traffic (e.g., the database is connected).

**Response**:
```json
{
    "status": "ok",
    "info": {
        "database": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
        "database": {
            "status": "up"
        }
    }
}
```

**Errors**:
- `503 Service Unavailable`: A critical dependency (like the database) is not available.