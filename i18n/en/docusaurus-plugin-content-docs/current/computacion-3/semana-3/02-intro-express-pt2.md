---
sidebar_position: 2
description: "Improve your Express API by adding data validation, middlewares and exception handling."
---

# Data Validation and Middlewares

In this second part of the introduction to Express, TypeScript, MongoDB and Docker, we will continue building a RESTful API with these technologies. In the first part we set up the environment and created a basic server. Now we will add more features and improve our application.

## Aspects to improve

So far your system should have a basic CRUD for one or two entities, but it needs a few touch-ups to be more robust and functional. Here are some suggestions:
- **Data validation**: Make sure you validate the incoming data in your routes. You can use libraries such as `Joi` or `express-validator` for this.
- **Error handling**: Implement an error-handling middleware to catch and respond appropriately to the errors that may occur in your application.
- **Authentication middlewares**: If your API requires authentication, implement middlewares to verify JWT tokens or user sessions.
- **Logging middlewares**: Implement a middleware that logs incoming requests, including the time, the path and the HTTP method. This will help you debug and monitor your application.
- **API documentation**: Consider using tools such as Swagger to document your API. This will make it easier for other developers to understand how to interact with your service.

## Data validation

As you may have noticed so far, frameworks like Express are built on small modules that you can add to your application. One of these modules is `express-validator`, which lets you validate the incoming data in your routes in a simple way.

To install `express-validator`, run the following command:

```bash
npm install express-validator
npm install @types/express-validator --save-dev
```

From this, we will create a middleware that validates the input data in our routes. This middleware will sit before the requests reach the controllers and will verify that the data meets the defined rules.

> Remember to create an index.ts file in the `middlewares` folder and export the validation middleware from there.

```typescript title="Data validation"
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req); // Get the validation errors
    if (!errors.isEmpty()) {
        // If there are validation errors, respond with a 400 error
    }
    next();
};
```

As you can see, middlewares are functions that receive three parameters: `req`, `res` and `next`. In this case, we use `validationResult` from `express-validator` to obtain the validation errors. If there are errors, we respond with a 400 error and do not call `next()`, which stops the execution of the middleware chain. If we executed `next()` when there are no errors, execution would continue to the next middleware or controller, and yes, you can chain middlewares so they run in order.
```typescript title="Data validation (2)"
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation errors',
            errors: errors.array().map(error => ({
                field: error.type === 'field' ? error.path : 'unknown',
                message: error.msg,
                value: error.type === 'field' ? error.value : undefined
            }))
        });
    }
    next();
};
```

A base code for the middleware could look like this: if any error has been found (represented by an array of errors), it responds with a 400 error and a message indicating that there were validation errors. In addition, it includes an array of errors with information about each one of them, such as the affected field, the error message and the value that caused the error.

Now, with the help of `express-validator`, we will create the validation schemas for the routes we have created. For example, if we have a route to create a user, we can define a validation schema like this:

> Create a folder called `validators` and inside it create a `userValidator.ts` file where we will define the validations for the user. Remember to create the `index.ts` file in the `validators` folder to export the validators.

```typescript title="index.ts"
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middlewares';

export const userValidations = {
};
```

Inside this object you can define the validations you need. For example, if you want to validate that the user name is a string with a minimum length, you can do the following:

```typescript title="Data validation (3)"
export const userValidations = {
    create : [
        body('name')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Name must be between 1 and 100 characters'),

        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid email address'),

        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),

        handleValidationErrors
    ]
};
```

In this example, we validate that the `name` field is a string with a minimum length of 1 and a maximum of 100 characters, that the `email` field is a valid email address and that the `password` field has at least 8 characters. If any of these validations fails, a 400 error will be sent with a descriptive message.
To use these validations in your routes, simply import the validator and add it to the corresponding route. For example:

```typescript title="Data validation (4)"
import express, { Request, Response } from "express";
import { userController } from "../controllers";
import { userValidations } from "../validators";

export const router = express.Router();

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

router.put("/:id", userController.update);

router.post("/", userValidations.create, userController.create);

router.delete("/:id", userController.delete);
```

Now it is your turn to implement the validations for the other routes you have created. Remember that you can define different validations for each route as needed.

Here is a list of methods that exist in `express-validator` so you can use them in your validations:

