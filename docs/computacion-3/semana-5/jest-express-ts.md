---
sidebar_position: 1
---

# Jest en Express con Typescript

Jest es un framework de pruebas para JavaScript que permite realizar pruebas unitarias, de integración y de E2E. En este caso, veremos cómo configurar Jest para trabajar con una aplicación Express escrita en TypeScript.

## 1. Instalación de dependencias

Para comenzar, necesitamos instalar las dependencias necesarias. Ejecuta el siguiente comando en tu terminal:

```bash
npm install --save-dev jest @types/jest
```

## 2. Creación del archivo de configuración Jest

Con ayuda del comando `npm init jest@latest` podemos crear un archivo de configuración `jest.config.ts`. Este archivo nos permitirá personalizar la configuración de Jest para que funcione correctamente con TypeScript y Express.

El archivo es un poco largo así como el Tsconfig, pero aquí tienes un ejemplo básico:

```typescript
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};

export default config;
```

Al configurar automáticamente Jest por medio del script, también nos agregará un nuevo script en el `package.json` para ejecutar las pruebas:

```json
"scripts": {
  "test": "jest"
}
```

Debido a que estamos trabajando con Typescript, es necesario instalar `ts-jest` para que Jest pueda entender el código TypeScript. Ejecuta el siguiente comando:

```bash
npm install --save-dev ts-jest`
```

Finalmente modificamos el archivo `jest.config.ts` para que use `ts-jest` como preprocesador:

```typescript
import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src/tests"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;
```

Aquí explicaré brevemente cada una de las configuraciones que encontraremos en nuestro archivo `jest.config.ts`:

- `clearMocks`: Limpia los mocks después de cada prueba.
- `collectCoverage`: Habilita la recolección de cobertura de código.
- `coverageDirectory`: Especifica el directorio donde se guardarán los informes de cobertura.
- `coverageProvider`: Define el proveedor de cobertura, en este caso `v8`.
- `preset`: Configura Jest para usar `ts-jest` como preprocesador de TypeScript.
- `testEnvironment`: Define el entorno de prueba, en este caso `node`.
- `roots`: Especifica la raíz de los archivos de prueba.
- `transform`: Configura Jest para transformar archivos TypeScript usando `ts-jest`.
- `testRegex`: Define la expresión regular para encontrar archivos de prueba.
- `moduleFileExtensions`: Especifica las extensiones de archivo que Jest reconocerá.


## 3. Estructura de carpetas

Para organizar nuestro proyecto, crearemos una estructura de carpetas que separe las pruebas del código fuente. Una estructura común es tener una carpeta `src` para el código fuente y una carpeta `tests` para las pruebas. Aquí agrego un ejemplo de como podría verse la estructura de carpetas:

<img src="/img/jest-1.png" alt="Estructura de carpetas" width="500" />

## 4. Creación de una primera prueba

Para realizar un ejemplo de sencillo de cómo podemos probar nuestro código, crearemos un archivo de prueba en una carpeta `utils` dentro de `src`. Agregaremos un nuevo archivo llamado `index.ts` y otro archivo llamado `operations.util.ts` con el siguiente código:

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```
Y en el archivo `index.ts` agregamos lo siguiente:

```typescript
export * from './operations.util';
```

Ahora, dentro de la carpeta `tests` creamos una carpeta `utils` y dentro de esta creamos un archivo llamado `operations.util.test.ts` con el siguiente contenido:

```typescript
import { add } from "../../utils";

it("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
});
```

Para ejecutar nuestras pruebas, simplemente ejecutamos el siguiente comando en la terminal:

```bash
npm test
```

Y deberías de ver algo como esto:

```bash
> compunet3-20252@1.0.0 test
> jest

 PASS  src/tests/utils/operation.util.test.ts
  √ should add two numbers (3 ms)

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |                   
 index.ts           |     100 |      100 |     100 |     100 |                   
 operations.util.ts |     100 |      100 |     100 |     100 |                   
--------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.277 s
Ran all test suites
```

