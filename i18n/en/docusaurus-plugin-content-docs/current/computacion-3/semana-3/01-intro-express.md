---
sidebar_position: 1
description: "Follow a guided workshop to build a base API with Express, TypeScript and MongoDB, and understand why each technology is used."
---

# Base API: Express, TypeScript and MongoDB

Guided workshop to build a base project with MongoDB, Express and TypeScript.

## 1. What is Express?

Express is a framework for the Node.js runtime environment that makes it easier to build web applications and APIs. It provides a set of features and tools that simplify server-side development, especially for microservices and RESTful APIs. Some of the key features of Express include:

- **Routing**: Lets you define routes to handle different HTTP requests (GET, POST, PUT, DELETE, etc.) and associate them with specific functions.
- **Middleware**: Supports middleware, which are functions that run during the lifecycle of a request. This lets you add features such as authentication, error handling, request body parsing, etc.
- **Templates**: Makes it easy to integrate with template engines to generate dynamic HTML content.
- **Error handling**: Provides a system to handle errors efficiently.
- **Extensibility**: Allows integration with a wide variety of Node.js modules and packages to extend its functionality.

Coming from the earlier projects and lessons of the Computación en Internet 2 course, you will find quite a few similarities between Express and the Spring backend framework, so to help you understand how Express works I will draw some parallels with what you already know.

## 2. Why use Express?
Express is a popular choice for developing web applications and APIs for several reasons:

- **Simplicity and flexibility**: Express is minimalist and does not impose a rigid structure, which gives developers full control over the architecture of their application.
- **Ecosystem**: Being one of the most popular frameworks for Node.js, it has a large number of modules and packages that can be integrated easily. Some of them will be reviewed in this guide and others will be added in upcoming sessions.
- **Performance**: Express is known for its efficient performance, which makes it suitable for high-concurrency applications (although it is not as robust as heavier frameworks such as Spring).
- **Active community**: It has a large and active community that contributes documentation, tutorials and support, which makes it easier to solve problems and learn.
- **JavaScript/TypeScript compatibility**: Since it is built on Node.js, Express lets developers use JavaScript or TypeScript on both the frontend and the backend, which can simplify development and collaboration between teams.

## 3. Why use MongoDB combined with Express and TS?

Following the most popular development stacks, the MERN stack (MongoDB, Express, React, Node.js) is widely used to build modern web applications. MongoDB is a NoSQL database that integrates well with Express and Node.js thanks to its flexible and scalable nature.

<img src="/img/computacion-3/mern.png" alt="MERN Stack" width="800"/>

## 4. Context of the guided workshop

Board games have been one of the most popular activities I have experienced in recent years: they have allowed me to discover new ways of seeing the world and to connect with people. However, I have noticed that there are no modern applications that talk about them and build community, so as a guided workshop we will develop a basic application that lets users sign up, log in and share their favorite board games. The application will have the following features:

- User registration: Users will be able to create an account by providing their name, email and a secure password.
- Login: Users will be able to log in to the application using their email and password.
- Board game management: Users will be able to add, edit and delete board games.
- Comment creation: Users will be able to comment on board games and share their opinions.
- Scheduling sessions with locations and dates: Users will be able to schedule game sessions, specifying the location and the date of the event.

## 5. Development environment setup

Following the topics covered in the course, I will try to build most of the application in this guided workshop using the container technologies provided by Docker and Docker Compose, so that you understand the workflow and the importance of these technologies in modern software development. It will also let you migrate and deploy your applications to the cloud easily.

### 5.1. Prerequisites

