# Notification User Service API

## Overview
This is a robust microservice built with TypeScript, NestJS, and TypeORM, designed to manage user data and notification preferences. It integrates with PostgreSQL and uses JWT for secure authentication, providing a scalable and maintainable backend solution for user-centric operations.

## Features
-   **NestJS Framework**: Provides a modular, scalable, and maintainable application structure.
-   **TypeORM**: Object-Relational Mapper (ORM) for seamless interaction with the PostgreSQL database.
-   **PostgreSQL**: Reliable and powerful relational database for persistent storage of user data.
-   **JWT Authentication**: Secure user registration, login, and token-based access control.
-   **User Management**: CRUD operations for user profiles and data.
-   **Notification Preferences**: Allows users to manage their email and push notification settings.
-   **Health Checks**: Comprehensive liveness and readiness probes for monitoring service status and dependencies (database, memory, disk).
-   **Centralized Logging**: Implements correlation IDs and a dedicated logging service for improved observability and debugging.
-   **API Documentation (Swagger)**: Automatically generated and interactive API documentation for easy endpoint exploration.

## Getting Started
To get this service up and running on your local machine, follow these steps.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Oluwatise-Ajayi/notification-user-service.git
    cd notification-user-service
    ```

2.  **Setup Environment Variables**:
    Create a `.env` file in the root directory based on `.env.example`.

    ```bash
    cp .env.example .env
    ```

    Ensure the `JWT_SECRET` is strong and unique for production environments.

3.  **Run with Docker Compose**:
    The easiest way to get the database and application running is using Docker Compose.

    ```bash
    docker-compose up --build
    ```
    This command will build the Docker images and start the `user-db` (PostgreSQL) and `user-service` containers.

4.  **Local Development (without Docker Compose for service)**:
    If you prefer to run the service locally while using the Dockerized PostgreSQL database:

    *   Ensure `user-db` is running via `docker-compose up user-db`.
    *   Install Node.js dependencies:
        ```bash
        npm install
        ```
    *   Start the application in development mode:
        ```bash
        npm run start:dev
        ```

### Environment Variables
The following environment variables are required to configure the service:

| Variable        | Example Value                              | Description                                    |
| :-------------- | :----------------------------------------- | :--------------------------------------------- |
| `DB_HOST`       | `localhost` (or `user-db` for Docker)    | Database host                                  |
| `DB_PORT`       | `5432`                                     | Database port                                  |
| `DB_USERNAME`   | `postgres`                                 | Database user                                  |
| `DB_PASSWORD`   | `postgres`                                 | Database password                              |
| `DB_DATABASE`   | `user_service`                             | Database name                                  |
| `JWT_SECRET`    | `your-super-secret-jwt-key-change-in-production-min-32-chars` | Secret key for JWT signing and verification    |
| `NODE_ENV`      | `development` (or `production`)          | Application environment                        |
| `PORT`          | `3001`                                     | Port on which the NestJS application will run  |

## API Documentation
The API documentation is automatically generated using Swagger and is accessible once the service is running.

### Base URL
The API root path is configured to run on port `3001`.
`http://localhost:3001`

### Endpoints