| Method | Description |
|--------|-------------|
| `body(field)` | Validates the request body for the specified field. |
| `query(field)` | Validates the query parameters for the specified field. |
| `param(field)` | Validates the route parameters for the specified field. |
| `header(field)` | Validates the request headers for the specified field. |
| `cookie(field)` | Validates the request cookies for the specified field. |
| `check(field)` | Validates any field of the request (body, query, route, header or cookie). |
| `exists()` | Checks whether the field exists in the request. |
| `isEmail()` | Checks whether the field is a valid email address. |
| `isLength({ min, max })` | Checks whether the length of the field is within the specified range. |
| `isInt({ min, max })` | Checks whether the field is an integer within the specified range. |
| `isFloat({ min, max })` | Checks whether the field is a floating-point number within the specified range. |
| `isBoolean()` | Checks whether the field is a boolean value. |
| `isIn(values)` | Checks whether the field is within a set of allowed values. |
| `matches(regex)` | Checks whether the field matches a regular expression. |
| `trim()` | Removes the whitespace at the beginning and end of the field. |
| `escape()` | Escapes special characters in the field to prevent code injection. |
| `toLowerCase()` | Converts the field to lowercase. |
| `toUpperCase()` | Converts the field to uppercase. |
| `custom(callback)` | Lets you define a custom validation through a callback function. |

## Middlewares

Middlewares are functions that run during the lifecycle of an HTTP request in Express. They can be used for tasks such as data validation, error handling and authentication, among others.

So far we have created a data validation middleware, but we can also create a logging middleware that records incoming requests. This middleware can be useful to debug and monitor the activity of your application.

To create a logging middleware, you can follow these steps:
1. Create a `logger.ts` file in the `middlewares` folder.
2. Define a middleware function that logs the time, the path and the HTTP method of every incoming request.

```typescript	 title="logger.ts"
export const logger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString(); // ISO 8601 date format, e.g.: 2023-10-01T12:34:56.789Z
    const startTime = Date.now(); // Timestamp of the start of the request

    const originalSend = res.send; // Save the original response-sending function
    res.send = function (body) { // Override the response-sending function
        // Operation that runs when the request finishes
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const logEntry = `[${timestamp}] ${req.method} ${req.baseUrl} ${req.path} | Status: ${res.statusCode} | Time: ${responseTime}ms\n`;

        const logDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const date = new Date().toISOString().split('T')[0];
        const fileName = `api-${date}.log`;
        const filePath = path.join(logDir, fileName);

        fs.appendFileSync(filePath, logEntry, 'utf8');

        // Call the original response-sending function
        return originalSend.call(this, body);
    };

    next();
};
```

This way of overriding the `res.send` function may look a bit strange, but it is a common technique to add extra functionality to responses without losing the original functionality. In simple terms, what we want is to save the original `res.send` method in an `originalSend` variable, then override `res.send` with a new function that logs the request, and finally call `originalSend` to send the response. This way we can log the request and still send the response to the client.

We will register this middleware in the general `index.ts` file of the project, right before defining the routes. This way, all incoming requests will go through this middleware and will be logged to a log file.

```typescript title="index.ts"
app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // We add it to be able to receive HTML form data if needed

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

We have seen two places where we can add middlewares: one is before defining the routes and the other is after defining the routes. The difference between them is that if we add it before the routes, the middleware will run for all incoming requests, while if we add it after the routes, the middleware will only run for requests that do not match any defined route.

What if I want multiple middlewares to run in a given order for a specific route? You can chain middlewares in the route definition. For example:

```typescript title="Middlewares"
router.post(
    "/",
    userValidations.create, // Validation middleware
    logger, // Logging middleware
    userController.create // Controller that handles the user creation
);
```

## Exceptions

Regarding exceptions, we can create an error-handling middleware that catches any error that occurs in the application and responds appropriately. This middleware will run after all the other middlewares and routes, and will be in charge of sending a response with the error to the client.

To create an error-handling middleware, follow these steps:
1. Create an `errorHandler.ts` file in the `middlewares` folder.
2. Define a middleware function that catches the errors and sends an appropriate response.

```typescript title="errorHandler.ts"
import { Request, Response, NextFunction } from 'express';

// Interface for custom errors
interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Class to create custom errors
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware to handle errors
export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log('🚨 Error Handler executed!');
    console.log('Error:', error.message);
    console.log('Status Code:', error.statusCode || 500);
    console.log('URL:', req.url);
    console.log('Method:', req.method);

    // If it is a custom error (AppError)
    if (error.isOperational) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }

    // Generic error (not operational)
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'dev' ? error.message : 'Something went wrong'
    });
};

// Helper function to create errors
export const createError = (message: string, statusCode: number = 500) => {
    return new AppError(message, statusCode);
};
```

This middleware catches any error that occurs in the application and checks whether it is a custom error (of type `AppError`). If so, it responds with the status code and the error message. If not, it responds with a generic 500 error.
To use this middleware, simply import it and register it in the general `index.ts` file of the project, right after defining the routes. This way, any error that occurs in the routes will be caught by this middleware.

```typescript title="index.ts"
app.use('/api/users', userRoutes);
app.use(errorHandler); // Error-handling middleware
```

