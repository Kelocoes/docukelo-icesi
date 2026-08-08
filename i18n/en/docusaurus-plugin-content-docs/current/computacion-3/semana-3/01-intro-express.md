---
sidebar_position: 1
---

# Express | TypeScript | MongoDB | Docker. Part 1

Guided workshop for building a base project using MongoDB, Express, and TypeScript.

## 1. What is Express?

Express is a framework for the Node.js runtime environment that simplifies the creation of web applications and APIs. It provides a set of features and tools that streamline server-side development, particularly for building microservices and RESTful APIs. Some of the key features of Express include:

- **Routing**: Allows defining routes to handle different HTTP requests (GET, POST, PUT, DELETE, etc.) and associating them with specific handler functions.
- **Middleware**: Supports middleware functions executed during the request lifecycle. This enables adding functionality such as authentication, error handling, request body parsing, and logging.
- **Templating**: Facilitates integration with template engines to render dynamic HTML content.
- **Error Handling**: Provides an efficient mechanism for handling application errors.
- **Extensibility**: Integrates seamlessly with a wide variety of Node.js modules and packages.

Coming from prior learnings in Internet Computing 2, you will notice significant similarities between Express and the Java/Spring backend framework. To help you understand how Express works, comparisons with Spring concepts will be highlighted throughout this guide.

## 2. Why Use Express?

Express is a popular choice for web application and API development for several reasons:

- **Simplicity and Flexibility**: Express is minimalist and does not enforce a rigid structure, giving developers full control over application architecture.
- **Ecosystem**: As one of the most popular Node.js frameworks, it boasts a vast ecosystem of modules and packages that can be easily integrated.
- **Performance**: Express is known for efficient performance, making it suitable for high-concurrency applications.
- **Active Community**: Supported by a large community contributing documentation, tutorials, and ecosystem tools.
- **JavaScript/TypeScript Compatibility**: Built on Node.js, Express allows developers to use TypeScript across both frontend and backend stacks.

## 3. Why Use MongoDB Combined with Express and TypeScript?

Following popular full-stack development patterns, the MERN stack (MongoDB, Express, React, Node.js) is widely used for building modern web applications. MongoDB is a NoSQL document database that integrates naturally with Express and Node.js due to its flexible schema and scalability.

<img src="/img/computacion-3/mern.png" alt="MERN Stack" width="800"/>

## 4. Guided Workshop Context

Board games have gained immense popularity as social activities. However, dedicated community platforms remain limited. In this guided workshop, we will build a core application that allows users to register, log in, and share their favorite board games. The application will feature:

- **User Registration**: Create accounts with name, email, and a secure password.
- **Authentication**: User login with credentials issuing JWT tokens.
- **Board Game Management**: CRUD operations for board game catalog entries.
- **Comment System**: Users can comment on games and share reviews.
- **Game Session Scheduling**: Organize play sessions with location and date details.

## 5. Development Environment Setup

Following course practices, container technology powered by Docker and Docker Compose will be used to streamline local development, environment reproducibility, and cloud deployments.

### 5.1. Prerequisites

Before starting, ensure the following are installed:
- [Node.js](https://nodejs.org/) (Version 22)
- [Docker](https://www.docker.com/get-started)

### 5.2. Containerized Database Setup

We will use Docker Compose to define and run a MongoDB container. Create a file named `docker-compose.yml` at your project root:

```yaml title="docker-compose.yml" showLineNumbers
services:
    mongo:
        image: mongo:8.0.12
        container_name: mongo
        restart: always
        ports:
        - "27017:27017"
        environment:
            MONGO_INITDB_ROOT_USERNAME: admin
            MONGO_INITDB_ROOT_PASSWORD: admin123
            MONGO_INITDB_DATABASE: boardgame-db
        volumes:
        - mongo_data:/data/db

volumes:
    mongo_data:
```

Execute the container in detached mode:

```bash
docker compose up -d
```

Verify that the container is running:

```bash
docker ps
```

To stop the container when needed:

```bash
docker compose down
```

### 5.3. Node.js Project Setup with TypeScript

Initialize a new Node.js project in the working directory:

```bash
npm init -y
```

Install core runtime dependencies:

```bash
npm install express mongoose dotenv cors bcrypt
```

Install TypeScript and development tooling:

```bash
npm install --save-dev typescript @types/node @types/express @types/bcrypt ts-node nodemon
```

Initialize the TypeScript compiler configuration:

```bash
npx tsc --init
```

Update `tsconfig.json`:

```json title="tsconfig.json" showLineNumbers
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

Add development scripts to `package.json`:

```json title="package.json"
"scripts": {
    "start": "ts-node ./src/index.ts",
    "dev": "nodemon ./src/index.ts"
}
```

### 5.4. Project Structure

Organize the `src/` directory following clean architecture principles:

```
compunet3-20252/
├── .gitignore
├── .env
├── docker-compose.yml
├── package.json
├── src
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── index.ts
└── tsconfig.json
```

- **config/**: Database connections and environment configurations.
- **controllers/**: Handles HTTP requests and delegates business logic (similar to Spring `@RestController`).
- **interfaces/**: TypeScript type definitions and interfaces.
- **models/**: Mongoose schemas representing database collections.
- **routes/**: Express router endpoints (similar to Spring `@RequestMapping`).
- **services/**: Business logic layer.
- **index.ts**: Server entry point.

## 6. Creating the Express Server

### 6.1. Entry Point (`src/index.ts`)

```typescript title="src/index.ts" showLineNumbers
import express, { Express } from 'express';
import { db } from './config/connectionDB';

const app: Express = express();
process.loadEnvFile();

const port = process.env.PORT || 3000;

app.use(express.json());

db();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

### 6.2. Containerizing the Express Application

Create a `Dockerfile` in the project root:

```dockerfile title="Dockerfile" showLineNumbers
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Update `docker-compose.yml` to include the Express service alongside MongoDB:

```yaml title="docker-compose.yml" showLineNumbers
services:
    express:
        build: .
        ports:
            - "3000:3000"
        environment:
            - PORT=3000
            - MONGO_URI=mongodb://admin:admin123@mongo:27017/boardgame-db?authSource=admin
        depends_on:
            - mongo
    mongo:
        image: mongo:8.0.12
        container_name: mongo
        restart: always
        ports:
            - "27017:27017"
        environment:
            MONGO_INITDB_ROOT_USERNAME: admin
            MONGO_INITDB_ROOT_PASSWORD: admin123
            MONGO_INITDB_DATABASE: boardgame-db
        volumes:
            - mongo_data:/data/db

volumes:
    mongo_data:
```

Run both services with Docker Compose:

```bash
docker compose up -d --build
```

View application logs:

```bash
docker compose logs -f express
```
