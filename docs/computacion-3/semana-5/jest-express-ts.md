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

### 2.1 Configuración interactiva de Jest

Cuando ejecutes el comando `npm init jest@latest`, aparecerán varias preguntas de configuración. A continuación te muestro las preguntas típicas y las respuestas recomendadas para un proyecto Express con TypeScript:

```bash
> npm init jest@latest

The following questions will help Jest to create a suitable configuration for your project

√ Would you like to use Jest when running "test" script in "package.json"? ... yes
√ Would you like to use Typescript for the configuration file? ... yes
√ Choose the test environment that will be used for testing » node
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » v8
√ Automatically clear mock calls, instances, contexts and results before every test? ... yes
```

**Explicación de cada configuración:**

- **Use Jest when running "test" script**: Al seleccionar `yes`, Jest agregará automáticamente el script `"test": "jest"` en tu `package.json`, permitiendo ejecutar las pruebas con `npm test`.

- **Use Typescript for the configuration file**: Seleccionar `yes` creará un archivo `jest.config.ts` en lugar de `jest.config.js`, lo que permite utilizar TypeScript para la configuración y obtener mejor autocompletado y verificación de tipos.

- **Choose the test environment**: La opción `node` es ideal para aplicaciones backend como Express, ya que simula un entorno Node.js. La alternativa `jsdom` se usa típicamente para aplicaciones frontend que requieren un entorno de navegador simulado.

- **Add coverage reports**: Al elegir `yes`, Jest generará automáticamente reportes de cobertura de código que muestran qué porcentaje de tu código está siendo probado por las pruebas.

- **Coverage provider**: `v8` es el proveedor de cobertura más moderno y eficiente, utilizando el motor V8 de Node.js para medir la cobertura. La alternativa `babel` es más antigua pero compatible con configuraciones más complejas.

- **Automatically clear mock calls**: Seleccionar `yes` garantiza que los mocks se limpien automáticamente entre pruebas, evitando interferencias y resultados impredecibles.

### 2.2 Archivo de configuración generado

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
npm install --save-dev ts-jest
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

Para realizar pruebas de los servicios de usuario, vamos a crear paso a paso un archivo de pruebas completo.

#### 5.2.1 Creación del archivo de pruebas

Primero, crea un archivo llamado `user.service.test.ts` dentro de la carpeta `tests/services`.

#### 5.2.2 Configuración de imports y mocks

Comenzamos importando las dependencias necesarias y configurando los mocks:

```typescript
import { userService } from "../../services";
import { UserModel, UserDocument, UserRole } from "../../models";
import bcrypt from "bcrypt";
import { UserInput } from "../../interfaces";
```

**¿Qué son los mocks?** Los mocks son simulaciones de funciones o módulos que nos permiten controlar su comportamiento durante las pruebas, sin ejecutar el código real.

#### 5.2.3 Configuración de mocks para dependencias externas

```typescript
// Mock de bcrypt para simular el hash de contraseñas
jest.mock("bcrypt", () => ({
    hash: jest.fn(),
}));

// Mock del modelo de usuario para simular operaciones de base de datos
jest.mock("../../models", () => ({
    UserRole: {
        ADMIN: "admin",
        USER: "user",
    },
    UserModel: {
        create: jest.fn()
    },
}));
```

**¿Por qué hacer mocks?** 
- `bcrypt`: Evitamos ejecutar el hash real que es lento
- `UserModel`: Evitamos conectar a la base de datos real durante las pruebas

#### 5.2.4 Estructura básica del suite de pruebas

```typescript
describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    // Aquí irán nuestras pruebas específicas
});
```

**Explicación:**
- `describe`: Agrupa pruebas relacionadas con el UserService
- `beforeEach`: Se ejecuta antes de cada prueba individual para limpiar el estado

#### 5.2.5 Primera prueba: Crear usuario exitosamente

Ahora agregamos nuestra primera prueba dentro del bloque `describe`:

```typescript
describe("create", () => {
    it("should create a new user", async () => {
        // 1. Preparar datos de prueba
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

        // 2. Configurar mocks
        jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
        (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

        // 3. Ejecutar la función a probar
        const result = await userService.create(mockUserInput);

        // 4. Verificar resultados
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(UserModel.create).toHaveBeenCalledWith({
            ...mockUserInput,
            password: mockHashedPassword,
        });
        expect(result).toEqual(mockCreatedUser);
    });
});
```