Before you start, make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 22)
- [Docker](https://www.docker.com/get-started)

### 5.2 Creating the containerized database

To make creating the database easier, we will use Docker Compose to define and run a MongoDB container. Create a file named `docker-compose.yml` at the root of your project with the following content:

```yaml title="docker-compose.yml"
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

We will use version 8.0.12 of MongoDB, which is one of the most recent at the time of writing this guide. The container will expose port 27017, which is the default MongoDB port, and will set up an administrator user with the credentials `admin` and `admin123`. In addition, a volume named `mongo_data` is created to persist the database data.

We can run the container with the following command:

```bash
docker compose up -d
```

This will start the MongoDB container in the background. You can verify that the container is running correctly with the command:

```bash
docker ps
```
You should see the MongoDB container in the list of running containers.

If you want to stop the container, you can use the command:

```bash
docker compose down
```

### 5.3. Setting up the Node.js project with TypeScript

To begin, we will use the directory where we created the `docker-compose.yml` file as our working directory. Open a terminal and navigate to that directory. Then run the following commands to initialize a new Node.js project:

```bash
npm init -y
```

This will create a `package.json` file with the default project configuration.

Next, we will install the dependencies our project needs. Run the following command:

```bash
npm install express mongoose dotenv cors bcrypt
```

Now we will install TypeScript and the related tools to set up our project with TypeScript:

```bash
npm install --save-dev typescript @types/node @types/express @types/bcrypt ts-node nodemon
```

Then initialize a TypeScript configuration file by running:

```bash
npx tsc --init
```

This will generate a `tsconfig.json` file in your project. You can customize it to your needs, but the default configuration should be enough to get started.

The `tsconfig.json` configuration file should look something like this:

```json title="tsconfig.json"
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    "outDir": "./dist", // Output directory for the compiled files

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext", //"module": "commonjs"
    "target": "esnext",  // "target": "es2016"
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": false,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

> **Note:** Make sure you create a .gitignore file at the root of your project and add the following lines to avoid uploading unnecessary files to the repository:

```
node_modules/
dist/
.env
```

Finally, we will modify the `package.json` file to add scripts that let us run our project with TypeScript and Nodemon. Add the following to the scripts section:

```json title="package.json"
"scripts": {
    "start": "ts-node ./src/index.ts",
    "dev": "nodemon ./src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

Ts-Node lets us run TypeScript files directly, while Nodemon automatically restarts the application every time it detects changes in the files.

### 5.4. Project structure

Unlike working with Java / Spring, in Node.js and Express there is no strictly defined project structure, but it is advisable to follow a convention to keep the code organized. A common structure for an Express project with TypeScript could be the following:

```
compunet3-20252/
├── .gitignore
├── .env
├── docker-compose.yml
├── package-lock.json
├── package.json
├── src
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── models/
│   ├── routes/
│   └── services/
│   └── index.ts
└── tsconfig.json
```

There are clearly differences with the structure of a Java project, but the idea is that each folder has a specific responsibility:

- **config/**: Contains configuration files, such as the database connection and environment variables.
- **controllers/**: Contains the controllers that handle the business logic and the responses to HTTP requests, similar to controllers in Spring.
- **interfaces/**: Defines the TypeScript interfaces for the data models and other types used in the application.
- **models/**: Contains the data models, which represent the application entities and communicate with the database.
- **routes/**: Defines the application routes and associates them with the corresponding controllers (you can relate it to the `@RequestMapping` annotations in Spring).
- **services/**: Contains the business logic and services that interact with the models and controllers.
- **index.ts**: The entry point of the application, where the Express server is configured and started.

I have also added a `.env` file to manage environment variables, such as the database credentials and other sensitive settings.

## 6. Creating the Express server

### 6.1 Creating the `index.ts` file

Now that we have the project structure and the dependencies installed, let us create the Express server. Open the `src/index.ts` file and add the following code:

```typescript title="src/index.ts"
import express, { Express, Request, Response } from 'express';

import { db } from './config/connectionDB'; // It has not been created yet

const app: Express = express(); // Create an instance of express

process.loadEnvFile(); // Process is a Node.js module to manage the runtime environment; here we load the environment variables from the .env file

const port = process.env.PORT || 3000; // Define the port the server will listen on; if it is not set in the environment variables, it uses port 3000 by default.

app.use(express.json()); // Express module to handle JSON requests
app.use(express.urlencoded({ extended: true })); // Express module to handle URL-encoded requests

app.get("/", (req: Request, res: Response) => { // Define a root route to test that the server is working correctly.
    res.send('Hello World');
});

// Connect to the database and then start the server
db.then(() =>
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
);
```

In this file we aim for a simple configuration using `Express`, so we import the necessary dependencies and configure the server to listen on a specific port (3000 by default). We also configure the middleware to handle JSON and URL-encoded requests.

Since we can configure environment variables (as was done with Spring's `application.properties` file), we will create a `.env` file at the root of the project with the following content:

```
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017
```

### 6.2. Creating the database connection file

To maintain a connection to the MongoDB database, we will create a configuration file in the `config` folder called `connectionDB.ts`. This file will be in charge of establishing the connection to the database using Mongoose, an object modeling library for MongoDB in Node.js.

Create the file `src/config/connectionDB.ts` and add the following code:

```typescript title="src/config/connectionDB.ts"
import mongoose from "mongoose";

process.loadEnvFile();

const connectionString = process.env.MONGO_URI || "";

export const db = mongoose.connect(connectionString, { dbName: 'boardgame-db'})
    .then(() =>
        console.log("Connected to MongoDB")
    ).catch(
        (error) => console.error(error)
    )
```

In this file we import Mongoose and use the `connect` function to establish a connection to the MongoDB database using the connection string defined in the environment variables. We also specify the database name as `boardgame-db`, which is the one we defined in the `docker-compose.yml` file.

### 6.3. Running the server

Let us do a simple test. Run the following command in the terminal to start the server:

```bash
npm run dev
```

If everything worked correctly, you should see a message in your terminal saying that the server is running on port 3000. Now open your browser and go to `http://localhost:3000`. You should see the message "Hello World".

## 7. Creating a data model


### 7.1 Creating the User model

Now that we have the server running, let us create a data model to represent our users. In JavaScript development environments, it is common for the modules of an application to have an `index.ts` file that exports all the modules in the directory, so we will create an `index.ts` file in the `models` folder to export our data models.

Create the file `src/models/index.ts` and add the following code:

```typescript title="src/models/index.ts"
export * from "./user.model";
```

Then, we will create the data model for users in a file called `user.model.ts` inside the `models` folder. Create the file `src/models/user.model.ts` and add the following code:

```typescript title="src/models/user.model.ts"
import mongoose from "mongoose";
import { UserInput } from "../interfaces"; // TODO

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true, collection: 'users' })

export const UserModel = mongoose.model<UserDocument>("User", userSchema); 
```

Mongoose is one of the modules we will use to interact with the MongoDB database. It is considered an `ODM (Object Document Mapper)`, which lets you define schemas and models for the database documents, making it easier to work with MongoDB.

The instructions we want to illustrate with this script are the following:
1. We define a `UserDocument` interface that extends `UserInput` and `mongoose.Document`. This interface represents a user document in the database and defines the fields the model will have, including the timestamp fields (`createdAt`, `updatedAt`, `deletedAt`).
2. We create a Mongoose schema called `userSchema` that defines the structure of the user document, including the `name`, `email` and `password` fields. The `email` field is unique and has an index to improve query performance. You can relate Mongoose schemas to entities in JPA/Hibernate.
3. Finally, we export the `UserModel` model, which is based on the defined schema. This model will be used to interact with the users collection in the database, just as repositories were used in Spring Data JPA.

> **Note:** We have not defined the `UserInput` interface yet; it will be your job to define it in the file `src/interfaces/user.interface.ts`. This interface must contain the `name`, `email` and `password` fields that will be used when creating a new user. Remember to add the `index.ts` file in the `interfaces` folder to export the `UserInput` interface.

### 7.2 Creating the Games model

In the context of this board game application, it is essential to have a model that represents the games themselves, which can be registered and managed by users. This model will let us store relevant information about each game, making it easier to manage and query within the application.

Create the file `src/models/game.model.ts` and add the following code:

```typescript title="src/models/game.model.ts"
import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface GameDocument extends mongoose.Document {
    title: string;
    genre: string;
    releaseDate: Date;
    createdBy: UserDocument;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, collection: 'games' });

export const GameModel = mongoose.model<GameDocument>("Game", gameSchema);
```

Remember to add the export of the model in the `src/models/index.ts` file:

```typescript title="src/models/index.ts"
export * from "./user.model";
export * from "./game.model";
```

## 8. Creating a service for user management

Keeping a structure similar to Spring, we will create a service to handle the business logic related to users. This service will interact with the user model and provide methods to create, read, update and delete users.

### 8.1 Creating the UserService service

In the services layer, although in JavaScript it is not a rule to handle all functionality through constants or functions, classes are a good way to encapsulate business logic. So we will create a `user.service.ts` file inside the `services` folder and add the following code:

```typescript title="user.service.ts"
import bcrypt from "bcrypt";

import { UserInput } from "../interfaces";
import { UserDocument, UserModel } from "../models";

class UserService {
    public async create(userInput: UserInput): Promise<UserDocument> {
    }

    public findByEmail(email: string): Promise<UserDocument | null> {
    }

    public async update(id: string, userInput: UserInputUpdate): Promise<UserDocument | null> {
    }

    public getAll(): Promise<UserDocument[]> {
    }

    public getById(id: string): Promise<UserDocument | null> {
    }

}

export const userService = new UserService();
```

As you can see, what we have done so far is define a `UserService` class that contains methods to create, find, update and retrieve users. Each method interacts with the `UserModel` model to perform the necessary operations on the database.

First, let us review the method that will let us create new users.

#### 8.1.1 create method
To implement the `create` method, we must make sure the user's password is stored securely. To do so, we will use `bcrypt` to hash the password before saving it to the database. Here is the implementation of the `create` method:

```typescript title="create method"
public async create(userInput: UserInput): Promise<UserDocument> {

        process.loadEnvFile();

        const userExists: UserDocument | null = await this.findByEmail(userInput.email);
        if (userExists !== null) {
            throw new ReferenceError("User already exists");
        }
        if (userInput.password) {
            userInput.password = await bcrypt.hash(userInput.password, 10);
        }
        return UserModel.create(userInput);
    }
```

Since we are working with TypeScript, we can see its advanced use in different parts of the code. For example, the use of `Promise<UserDocument>` indicates that the `create` method will return a promise that resolves to an object of type `UserDocument`. This is useful to handle asynchronous operations, such as database queries.

In addition, using `ReferenceError` to throw an error if the user already exists is a good practice for handling errors in a controlled way. `bcrypt.hash` is also used to hash the user's password before saving it to the database, which improves the security of the application (it could be improved further).

#### 8.1.2 findByEmail method
The `findByEmail` method will be in charge of finding a user by their email. Here is the template of the method:

```typescript title="findByEmail method"
public findByEmail(email: string): ? {
    return UserModel.?
}
```

Your task is to complete this method so that it finds a user by their email using the `UserModel` model. You can use Mongoose's `findOne` method to perform this operation.

#### 8.1.3 update method
The `update` method will be in charge of updating the information of an existing user. Here is the template of the method:

```typescript title="update method"
public async update(id: string, userInput: UserInputUpdate): Promise<UserDocument | null>{
    try {
        const user: UserDocument | null = await UserModel.findOneAndUpdate(
            {_id: id}, 
            userInput, 
            {returnOriginal: false}
        );

        return user; 
    } catch (error) {
        throw error;
    }
}
```

As you can see, mongoose offers the `findOneAndUpdate` method, which lets us find a document by its ID and update it with the new data provided in `userInput`. The `{returnOriginal: false}` parameter makes sure the updated document is returned instead of the original one.

> **Note:** Make sure you define the `UserInputUpdate` interface in the file `src/interfaces/user.interface.ts` so you can use it in this method. This interface must contain the fields that can be updated, such as `name` and `email`. We will leave the way to update the password as a later exercise.

#### 8.1.4 getAll method
The `getAll` method will be in charge of retrieving all the users from the database.

```typescript title="getAll method"
public getAll(): Promise<UserDocument[]> {
    return UserModel.find();
}
```

This method uses Mongoose's `find` method to retrieve all the documents in the users collection. It returns a promise that resolves to an array of `UserDocument`.

#### 8.1.5 getById method
The `getById` method will be in charge of retrieving a user by their ID. Here is the template of the method:

```typescript title="getById method"
public getById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
}
```

> **Note:** Make sure you export the `userService` service at the end of the file `src/services/user.service.ts` so it can be used in other parts of the application. This will be done through the `index.ts` file in the `services` folder. You do not need to worry that a new instance is created every time the service is imported: in JavaScript and TypeScript, modules are cached, so the instance is created only once and reused in every import (it behaves as a singleton).

## 9. Creating a controller for user management
Now that we have the `UserService` service implemented, let us create a controller to handle the HTTP requests related to users. This controller will be in charge of receiving requests, calling the corresponding service and returning the appropriate responses.

### 9.1 Creating the UserController controller

Create a `user.controller.ts` file next to the `index.ts` file inside the `controllers` folder and add the following code:

```typescript title="index.ts"
import { Request, Response } from "express";
import { UserDocument } from "../models";
import { userService } from "../services";
import { UserInput, UserInputUpdate } from "../interfaces";

class UserController {
    public async create(req: Request, res: Response){
    }

    public async getAll(req: Request, res: Response){
    }

    public async getOne(req: Request, res: Response){
    }

    public async  update(req: Request, res: Response){
    }
    public delete(req: Request, res: Response){
        // TODO
    }
}

export const userController = new UserController();
```

Since we will handle requests, each controller method will receive an Express `Request` object and a `Response` object. These objects let us access the request data and send responses to the client, such as HTTP status codes, headers and response bodies.

#### 9.1.1 create method
The `create` method will be in charge of creating a new user. Here is the implementation of the method:

```typescript title="create method (2)"
public async create(req: Request, res: Response) {
    try {
        const userInput: UserInput = req.body;
        const user: UserDocument = await userService.create(userInput); // It could also be req.body as UserInput;
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof ReferenceError) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        res.status(500).json(error);
    }
}
```

For now, its functionality is limited, so we use it as a delegate to the `userService` service. This method receives the user data from the request body (`req.body`), calls the service's `create` method and returns the created user with a 201 (Created) status code. If an error occurs, it is handled appropriately and an error message is returned with a 500 (Internal Server Error) status code.


#### 9.1.2 getAll method
The `getAll` method will be in charge of retrieving all the users. Here is the implementation of the method:

```typescript title="getAll method (2)"
public async getAll(req: Request, res: Response) {
    try {
        const users: UserDocument[] = ?;
        res.json(users);
    } catch (error) {
        res.status(?).json(error);
    }
}
```

#### 9.1.3 getOne method
The `getOne` method will be in charge of retrieving a user by their ID, so we want to receive it as a request parameter. Here is the implementation of the method:

```typescript title="getOne method"
public async getOne(req: Request, res: Response) {
    try {
        const id: string = req.params.id || "";
        const user: UserDocument | null = await userService.getById(id);
        if (user === null) {
            res.status(404).json({ message: `User with id ${id} not found` });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}
```

#### 9.1.4 update method

Implement the `update` method in a way similar to the previous ones, making sure errors are handled correctly and the updated user is returned.


## 10. Creating the routes for users

Unlike Spring, where endpoint routes are defined directly in the controllers using annotations, in Express routes are handled more explicitly. We will create a `user.route.ts` file inside the `routes` folder to define the routes related to users (do not forget to add the `index.ts` file).

Create the file `src/routes/user.route.ts` and add the following code:

```typescript title="src/routes/user.route.ts"
import express, { Request, Response } from "express";
import { userController } from "../controllers";

export const router = express.Router();

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

router.put("/:id", userController.update);

router.post("/", userController.create);
```

This way Express lets us specify the application routes more explicitly. In this case, we have defined the routes to get all users (`GET /`), get a user by ID (`GET /:id`), update a user by ID (`PUT /:id`) and create a new user (`POST /`).

### 10.1 Integrating the routes into the server

To integrate the user routes into our Express server, we must import the router we just created and use it in the `src/index.ts` file. Add the following code after the middleware configuration:

```typescript title="src/index.ts"
import { router as userRouter } from "./routes/user.route";

app.use("/api/users", userRouter);
```

## 11. Testing the API

To test our API, we can use tools such as Postman, Insomnia or a cURL command directly in the terminal. These tools let us send HTTP requests to our server and see the responses.

First make sure the server is running. Then you can test the endpoints:

```bash
npm run dev
```

## 12. Express in Docker

To keep the deployment of our service simple, we will create a `Dockerfile` at the root of the project. This file will be in charge of building a Docker image for our Express application. After that, we will add it to the `docker-compose.yml` file so that it runs together with the MongoDB container.
Create the `Dockerfile` file at the root of the project and add the following content:

```bash title="Dockerfile"
# We use the official Node.js image as a base
FROM node:22
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy our project files into the container
COPY package*.json ./
# Install the project dependencies
RUN npm install
# Copy the rest of the project files into the container
COPY . .
# Expose the port our application will listen on
EXPOSE 3000
# Command to start the application
CMD ["npm", "run", "dev"]
```

After that, we will modify the `docker-compose.yml` file to include our Express service. Add the following to the file:

```yaml title="docker-compose.yml"
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

  express:
    build: .
    container_name: express-app
    restart: always
    ports:
        - "3000:3000"
    depends_on:
        - mongo

volumes:
    mongo_data:
```
With this, we have defined a new service called `express` that will build the Docker image from the `Dockerfile` at the root of the project. The container will expose port 3000 and will depend on the MongoDB container to work correctly.

We can watch the logs of the Express container by running the following command:

```bash
docker compose logs -f express
```

> **Note:** Make sure the MongoDB container is running before starting the Express container, since the latter depends on the former to work correctly. In addition, because both containers will communicate through a Docker network, you need to change the MongoDB connection string in the `.env` file so that it points to the name of the MongoDB service instead of `localhost`. Change the line `MONGO_URI=mongodb://admin:admin123@localhost:27017` to `MONGO_URI=mongodb://admin:admin123@mongo:27017`.

## 13. TO DO

- [ ] Implement the `delete` method in the user controller.
- [ ] Implement a CRUD for the `Game` data model.
- [ ] Implement a service to handle the business logic related to board games.
- [ ] Implement a controller to handle the HTTP requests related to board games.
- [ ] Implement the routes for board games.