#### `POST /auth/register`
**Description**: Registers a new user with their details and initial notification preferences.
**Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123",
  "push_token": "optional-device-push-token",
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
    "user": {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "email": "jane.doe@example.com",
      "name": "Jane Doe",
      "push_token": "optional-device-push-token",
      "preferences": {
        "email": true,
        "push": true
      },
      "created_at": "2024-07-20T10:00:00.000Z",
      "updated_at": "2024-07-20T10:00:00.000Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Errors**:
-   `400 Bad Request`: Validation errors (e.g., invalid email, weak password).
-   `409 Conflict`: User with this email already exists.

#### `POST /auth/login`
**Description**: Authenticates an existing user and returns an access token.
**Request**:
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "email": "jane.doe@example.com",
      "name": "Jane Doe",
      "push_token": "optional-device-push-token",
      "preferences": {
        "email": true,
        "push": true
      }
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Errors**:
-   `401 Unauthorized`: Invalid credentials (incorrect email or password).

#### `POST /users`
**Description**: Creates a new user (intended for internal or admin use, as registration is via `/auth/register`).
**Request**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "push_token": "new-device-token",
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
    "id": "b1c2d3e4-f5a6-7890-1234-567890abcde",
    "email": "john.smith@example.com",
    "name": "John Smith",
    "push_token": "new-device-token",
    "preferences": {
      "email": false,
      "push": true
    },
    "created_at": "2024-07-20T10:05:00.000Z",
    "updated_at": "2024-07-20T10:05:00.000Z"
  },
  "error": null,
  "message": "User created successfully",
  "meta": null
}
```

**Errors**:
-   `400 Bad Request`: Validation errors (e.g., invalid email, missing required fields).

#### `GET /users`
**Description**: Retrieves a paginated list of all users.
**Request**:
`GET /users?page=1&limit=5`
(No request body)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "email": "jane.doe@example.com",
      "name": "Jane Doe",
      "push_token": "optional-device-push-token",
      "preferences": { "email": true, "push": true },
      "created_at": "2024-07-20T10:00:00.000Z",
      "updated_at": "2024-07-20T10:00:00.000Z"
    },
    {
      "id": "b1c2d3e4-f5a6-7890-1234-567890abcde",
      "email": "john.smith@example.com",
      "name": "John Smith",
      "push_token": "new-device-token",
      "preferences": { "email": false, "push": true },
      "created_at": "2024-07-20T10:05:00.000Z",
      "updated_at": "2024-07-20T10:05:00.000Z"
    }
  ],
  "message": "Users retrieved successfully",
  "meta": {
    "total": 2,
    "limit": 5,
    "page": 1,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

**Errors**:
-   `400 Bad Request`: Invalid pagination parameters.

#### `GET /users/:id`
**Description**: Retrieves a single user by their ID.
**Request**:
`GET /users/a1b2c3d4-e5f6-7890-1234-567890abcdef`
(No request body)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "email": "jane.doe@example.com",
    "name": "Jane Doe",
    "push_token": "optional-device-push-token",
    "preferences": {
      "email": true,
      "push": true
    },
    "created_at": "2024-07-20T10:00:00.000Z",
    "updated_at": "2024-07-20T10:00:00.000Z"
  },
  "message": "User retrieved successfully"
}
```

**Errors**:
-   `404 Not Found`: User with the specified ID does not exist.

#### `PUT /users/:id`
**Description**: Updates an existing user's details by ID.
**Request**:
`PUT /users/a1b2c3d4-e5f6-7890-1234-567890abcdef`
```json
{
  "name": "Jane Elizabeth Doe",
  "push_token": "updated-device-token"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "email": "jane.doe@example.com",
    "name": "Jane Elizabeth Doe",
    "push_token": "updated-device-token",
    "preferences": {
      "email": true,
      "push": true
    },
    "created_at": "2024-07-20T10:00:00.000Z",
    "updated_at": "2024-07-20T10:15:00.000Z"
  },
  "message": "User updated successfully"
}
```

**Errors**:
-   `400 Bad Request`: Validation errors.
-   `404 Not Found`: User with the specified ID does not exist.

#### `DELETE /users/:id`
**Description**: Deletes a user by their ID.
**Request**:
`DELETE /users/a1b2c3d4-e5f6-7890-1234-567890abcdef`
(No request body)

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors**:
-   `404 Not Found`: User with the specified ID does not exist.

#### `PATCH /users/:id/preferences`
**Description**: Updates a user's notification preferences by ID.
**Request**:
`PATCH /users/a1b2c3d4-e5f6-7890-1234-567890abcdef/preferences`
```json
{
  "email": false,
  "push": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "email": "jane.doe@example.com",
    "name": "Jane Doe",
    "push_token": "optional-device-push-token",
    "preferences": {
      "email": false,
      "push": true
    },
    "created_at": "2024-07-20T10:00:00.000Z",
    "updated_at": "2024-07-20T10:20:00.000Z"
  },
  "message": "User preferences updated successfully"
}
```

**Errors**:
-   `400 Bad Request`: Validation errors (e.g., non-boolean values for preferences).
-   `404 Not Found`: User with the specified ID does not exist.

#### `GET /health`
**Description**: Performs comprehensive health checks including database, memory, and disk usage.
**Request**:
`GET /health`
(No request body)

