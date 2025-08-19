---
sidebar_position: 2
---

# Express | Typescript | Mongodb | Docker. Parte 3

Siguiendo los aspectos a mejorar mencionados anteriormente, en esta sección vamos a implementar las siguientes mejoras:

- **Autenticación y autorización**: Implementaremos un sistema de autenticación y autorización utilizando JWT (JSON Web Tokens) para proteger las rutas de la API.
- **Protección de rutas**: Añadiremos middleware para proteger las rutas que requieren autenticación.

## Autenticación y autorización

Antes de implementar la autenticación y autorización, nos aseguraremos de que los usuarios tengan un campo `role` en su modelo de usuario. Este campo nos permitirá definir roles como "admin" o "user". Lo mantendremos simple, aunque una implementación más robusta podría incluir un sistema de roles con permisos más detallados.

Primero, modificaremos el archivo `user.model.ts` para incluir el campo `role`:

```typescript
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

### Instalación de dependencias
Para implementar la autenticación con JWT, necesitaremos instalar algunas dependencias adicionales:

```bash
npm install @types/jsonwebtoken --save-dev
npm install jsonwebtoken
```

### Creación del servicio de autenticación
Ahora crearemos un servicio de autenticación que maneje el registro, inicio de sesión y generación de tokens JWT. Crearemos un nuevo archivo `auth.service.ts` en la carpeta `services`:

```typescript
class AuthService {
    public async login(userLogin: UserLoginInput): Promise<UserLoginOutput> {
        // Buscar el usuario por correo
        // Verificar la contraseña
        // Generar y devolver el token JWT
        // Retornar una respuesta
    }

    public async generateToken(user: UserDocument): Promise<string> {
    }

}
```

Dentro de este servicio, implementaremos los métodos `login` y `generateToken`. El método `login` verificará las credenciales del usuario y generará un token JWT si son válidas. El método `generateToken` generará un token JWT utilizando la biblioteca `jsonwebtoken`.

Empecemos con el login:

```typescript
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

Como puedes ver, primero buscamos al usuario por su correo electrónico. Si no existe, lanzamos un error de autorización. Luego, comparamos la contraseña proporcionada con la almacenada en la base de datos utilizando `bcrypt`. Si las credenciales son válidas, generamos un token JWT y lo devolvemos junto con el ID y el rol del usuario.

No obstante, necesitamos estandarizar las interfaces `UserLoginInput` y `UserLoginOutput`. Crearemos un nuevo archivo `auth.interface.ts` en la carpeta `interfaces`:

```typescript
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

Ahora, implementemos el método `generateToken`:

```typescript
public async generateToken(user: UserDocument): Promise<string> {
        const payload = {
            id: user.id,
            roles: user.roles
        };
        return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '10m' });
    }
```

En este método, creamos un payload que incluye el ID y los roles del usuario. Luego, utilizamos `jsonwebtoken` para firmar el token con una clave secreta y establecer una expiración de 10 minutos.

> **Nota**: Asegúrate de definir la variable de entorno `JWT_SECRET` en tu archivo `.env` para mayor seguridad. Además de exportar el servicio de autenticación usando el archivo `index.ts` en la carpeta `services`.

### Creación del controlador de autenticación
A continuación, crearemos un controlador para manejar las solicitudes de autenticación. Crearemos un nuevo archivo `auth.controller.ts` en la carpeta `controllers`:

```typescript
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

Este controlador base se encargará de recibir las solicitudes de inicio de sesión, llamar al servicio de autenticación y devolver el token JWT en la respuesta con la información del usuario.
No olvides exportar el controlador de autenticación usando el archivo `index.ts` en la carpeta `controllers`.

### Creación de rutas de autenticación
Finalmente, crearemos las rutas para manejar las solicitudes de autenticación. Crearemos un nuevo archivo `auth.route.ts` en la carpeta `routes`:

```typescript
import express from "express";
import { authController } from "../controllers";

export const router = express.Router();

router.post("/login", authController.login);
```

Por último, asegúrate de importar y usar estas rutas en tu archivo principal `index.ts`:

```typescript
import { router as authRoutes } from "./routes/auth.route";

app.use("/api/auth", authRoutes);
```

> **Nota**: Hasta este punto, seguro que te encuentras con un error con código 500, será tu trabajo encontrar dónde esta el fallo, pero te daré una pista, inicialmente se configuró el modelo de usuario para nunca retornar la contraseña, por lo que al intentar hacer login, no se puede comparar la contraseña.


### Protección de rutas

Para proteger las rutas que requieren autenticación, crearemos un middleware que verifique el token JWT en las solicitudes entrantes. Crearemos un nuevo archivo `auth.middleware.ts` en la carpeta `middlewares`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Suponemos que es de tipo Bearer

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

Ya a este punto, no es realmente un middleware complejo, ni mucho menos de de autorización, simplemente verifica si el token está presente en la cabecera de la solicitud y lo valida. Si el token es válido, permite que la solicitud continúe; de lo contrario, devuelve un error de autorización.

### Aplicación del middleware de autenticación

Para aplicar este middleware a las rutas que requieren autenticación, simplemente lo importamos y lo usamos en las rutas correspondientes. Por ejemplo, si tenemos una ruta protegida para obtener información del usuario, la definiríamos así:

```typescript
import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

export const router = express.Router();

router.get("/profile", authMiddleware, controller)
```

### Ejemplo base para proceso de autorización

Para implementar un proceso de autorización más robusto, podríamos crear un middleware que verifique si el usuario tiene un rol específico antes de permitir el acceso a ciertas rutas. Por ejemplo, podríamos crear un middleware `roleMiddleware` que verifique si el usuario tiene el rol de "admin". Esto será tu trabajo, aunque puede ser bastante simple solamente verificando la información de la solicitud.


## TODO

- [ ] Implementar el middleware de autorización (Sencillo)
- [ ] Solucionar los errores de tipado que puedan existir.
- [ ] Especificar una clave más segura
- [ ] Agregar el módulo de cors.