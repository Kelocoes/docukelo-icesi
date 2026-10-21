---
sidebar_position: 3
description: "Implement authentication and authorization with JWT and protect the routes of your Express API using middlewares."
---

# Authentication and Route Protection

Following the aspects to improve mentioned earlier, in this section we will implement the following improvements:

- **Authentication and authorization**: We will implement an authentication and authorization system using JWT (JSON Web Tokens) to protect the API routes.
- **Route protection**: We will add middleware to protect the routes that require authentication.

## Authentication and authorization

Before implementing authentication and authorization, we will make sure users have a `role` field in their user model. This field will let us define roles such as "admin" or "user". We will keep it simple, although a more robust implementation could include a role system with more detailed permissions.

First, we will modify the `user.model.ts` file to include the `role` field:

```typescript title="user.model.ts"
export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
    roles: UserRole[];
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    roles: { type: [String], enum: Object.values(UserRole), default: [UserRole.USER] },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, collection: 'users' });

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
```

### Installing dependencies
To implement authentication with JWT, we will need to install a few additional dependencies:

```bash
npm install @types/jsonwebtoken --save-dev
npm install jsonwebtoken
```

### Creating the authentication service
Now we will create an authentication service that handles registration, login and the generation of JWT tokens. We will create a new `auth.service.ts` file in the `services` folder:

```typescript title="auth.service.ts"
class AuthService {
    public async login(userLogin: UserLoginInput): Promise<UserLoginOutput> {
        // Find the user by email
        // Verify the password
        // Generate and return the JWT token
        // Return a response
    }

    public async generateToken(user: UserDocument): Promise<string> {
    }

}
```

Inside this service, we will implement the `login` and `generateToken` methods. The `login` method will verify the user credentials and generate a JWT token if they are valid. The `generateToken` method will generate a JWT token using the `jsonwebtoken` library.

Let us start with the login:

```typescript title="Creating the authentication service"
public async login(userLogin: UserLoginInput): Promise<UserLoginOutput> {
        const userExists: UserDocument | null = await userService.findByEmail(userLogin.email);
        if (userExists === null) {
            throw new ReferenceError("Not Authorized");
        }
        const isMatch: boolean = await bcrypt.compare(userLogin.password, userExists.password);

        if (!isMatch) {
            throw new ReferenceError("Not Authorized");
        }

        return {
            id: userExists.id,
            roles: userExists.role,
            token: await this.generateToken(userExists)
        };
    }
```

As you can see, we first look up the user by their email. If it does not exist, we throw an authorization error. Then, we compare the provided password with the one stored in the database using `bcrypt`. If the credentials are valid, we generate a JWT token and return it together with the ID and role of the user.

However, we need to standardize the `UserLoginInput` and `UserLoginOutput` interfaces. We will create a new `auth.interface.ts` file in the `interfaces` folder:

```typescript title="auth.interface.ts"
export interface UserLoginInput {
    email: string;
    password: string;
}

export interface UserLoginOutput {
    id: string;
    roles: string[];
    token: string;
}
```

Now, let us implement the `generateToken` method:

```typescript title="Creating the service (2)"
public async generateToken(user: UserDocument): Promise<string> {
        const payload = {
            id: user.id,
            roles: user.roles
        };
        return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '10m' });
    }
```

In this method, we create a payload that includes the ID and the roles of the user. Then, we use `jsonwebtoken` to sign the token with a secret key and set an expiration of 10 minutes.

> **Note**: Make sure you define the `JWT_SECRET` environment variable in your `.env` file for better security. Also export the authentication service using the `index.ts` file in the `services` folder.

### Creating the authentication controller
Next, we will create a controller to handle the authentication requests. We will create a new `auth.controller.ts` file in the `controllers` folder:

```typescript title="auth.controller.ts"
class AuthController {
    public async login(req: Request, res: Response, next: Function) {
        try {
            const token = await authService.login(req.body as UserLoginInput);
            res.json({ token });
        } catch (error) {
            if (error instanceof AppError) {
                return next(error);
            } else if (error instanceof ReferenceError) {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
```

This base controller will be in charge of receiving the login requests, calling the authentication service and returning the JWT token in the response together with the user information.
Do not forget to export the authentication controller using the `index.ts` file in the `controllers` folder.

### Creating the authentication routes
Finally, we will create the routes to handle the authentication requests. We will create a new `auth.route.ts` file in the `routes` folder:

```typescript title="auth.route.ts"
import express from "express";
import { authController } from "../controllers";

export const router = express.Router();

router.post("/login", authController.login);
```

Lastly, make sure you import and use these routes in your main `index.ts` file:

```typescript title="index.ts"
import { router as authRoutes } from "./routes/auth.route";

app.use("/api/auth", authRoutes);
```

> **Note**: By this point you will surely run into an error with a 500 status code. It will be your job to find where the failure is, but I will give you a hint: the user model was initially configured to never return the password, so when trying to log in, the password cannot be compared.


### Route protection

To protect the routes that require authentication, we will create a middleware that verifies the JWT token in incoming requests. We will create a new `auth.middleware.ts` file in the `middlewares` folder:

```typescript title="auth.middleware.ts"
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // We assume it is a Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'defaultSecret';
        const decoded = jwt.verify(token, secretKey);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;
```

At this point, it is not really a complex middleware, much less an authorization one: it simply checks whether the token is present in the request header and validates it. If the token is valid, it lets the request continue; otherwise, it returns an authorization error.

### Applying the authentication middleware

To apply this middleware to the routes that require authentication, we simply import it and use it in the corresponding routes. For example, if we have a protected route to get the user information, we would define it like this:

```typescript title="Applying the middleware"
import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

export const router = express.Router();

router.get("/profile", authMiddleware, controller)
```

### Base example for the authorization process

To implement a more robust authorization process, we could create a middleware that checks whether the user has a specific role before allowing access to certain routes. For example, we could create a `roleMiddleware` middleware that checks whether the user has the "admin" role. This will be your job, although it can be quite simple by just checking the request information.


## TODO

- [ ] Implement the authorization middleware (simple)
- [ ] Fix any typing errors that may exist.
- [ ] Specify a more secure key
- [ ] Add the cors module.