> **Nota**: Has este punto, es posible que tu proyecto no compile o aparezcan advertencias en tu editor de código respecto a las funciones it y expect. Esto se debe a que Jest no está configurado para reconocer estos tipos de funciones globales. Para solucionarlo, puedes agregar en el archivo `tsconfig.json` la siguiente configuración:

```json
{
  "compilerOptions": {
    "types": ["jest"]
  }
}
```

## 5. Pruebas y cobertura

Hasta este punto, puedes estar algo confundido, y es que por qué Jest menciona que tengo una cobertura del 100% si solo tengo una prueba. Esto se debe a que Jest está midiendo la cobertura de código, es decir, está verificando qué partes del código han sido ejecutadas durante las pruebas.

No obstante, quizá deseas comprobar la cobertura de tu código de una manera más detallada y ver qué líneas de código están cubiertas por las pruebas. Para ello, puedes modificar el archivo `jest.config.ts` para incluir la opción `collectCoverageFrom` y especificar qué archivos deseas incluir en la recolección de cobertura. Aquí tienes un ejemplo de cómo podrías configurarlo:

```typescript
const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.ts", // Incluye todos los archivos TypeScript en src/
        "!src/**/*.d.ts", // Excluye archivos de declaración
        "!src/index.ts", // Excluye el archivo de entrada principal
        "!src/interfaces/**/*.ts", // Excluye interfaces
        "!src/config/**/*.ts", // Excluye archivos de configuración
        "!src/models/**/*.ts", // Excluye models
        "!src/routes/**/*.ts", // Excluye routes
        "!src/**/index.ts", // Excluye archivos index de exportación
        "!src/validators/**/*.ts", // Excluye schemas de validación
    ],
};
```
Ahora, nuevamente ejecuta tus pruebas con el comando `npm test`. Deberías ver un informe de cobertura más detallado, indicando qué líneas de código han sido cubiertas por las pruebas y cuáles no.

```bash
> compunet3-20252@1.0.0 test
> jest

 PASS  src/tests/utils/operation.util.test.ts                                                                                           
  √ should add two numbers (3 ms)
                                                                                                                                        
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                              
------------------------------|---------|----------|---------|---------|-------------------
All files                     |    0.62 |     8.33 |    8.33 |    0.62 |                  
 controllers                  |       0 |        0 |       0 |       0 |                  
  auth.controller.ts          |       0 |        0 |       0 |       0 | 1-24             
  games.controller.ts         |       0 |        0 |       0 |       0 | 1-92             
  user.controller.ts          |       0 |        0 |       0 |       0 | 1-72             
 middlewares                  |       0 |        0 |       0 |       0 |                  
  auth.middleware.ts          |       0 |        0 |       0 |       0 | 1-20             
  error.handler.ts            |       0 |        0 |       0 |       0 | 1-50             
  handle.validations.error.ts |       0 |        0 |       0 |       0 | 1-17             
  logger.middleware.ts        |       0 |        0 |       0 |       0 | 1-31             
  preAuthorize.middleware.ts  |       0 |        0 |       0 |       0 | 1-18             
 services                     |       0 |        0 |       0 |       0 |                  
  auth.service.ts             |       0 |        0 |       0 |       0 | 1-38             
  games.service.ts            |       0 |        0 |       0 |       0 | 1-56             
  user.service.ts             |       0 |        0 |       0 |       0 | 1-58             
 utils                        |     100 |      100 |     100 |     100 |                  
  operations.util.ts          |     100 |      100 |     100 |     100 |                  
------------------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.776 s, estimated 1 s
Ran all test suites.
```

Esto también nos creará un reporte en formato HTML, por lo que te recomiendo agregar el directorio en el archivo `.gitignore` para evitar subirlo al repositorio.

### 5.1 Pruebas a nivel de servicio

