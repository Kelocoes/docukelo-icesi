---
sidebar_position: 3
---

# Express | TypeScript | MongoDB | Docker. Part 3

In this third part of the guide, we will implement security controls:

- **Authentication & Authorization**: User identity management and Role-Based Access Control (RBAC) using JSON Web Tokens (JWT).
- **Route Protection**: Protecting private endpoints with custom authentication middleware.

## User Roles in Mongoose Schema

Update `src/models/user.model.ts` to include role support:

```typescript title="src/models/user.model.ts" showLineNumbers
import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true, select: false },
        roles: { type: [String], enum: Object.values(UserRole), default: [UserRole.USER] }
    },
    { timestamps: true, collection: 'users' }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
```

## JWT Dependency Installation

Install `jsonwebtoken` and its type definitions:

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

## JWT Authentication Middleware

Create the JWT verification middleware:

```typescript title="src/middlewares/auth.middleware.ts" showLineNumbers
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: string[];
    };
}

export const authenticateJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    try {
        const decoded = jwt.verify(token, secret) as { id: string; roles: string[] };
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        next();
    };
};
```

## Protecting Routes

Apply authentication and role authorization to protected routes:

```typescript title="src/routes/boardgame.routes.ts" showLineNumbers
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { deleteBoardGame } from '../controllers/boardgame.controller';

const router = Router();

// Only ADMIN users can delete board games
router.delete(
    '/:id',
    authenticateJWT,
    authorizeRoles('ADMIN'),
    deleteBoardGame
);

export default router;
```
