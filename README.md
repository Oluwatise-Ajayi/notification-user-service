# Notification User Service API

## Overview
This is a robust user management and authentication API built with NestJS, a progressive Node.js framework. It leverages TypeORM for seamless interaction with a PostgreSQL database and uses JWT for secure, stateless authentication.

## Features
- **NestJS**: A framework for building efficient, reliable and scalable server-side applications.
- **TypeORM**: An ORM that can run in NodeJS and can be used with TypeScript.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Docker**: Containerized environment for consistent development and deployment.
- **Class Validator**: Automatic request payload validation using decorators.
- **Health Checks**: Integrated health endpoints to monitor service status, database connectivity, and resource usage.

## Getting Started
Follow these instructions to get the project up and running on your local machine.

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/Oluwatise-Ajayi/notification-user-service.git
    cd notification-user-service
    ```

2.  **Create Environment File**
    Copy the example environment file and update the variables as needed.
    ```bash
    cp .env.example .env
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Run with Docker (Recommended)**
    This command will build the service and start the PostgreSQL database container.
    ```bash
    docker-compose up -d --build
    ```
    The service will be available at `http://localhost:3001`.

5.  **Run Locally (Alternative)**
    If you have a local PostgreSQL instance running, you can start the application directly.
    ```bash
    npm run start:dev
    ```

### Environment Variables
The following environment variables are required to run the application. These should be placed in a `.env` file in the project root.

| Variable        | Description                                       | Example                                                              |
| --------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| `DB_HOST`       | Database host name.                               | `localhost`                                                          |
| `DB_PORT`       | Port number for the database.                     | `5432`                                                               |
| `DB_USERNAME`   | Username for database access.                     | `postgres`                                                           |
| `DB_PASSWORD`   | Password for the database user.                   | `postgres`                                                           |
| `DB_DATABASE`   | The name of the database.                         | `user_service`                                                       |
| `JWT_SECRET`    | Secret key for signing JWTs (at least 32 chars).  | `your-super-secret-jwt-key-change-in-production-min-32-chars`        |
| `NODE_ENV`      | The application environment.                      | `development`                                                        |
| `PORT`          | The port the application will run on.             | `3001`                                                               |

## API Documentation
### Base URL
`http://localhost:3001`

### Endpoints
#### **Authentication**
---
#### POST `/auth/register`
Registers a new user and returns a JWT token.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "strongPassword123",
  "push_token": "fcm_token_string_optional",
  "preferences": {
    "email": true,
    "push": false
  }
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "user": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "push_token": "fcm_token_string_optional",
            "preferences": {
                "email": true,
                "push": false
            },
            "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            "created_at": "2024-01-01T12:00:00.000Z",
            "updated_at": "2024-01-01T12:00:00.000Z"
        },
        "access_token": "eyJhbGciOiJI..."
    },
    "message": "User registered successfully"
}
```

**Errors**:
- `400 Bad Request`: Validation failed (e.g., invalid email, short password).
- `409 Conflict`: A user with the provided email already exists.

#### POST `/auth/login`
Authenticates a user and returns a JWT token.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "strongPassword123"
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": null,
            "push_token": "fcm_token_string_optional"
        },
        "access_token": "eyJhbGciOiJI..."
    },
    "message": "Login successful"
}
```

**Errors**:
- `400 Bad Request`: Validation failed.
- `401 Unauthorized`: Invalid credentials (email or password).

#### **User Management**
---
#### POST `/users`
Creates a new user. *Note: For user self-registration, prefer the `/auth/register` endpoint.*

**Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "push_token": "another_fcm_token",
  "preferences": {
    "email": false,
    "push": true
  }
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "push_token": "another_fcm_token",
        "preferences": {
            "email": false,
            "push": true
        },
        "id": "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
        "created_at": "2024-01-02T12:00:00.000Z",
        "updated_at": "2024-01-02T12:00:00.000Z"
    },
    "message": "User created successfully"
}
```

**Errors**:
- `400 Bad Request`: Validation failed.
- `500 Internal Server Error`: If a database constraint is violated (e.g., duplicate email).

#### GET `/users`
Retrieves a paginated list of all users. Supports `page` and `limit` query parameters.

**Request**:
`GET /users?page=1&limit=5`

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            "email": "john.doe@example.com",
            "name": "John Doe",
            "push_token": "fcm_token_string_optional",
            "preferences": { "email": true, "push": false },
            "created_at": "2024-01-01T12:00:00.000Z",
            "updated_at": "2024-01-01T12:00:00.000Z"
        }
    ],
    "message": "Users retrieved successfully",
    "meta": {
        "total": 1,
        "limit": 5,
        "page": 1,
        "total_pages": 1,
        "has_next": false,
        "has_previous": false
    }
}
```

**Errors**:
- `400 Bad Request`: If pagination parameters are not valid numbers.

#### GET `/users/:id`
Retrieves a single user by their ID.

**Request**:
`GET /users/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`

**Response**:
```json
{
    "success": true,
    "data": {
        "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "push_token": "fcm_token_string_optional",
        "preferences": { "email": true, "push": false },
        "created_at": "2024-01-01T12:00:00.000Z",
        "updated_at": "2024-01-01T12:00:00.000Z"
    },
    "message": "User retrieved successfully"
}
```

**Errors**:
- `404 Not Found`: If no user exists with the provided ID.

#### PUT `/users/:id`
Updates a user's details.

**Request**:
`PUT /users/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`
```json
{
  "name": "Johnathan Doe",
  "preferences": {
    "email": true,
    "push": true
  }
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "email": "john.doe@example.com",
        "name": "Johnathan Doe",
        "push_token": "fcm_token_string_optional",
        "preferences": { "email": true, "push": true },
        "created_at": "2024-01-01T12:00:00.000Z",
        "updated_at": "2024-01-02T13:00:00.000Z"
    },
    "message": "User updated successfully"
}
```

**Errors**:
- `400 Bad Request`: Validation failed.
- `404 Not Found`: If no user exists with the provided ID.

#### DELETE `/users/:id`
Deletes a user by their ID.

**Request**:
`DELETE /users/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`

**Response**:
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

**Errors**:
- `404 Not Found`: If no user exists with the provided ID.

#### **Health Checks**
---
#### GET `/health`
Performs a comprehensive health check, including database connectivity, memory, and disk space.

**Response**:
```json
{
    "status": "ok",
    "info": {
        "database": { "status": "up" },
        "memory_heap": { "status": "up" },
        "memory_rss": { "status": "up" },
        "storage": { "status": "up" }
    },
    "error": {},
    "details": {
      /* ... detailed check results ... */
    }
}
```

**Errors**:
- `503 Service Unavailable`: If any of the health checks fail.

#### GET `/health/live`
A simple liveness probe to confirm the service is running.

**Response**:
```json
{
    "status": "ok",
    "info": { "liveness": { "status": "up" } },
    "error": {},
    "details": { "liveness": { "status": "up" } }
}
```

#### GET `/health/ready`
A readiness probe to confirm the service is ready to accept traffic (e.g., database is connected).

**Response**:
```json
{
    "status": "ok",
    "info": { "database": { "status": "up" } },
    "error": {},
    "details": { "database": { "status": "up" } }
}
```

**Errors**:
- `503 Service Unavailable`: If the database is not reachable.

---
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)