Para empezar a realizar pruebas de nuestro proyecto usando Jest, te recomiendo revisar su documentación donde podrás encontrar los elementos principales para crear tus pruebas:
[Documentación de Jest](https://jestjs.io)

No obstante, a continuación realizaré la implementación de las pruebas de servicio del proyecto realizado en este curso, por lo que podrías usarlo de referencia para realizar tus propias pruebas.

### 5.2 Pruebas de servicios de usuario

Para realizar pruebas de los servicios de usuario, crearemos un archivo llamado `user.service.test.ts` dentro de la carpeta `tests/services`. Aquí tienes un ejemplo de cómo podrías estructurar las pruebas para el servicio de usuario:

```typescript
import { userService } from "../../services";
import { UserModel, UserDocument, UserRole } from "../../models";
import bcrypt from "bcrypt";
import { UserInput } from "../../interfaces";

jest.mock("bcrypt", () => ({
    hash: jest.fn(),
}));

// Mock del modelo
jest.mock("../../models", () => ({
    UserRole: {
        ADMIN: "admin",
        USER: "user",
    },
    UserModel: {
        create: jest.fn()
    },
}));

describe("UserService", () => { // Describe permite agrupar las pruebas relacionadas con UserService
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    describe("create", () => {
        it("should create a new user", async () => {
            const mockUserInput: UserInput = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            };

            const mockHashedPassword = "hashedPassword123";
            const mockCreatedUser: Partial<UserDocument> = {
                ...mockUserInput,
                _id: "12345",
                createdAt: new Date(),
                updatedAt: new Date(),
                roles: [UserRole.USER],
            };

            // Mock de findByEmail para devolver null (usuario no existe)
            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);

            // Mock de bcrypt.hash
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

            // Mock de UserModel.create
            (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);
            const result = await userService.create(mockUserInput);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
            expect(UserModel.create).toHaveBeenCalledWith({
                ...mockUserInput,
                password: mockHashedPassword,
            });

            expect(result).toEqual(mockCreatedUser);
        });

        it("should throw an error if the user already exists", async () => {
            const mockUserInput: UserInput = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            };

            // Mockea `findByEmail` para devolver un usuario existente
            jest.spyOn(userService, "findByEmail").mockResolvedValue({
                ...mockUserInput,
                _id: "12345",
            } as UserDocument);

            await expect(userService.create(mockUserInput)).rejects.toThrow(
                "User already exists"
            );

            expect(userService.findByEmail).toHaveBeenCalledWith(mockUserInput.email);
            expect(UserModel.create).not.toHaveBeenCalled();
        });
    });
});
```

Desglosando el código:
- **Mocks**: Utilizamos `jest.mock` para simular el comportamiento de `bcrypt` y del modelo `UserModel`. Esto nos permite controlar el comportamiento de estas dependencias durante las pruebas.
- **beforeEach**: Limpiamos los mocks antes de cada prueba para asegurarnos de que no haya interferencias entre pruebas.
- **describe**: Agrupamos las pruebas relacionadas con el servicio de usuario. Dentro de este bloque, tenemos otro bloque `describe` para las pruebas del método `create`.
- **it**: Definimos las pruebas individuales. En la primera prueba, verificamos que el método `create` funcione correctamente al crear un nuevo usuario. En la segunda prueba, verificamos que se lance un error si el usuario ya existe.
- **expect**: Utilizamos `expect` para hacer afirmaciones sobre el comportamiento del código. Verificamos que las funciones mockeadas se hayan llamado con los argumentos correctos y que el resultado sea el esperado.

### 5.3 Pruebas de controlador de usuario

Para probar los controladores de usuario, crearemos un archivo llamado `user.controller.test.ts` dentro de la carpeta `tests/controllers`. Aquí tienes un ejemplo de cómo podrías estructurar las pruebas para el controlador de usuario:

```typescript
import { userController } from "../../controllers/user.controller";
import { userService } from "../../services/user.service";
import { Request, Response } from "express";
import { UserDocument } from "../../models";
import { UserInput, UserInputUpdate } from "../../interfaces";

jest.mock("../../services/user.service", () => ({
    userService: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("UserController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new user and return 201", async () => {
            const mockUserInput: UserInput = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            };

            const mockUser: UserDocument = {
                ...mockUserInput,
                _id: "12345",
                createdAt: new Date(),
                updatedAt: new Date(),
                roles: ["user"],
            } as UserDocument;

            req.body = mockUserInput;
            (userService.create as jest.Mock).mockResolvedValue(mockUser);

            await userController.create(req as Request, res as Response, next);

            expect(userService.create).toHaveBeenCalledWith(mockUserInput);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it("should call next with an error if user already exists", async () => {
            const mockUserInput: UserInput = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            };

            req.body = mockUserInput;
            const error = new ReferenceError("User already exists");
            (userService.create as jest.Mock).mockRejectedValue(error);

            await userController.create(req as Request, res as Response, next);

            expect(userService.create).toHaveBeenCalledWith(mockUserInput);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getAll", () => {
        it("should return all users", async () => {
            const mockUsers: UserDocument[] = [
                { _id: "1", name: "John Doe", email: "john@example.com", roles: ["user"] } as UserDocument,
                { _id: "2", name: "Jane Doe", email: "jane@example.com", roles: ["admin"] } as UserDocument,
            ];

            (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

            await userController.getAll(req as Request, res as Response);

            expect(userService.getAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe("getOne", () => {
        it("should return a user by id", async () => {
            const mockUser: UserDocument = {
                _id: "12345",
                name: "John Doe",
                email: "john@example.com",
                roles: ["user"],
            } as UserDocument;

            req.params = { id: "12345" };
            (userService.getById as jest.Mock).mockResolvedValue(mockUser);

            await userController.getOne(req as Request, res as Response);

            expect(userService.getById).toHaveBeenCalledWith("12345");
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it("should return 404 if user is not found", async () => {
            req.params = { id: "12345" };
            (userService.getById as jest.Mock).mockResolvedValue(null);

            await userController.getOne(req as Request, res as Response);

            expect(userService.getById).toHaveBeenCalledWith("12345");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User with id 12345 not found" });
        });
    });

    describe("update", () => {
        it("should update a user and return the updated user", async () => {
            const mockUserUpdate: UserInputUpdate = { name: "Updated Name", email: "email.updated@gmail.com" };
            const mockUpdatedUser: UserDocument = {
                _id: "12345",
                name: "Updated Name",
                email: "john@example.com",
                roles: ["user"],
            } as UserDocument;

            req.params = { id: "12345" };
            req.body = mockUserUpdate;
            (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

            await userController.update(req as Request, res as Response);

            expect(userService.update).toHaveBeenCalledWith("12345", mockUserUpdate);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
        });

        it("should return 404 if user is not found", async () => {
            req.params = { id: "12345" };
            req.body = { name: "Updated Name" };
            (userService.update as jest.Mock).mockResolvedValue(null);

            await userController.update(req as Request, res as Response);

            expect(userService.update).toHaveBeenCalledWith("12345", { name: "Updated Name" });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User with id 12345 not found" });
        });
    });

    describe("delete", () => {
        it("should delete a user and return 204", async () => {
            req.params = { id: "12345" };
            (userService.delete as jest.Mock).mockResolvedValue(true);

            await userController.delete(req as Request, res as Response);

            expect(userService.delete).toHaveBeenCalledWith("12345");
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("should return 404 if user is not found", async () => {
            req.params = { id: "12345" };
            (userService.delete as jest.Mock).mockResolvedValue(false);

            await userController.delete(req as Request, res as Response);

            expect(userService.delete).toHaveBeenCalledWith("12345");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User with id 12345 not found" });
        });
    });
});
```

Desglosando el código:
- En este caso, mockeamos el servicio de usuario (`userService`) para simular su comportamiento durante las pruebas.
- **beforeEach**: Limpiamos los mocks antes de cada prueba para asegurarnos de que no haya interferencias entre pruebas.
- Podemos observar que cada prueba también puede verificar el código de estado HTTP que se devuelve y los datos que se envían en la respuesta.