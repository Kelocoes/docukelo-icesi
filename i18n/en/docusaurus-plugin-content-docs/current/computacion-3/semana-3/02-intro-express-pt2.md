---
sidebar_position: 2
---

# Express | TypeScript | MongoDB | Docker. Part 2

In this second part of the introduction to Express, TypeScript, MongoDB, and Docker, we will expand our RESTful API by adding validation, global error handling, and structured logging.

## Areas for Improvement

Starting from a basic CRUD application, several components are required to make it production-ready:

- **Data Validation**: Validate incoming request bodies and parameters using libraries like `express-validator`.
- **Error Handling**: Implement global error-handling middleware to capture exceptions and format consistent HTTP responses.
- **Authentication Middleware**: Secure endpoints using JWT verification middleware.
- **Logging Middleware**: Record incoming HTTP requests with timestamp, method, and route details.
- **API Documentation**: Integrate OpenAPI/Swagger for interactive endpoint documentation.

## Data Validation with `express-validator`

Install `express-validator`:

```bash
npm install express-validator
```

Create a reusable validation handler middleware:

```typescript title="src/middlewares/validation.middleware.ts" showLineNumbers
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
```

### Route-Level Validation Example

```typescript title="src/routes/boardgame.routes.ts" showLineNumbers
import { Router } from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import { createBoardGame } from '../controllers/boardgame.controller';

const router = Router();

router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('minPlayers').isInt({ min: 1 }).withMessage('Minimum players must be at least 1'),
        body('maxPlayers').isInt({ min: 1 }).withMessage('Maximum players must be at least 1'),
        handleValidationErrors
    ],
    createBoardGame
);

export default router;
```

## Global Error Handling Middleware

Create a centralized error handler:

```typescript title="src/middlewares/error.middleware.ts" showLineNumbers
import { Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};
```

Register the error handler in `src/index.ts` after all routes:

```typescript
app.use(errorHandler);
```