**Response**:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up", "used": 50000000, "threshold": 157286400 },
    "memory_rss": { "status": "up", "used": 100000000, "threshold": 314572800 },
    "storage": { "status": "up", "total": 100, "free": 80, "thresholdPercent": 0.9 }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up", "used": 50000000, "threshold": 157286400 },
    "memory_rss": { "status": "up", "used": 100000000, "threshold": 314572800 },
    "storage": { "status": "up", "total": 100, "free": 80, "thresholdPercent": 0.9 }
  }
}
```

**Errors**:
-   `503 Service Unavailable`: If any health indicator fails.

#### `GET /health/live`
**Description**: Simple liveness check to indicate if the service process is running.
**Request**:
`GET /health/live`
(No request body)

**Response**:
```json
{
  "status": "ok",
  "info": {
    "liveness": { "status": "up" }
  },
  "error": {},
  "details": {
    "liveness": { "status": "up" }
  }
}
```

#### `GET /health/ready`
**Description**: Readiness check to determine if the service is ready to accept traffic, including database connectivity.
**Request**:
`GET /health/ready`
(No request body)

**Response**:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" }
  }
}
```

**Errors**:
-   `503 Service Unavailable`: If the database connection fails.

## Usage
Once the service is running, you can interact with it via its API endpoints.

**Accessing Swagger UI**:
Open your web browser and navigate to `http://localhost:3001/docs`. Here you will find an interactive interface to explore all available API endpoints, test requests, and view response schemas.

**Example API Interaction**:

1.  **Register a new user**:
    Send a `POST` request to `http://localhost:3001/auth/register` with the required `RegisterDto` body.

2.  **Log in to get a token**:
    Send a `POST` request to `http://localhost:3001/auth/login` with the `LoginDto` body. Store the `access_token` from the response.

3.  **Access protected endpoints**:
    For endpoints that require authentication (if implemented, though currently none are explicitly guarded in `users.controller`), include the `access_token` in the `Authorization` header as a Bearer token:
    `Authorization: Bearer <your_access_token>`

## Technologies Used

| Technology    | Version   | Description                                           |
| :------------ | :-------- | :---------------------------------------------------- |
| TypeScript    | `^5.7.3`  | Superset of JavaScript for robust, scalable applications |
| Node.js       | `18-alpine` | Server-side JavaScript runtime environment            |
| NestJS        | `^11.0.1` | Progressive Node.js framework for building efficient, reliable, and scalable server-side applications |
| TypeORM       | `^0.3.27` | ORM to interact with relational databases using TypeScript/JavaScript |
| PostgreSQL    | `15`      | Powerful, open-source relational database system      |
| Passport.js   | `^0.7.0`  | Authentication middleware for Node.js                 |
| JWT           | `^11.0.1` | JSON Web Token implementation for secure authentication |
| Bcrypt        | `^6.0.0`  | Library for hashing passwords                         |
| Docker        | `^24.0.0` | Containerization platform for consistent environments |
| Docker Compose| `^2.20.0` | Tool for defining and running multi-container Docker applications |
| Swagger       | `^11.2.1` | API documentation and testing tool                    |
| NestJS-Cls    | `^6.0.1`  | Continuation Local Storage for managing request-scoped data like correlation IDs |
| Terminus      | `^11.0.0` | Health check module for NestJS                        |

## Contributing
We welcome contributions to enhance this project! If you're interested in improving the Notification User Service, please follow these guidelines:

*   **Fork the repository**: Start by forking the project to your GitHub account.
*   **Create a new branch**: Use a descriptive name for your branch (e.g., `feature/add-logging`, `bugfix/auth-flow`).
*   **Make your changes**: Implement your features or bug fixes, ensuring adherence to coding standards.
*   **Write tests**: Add appropriate unit and E2E tests for your changes.
*   **Update documentation**: If your changes impact API endpoints or setup, update the README and other relevant documentation.
*   **Submit a Pull Request**: Once your changes are complete and tested, submit a pull request to the `main` branch. Provide a clear and concise description of your changes.

## License
This project is currently unlicensed, as indicated in the `package.json` file. All rights are reserved by the author.

## Author Info

*   **Developer**: [Your Name Here]
*   **LinkedIn**: [Your LinkedIn Profile]
*   **Twitter**: [@YourTwitterHandle]
*   **Portfolio**: [Your Portfolio Website]

---

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