**Pasos de la prueba:**
1. **Preparar**: Definimos los datos que usaremos
2. **Configurar**: Establecemos cómo se comportarán los mocks
3. **Ejecutar**: Llamamos al método que queremos probar
4. **Verificar**: Comprobamos que todo funcionó como esperábamos

### ¿Qué es `jest.spyOn()`?

En la prueba anterior usamos `jest.spyOn(userService, "findByEmail")`. Es importante entender qué hace esta función y cuándo usarla.

#### Definición y propósito

`jest.spyOn()` es una función que permite "espiar" (spy) y controlar el comportamiento de métodos existentes en objetos reales. A diferencia de `jest.mock()` que reemplaza completamente un módulo, `spyOn` permite interceptar llamadas a métodos específicos sin afectar el resto del objeto.

#### Sintaxis básica

```typescript
jest.spyOn(objeto, 'nombreDelMétodo').mockImplementation(() => {
    // Nueva implementación
});

// O más común:
jest.spyOn(objeto, 'nombreDelMétodo').mockResolvedValue(valorRetorno);
```

#### ¿Cuándo usar `spyOn` vs `mock`?

**Usa `jest.spyOn()` cuando:**
- Quieres interceptar métodos específicos de un objeto existente
- El objeto ya está importado y disponible en tu prueba
- Quieres mantener el comportamiento original de algunos métodos del objeto
- Necesitas verificar si un método fue llamado y con qué argumentos

**Usa `jest.mock()` cuando:**
- Quieres reemplazar un módulo completo
- Quieres evitar importar dependencias externas (como base de datos, APIs)
- Necesitas control total sobre el comportamiento de todas las funciones de un módulo

#### Ejemplo comparativo

```typescript
// ❌ Usando jest.mock() - Reemplaza TODO el módulo
jest.mock("../../services", () => ({
    userService: {
        findByEmail: jest.fn(),
        create: jest.fn(),
        // Tengo que mockear TODOS los métodos
    }
}));

// ✅ Usando jest.spyOn() - Solo intercepta métodos específicos
import { userService } from "../../services"; // Importo el objeto real

// En la prueba:
jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
// Solo mockeo el método que necesito, el resto funciona normalmente
```

#### Métodos útiles de spyOn

```typescript
const spy = jest.spyOn(userService, "findByEmail");

// Controlar el valor de retorno
spy.mockResolvedValue(mockUser);           // Para promesas exitosas
spy.mockRejectedValue(new Error("Error")); // Para promesas que fallan
spy.mockReturnValue(mockUser);             // Para valores síncronos

// Verificar llamadas
expect(spy).toHaveBeenCalled();                    // ¿Fue llamado?
expect(spy).toHaveBeenCalledWith("test@email.com"); // ¿Con qué argumentos?
expect(spy).toHaveBeenCalledTimes(2);              // ¿Cuántas veces?

// Restaurar comportamiento original
spy.mockRestore();
```

#### Ventajas de spyOn

1. **Granularidad**: Puedes mockear solo los métodos que necesitas
2. **Flexibilidad**: Puedes cambiar el comportamiento durante la prueba
3. **Verificación**: Puedes verificar exactamente cómo fue llamado el método
4. **Mantenimiento**: Es más fácil mantener cuando el objeto original cambia

#### Ejemplo práctico en nuestro contexto

```typescript
// En nuestra prueba de usuario
it("should create a new user", async () => {
    // Espiamos el método findByEmail del userService real
    const findByEmailSpy = jest.spyOn(userService, "findByEmail");
    
    // Configuramos qué debe devolver cuando sea llamado
    findByEmailSpy.mockResolvedValue(null); // Usuario no existe
    
    // Ejecutamos la función
    await userService.create(mockUserInput);
    
    // Verificamos que fue llamado correctamente
    expect(findByEmailSpy).toHaveBeenCalledWith("john.doe@example.com");
    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    
    // Opcionalmente, restauramos el comportamiento original
    findByEmailSpy.mockRestore();
});
```

#### 5.2.6 Segunda prueba: Error cuando el usuario ya existe

Agregamos una segunda prueba dentro del mismo bloque `describe("create")`:

```typescript
it("should throw an error if the user already exists", async () => {
    // 1. Preparar datos de prueba
    const mockUserInput: UserInput = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
    };

    // 2. Configurar mock para simular usuario existente
    jest.spyOn(userService, "findByEmail").mockResolvedValue({
        ...mockUserInput,
        _id: "12345",
    } as UserDocument);

    // 3. Ejecutar y verificar que lance error
    await expect(userService.create(mockUserInput)).rejects.toThrow(
        "User already exists"
    );

    // 4. Verificar que no se intentó crear el usuario
    expect(userService.findByEmail).toHaveBeenCalledWith(mockUserInput.email);
    expect(UserModel.create).not.toHaveBeenCalled();
});
```

**Conceptos clave:**
- `rejects.toThrow()`: Verifica que una función asíncrona lance un error
- `not.toHaveBeenCalled()`: Verifica que una función NO haya sido llamada

#### 5.2.7 Archivo completo

El archivo completo `user.service.test.ts` se vería así:

```typescript
import { userService } from "../../services";
import { UserModel, UserDocument, UserRole } from "../../models";
import bcrypt from "bcrypt";
import { UserInput } from "../../interfaces";

jest.mock("bcrypt", () => ({
    hash: jest.fn(),
}));

jest.mock("../../models", () => ({
    UserRole: {
        ADMIN: "admin",
        USER: "user",
    },
    UserModel: {
        create: jest.fn()
    },
}));

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
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

            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
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

### 5.3 Pruebas de controlador de usuario

Las pruebas de controlador son diferentes a las de servicio porque aquí probamos las respuestas HTTP y el manejo de requests/responses. Vamos paso a paso.

#### 5.3.1 Creación del archivo de pruebas

Crea un archivo llamado `user.controller.test.ts` dentro de la carpeta `tests/controllers`.

#### 5.3.2 Configuración de imports y mocks

```typescript
import { userController } from "../../controllers/user.controller";
import { userService } from "../../services/user.service";
import { Request, Response } from "express";
import { UserDocument } from "../../models";
import { UserInput, UserInputUpdate } from "../../interfaces";
```

**Diferencia clave:** Aquí importamos tipos de Express (`Request`, `Response`) para simular peticiones HTTP.

#### 5.3.3 Mock del servicio de usuario

```typescript
jest.mock("../../services/user.service", () => ({
    userService: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
```

**¿Por qué mockear el servicio?** No queremos probar la lógica del servicio aquí, solo verificar que el controlador llame correctamente al servicio y maneje las respuestas.

#### 5.3.4 Configuración de objetos Request y Response simulados

```typescript
describe("UserController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(), // mockReturnThis permite encadenar métodos
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
});
```

**Explicación:**
- `req`: Objeto simulado de petición HTTP
- `res`: Objeto simulado de respuesta HTTP con métodos como `status()`, `json()`
- `next`: Función middleware para manejo de errores
- `mockReturnThis()`: Permite encadenar métodos como `res.status(201).json(data)`

#### 5.3.5 Primera prueba: Crear usuario exitoso

```typescript
describe("create", () => {
    it("should create a new user and return 201", async () => {
        // 1. Preparar datos de entrada
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

        // 2. Configurar request mock
        req.body = mockUserInput;
        
        // 3. Configurar respuesta del servicio
        (userService.create as jest.Mock).mockResolvedValue(mockUser);

        // 4. Ejecutar controlador
        await userController.create(req as Request, res as Response, next);

        // 5. Verificar llamadas y respuestas
        expect(userService.create).toHaveBeenCalledWith(mockUserInput);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });
});
```

**Puntos importantes:**
- Simulamos `req.body` con los datos de entrada
- Verificamos que se devuelva el código de estado HTTP correcto (201)
- Verificamos que se envíe la respuesta JSON correcta

#### 5.3.6 Segunda prueba: Manejo de errores

```typescript
it("should call next with an error if user already exists", async () => {
    // 1. Preparar datos
    const mockUserInput: UserInput = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
    };

    req.body = mockUserInput;
    
    // 2. Configurar error del servicio
    const error = new ReferenceError("User already exists");
    (userService.create as jest.Mock).mockRejectedValue(error);

    // 3. Ejecutar controlador
    await userController.create(req as Request, res as Response, next);

    // 4. Verificar manejo de errores
    expect(userService.create).toHaveBeenCalledWith(mockUserInput);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
});
```

**Concepto clave:** `next()` se usa en Express para pasar errores al middleware de manejo de errores.

#### 5.3.7 Prueba de obtener todos los usuarios

```typescript
describe("getAll", () => {
    it("should return all users", async () => {
        // 1. Preparar datos simulados
        const mockUsers: UserDocument[] = [
            { _id: "1", name: "John Doe", email: "john@example.com", roles: ["user"] } as UserDocument,
            { _id: "2", name: "Jane Doe", email: "jane@example.com", roles: ["admin"] } as UserDocument,
        ];

        // 2. Configurar respuesta del servicio
        (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

        // 3. Ejecutar controlador
        await userController.getAll(req as Request, res as Response);

        // 4. Verificar resultados
        expect(userService.getAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
});
```

#### 5.3.8 Prueba de obtener usuario por ID

```typescript
describe("getOne", () => {
    it("should return a user by id", async () => {
        const mockUser: UserDocument = {
            _id: "12345",
            name: "John Doe",
            email: "john@example.com",
            roles: ["user"],
        } as UserDocument;

        // Simular parámetros de URL
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
```

**Conceptos importantes:**
- `req.params`: Simula parámetros de URL como `/users/:id`
- Probamos tanto el caso exitoso como el caso de error (404)

#### 5.3.9 Pruebas de actualización y eliminación

```typescript
describe("update", () => {
    it("should update a user and return the updated user", async () => {
        const mockUserUpdate: UserInputUpdate = { 
            name: "Updated Name", 
            email: "email.updated@gmail.com" 
        };
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
});
```

#### 5.3.10 Archivo completo del controlador

Aquí tienes el archivo completo `user.controller.test.ts` con todas las pruebas organizadas:

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
            const mockUserUpdate: UserInputUpdate = { 
                name: "Updated Name", 
                email: "email.updated@gmail.com" 
            };
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

**Diferencias clave entre pruebas de servicio y controlador:**
- **Servicio**: Prueba lógica de negocio, interacciones con base de datos
- **Controlador**: Prueba manejo HTTP, códigos de estado, formato de respuestas

**Resumen del archivo completo:**
- **Imports y mocks**: Configuración inicial de dependencias
- **Setup de pruebas**: Configuración de objetos Request/Response simulados
- **Pruebas CRUD completas**: Create, Read, Update, Delete con casos de éxito y error
- **Verificaciones HTTP**: Códigos de estado, respuestas JSON, manejo de errores
- **Cobertura total**: Todos los métodos del controlador están probados

## 6. Resultados de cobertura después de implementar las pruebas

Después de implementar las pruebas de servicios y controladores, veamos cómo ha mejorado la cobertura de código de nuestro proyecto:

```bash
npm test
```

**Reporte de cobertura obtenido:**

```bash
------------------------------|---------|----------|---------|---------|------------------------------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|------------------------------------------
All files                     |   36.79 |       56 |   29.03 |   36.79 |
 controllers                  |   32.97 |    47.36 |   71.42 |   32.97 |
  auth.controller.ts          |       0 |        0 |       0 |       0 | 1-24
  games.controller.ts         |       0 |        0 |       0 |       0 | 1-92
  user.controller.ts          |   86.11 |    52.94 |     100 |   86.11 | 16-17,26-27,40-41,54-55,67-68
 middlewares                  |   30.14 |    66.66 |      25 |   30.14 |
  auth.middleware.ts          |      25 |      100 |       0 |      25 | 6-20
  error.handler.ts            |      54 |      100 |      50 |      54 | 25-45,49-50
  handle.validations.error.ts |   23.52 |      100 |       0 |   23.52 | 5-17
  logger.middleware.ts        |   16.12 |      100 |       0 |   16.12 | 6-31
  preAuthorize.middleware.ts  |       0 |        0 |       0 |       0 | 1-18
 services                     |    46.1 |      100 |    6.66 |    46.1 |
  auth.service.ts             |   39.47 |      100 |       0 |   39.47 | 10-26,29-34
  games.service.ts            |    37.5 |      100 |       0 |    37.5 | 7-14,17-28,31-32,35-36,39-45,48-49,52-53
  user.service.ts             |   58.33 |      100 |   16.66 |   58.33 | 24-25,28-39,42-43,46-47,50-56
 utils                        |     100 |      100 |     100 |     100 |
  operations.util.ts          |     100 |      100 |     100 |     100 |
------------------------------|---------|----------|---------|---------|------------------------------------------
```

### 6.1 Análisis de los resultados

#### ✅ **Logros destacados:**

1. **user.controller.ts**: **86.11% de cobertura** - Excelente resultado gracias a nuestras pruebas de controlador
2. **user.service.ts**: **58.33% de cobertura** - Mejora notable con las pruebas de servicio (incremento de ~1.44%)
3. **operations.util.ts**: **100% de cobertura** - Cobertura completa en nuestras utilidades
4. **Cobertura general**: **36.79%** - Incremento ligero pero positivo en la cobertura total

#### 📊 **Métricas importantes:**

- **% Stmts** (Statements): Porcentaje de declaraciones ejecutadas
- **% Branch** (Branches): Porcentaje de ramas condicionales probadas  
- **% Funcs** (Functions): Porcentaje de funciones llamadas
- **% Lines**: Porcentaje de líneas de código ejecutadas
- **Uncovered Line #s**: Números de líneas no cubiertas por las pruebas

#### 🎯 **Áreas de mejora identificadas:**

1. **auth.controller.ts y games.controller.ts**: **0% de cobertura** - Requieren implementar pruebas urgentemente
2. **Middlewares**: **30.14% promedio** - Necesitan pruebas específicas para middleware
3. **auth.service.ts y games.service.ts**: **Cobertura parcial** - Pueden beneficiarse de más pruebas
4. **user.service.ts**: Aún tiene líneas sin cubrir (24-25, 28-39, 42-43, 46-47, 50-56)

### 6.2 Próximos pasos recomendados

Para mejorar la cobertura general del proyecto, te recomendamos:

1. **Implementar pruebas para auth.controller.ts y games.controller.ts** siguiendo el mismo patrón que usamos para user.controller.ts
2. **Crear pruebas para middlewares** utilizando técnicas similares pero adaptadas para middleware de Express
3. **Completar pruebas de servicios** para auth.service.ts y games.service.ts
4. **Mejorar cobertura de user.service.ts** agregando pruebas para las líneas no cubiertas
5. **Establecer un umbral mínimo de cobertura** (por ejemplo, 80%) en la configuración de Jest

### 6.3 Configuración de umbral de cobertura

Puedes agregar umbrales mínimos de cobertura en tu `jest.config.ts`:

```typescript
const config: Config = {
    // ... otras configuraciones
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        // Umbrales específicos por archivo
        "./src/controllers/user.controller.ts": {
            branches: 90,
            functions: 100,
            lines: 90,
            statements: 90
        }
    }
};
```

Esto hará que las pruebas fallen si la cobertura cae por debajo del umbral establecido en cualquier métrica.

### 6.4 Comparación de resultados

**Antes de las pruebas (solo operations.util.ts):**
- Cobertura total: ~0.62%
- Solo 1 archivo con pruebas

**Después de implementar pruebas de servicio y controlador:**
- Cobertura total: **36.79%** (incremento de ~36.17%)
- user.controller.ts: **86.11%** de cobertura
- user.service.ts: **58.33%** de cobertura
- Cobertura de funciones en controladores: **71.42%**

**¡Felicitaciones!** Has implementado exitosamente las pruebas básicas para tu aplicación Express con TypeScript usando Jest. El **86.11%** de cobertura en el controlador de usuario y el **58.33%** en el servicio demuestran la efectividad de las pruebas implementadas.

TODO:

- Aumentar la cobertura del controlador y servicio de usuario que cubra todos los métodos
- Implementar pruebas para el controlador y servicio de games