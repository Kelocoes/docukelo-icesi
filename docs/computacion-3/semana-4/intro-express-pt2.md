---
sidebar_position: 1
---

# Express | Typescript | Mongodb | Docker. Parte 2

En esta segunda parte de la introducción a Express, Typescript, Mongodb y Docker, vamos a continuar con la creación de una API RESTful utilizando estas tecnologías. En la primera parte, configuramos el entorno y creamos un servidor básico. Ahora, vamos a añadir más funcionalidades y mejorar nuestra aplicación.

## Aspectos a mejorar

Hasta el momento nuestro sistema debe tener un CRUD básico de una a dos entidades, pero hacen falta algunos retoques para que sea más robusto y funcional. Aquí hay algunas sugerencias:
- **Validación de datos**: Asegúrate de validar los datos entrantes en tus rutas. Puedes usar bibliotecas como `Joi` o `express-validator` para esto.
- **Manejo de errores**: Implementa un middleware de manejo de errores para capturar y responder adecuadamente a los errores que puedan ocurrir en tu aplicación.
- **Middlewares de autenticación**: Si tu API requiere autenticación, implementa middlewares para verificar tokens JWT o sesiones de usuario.
- **Middlewares de login**: Implementa un middleware que registre las solicitudes entrantes, incluyendo la hora, la ruta y el método HTTP. Esto te ayudará a depurar y monitorear tu aplicación.
- **Documentación de la API**: Considera usar herramientas como Swagger para documentar tu API. Esto facilitará a otros desarrolladores entender cómo interactuar con tu servicio.

## Validación de datos

Como habrás podido observar hasta el momento, frameworks como express se construyen sobre pequeños módulos que se pueden añadir a tu aplicación. Uno de estos módulos es `express-validator`, que permite validar los datos entrantes en tus rutas de manera sencilla.

Para instalar `express-validator`, ejecuta el siguiente comando:

```bash
npm install express-validator
npm install @types/express-validator --save-dev
```

A partir de esto, crearemos un middleware que valide los datos de entrada en nuestras rutas. Este middleware se encontrará antes de llegar a los controladores y se encargará de verificar que los datos cumplan con las reglas definidas.

> Recuerda crear un archivo index.ts en la carpeta `middlewares` y exportar el middleware de validación desde allí.

```typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req); // Obtenemos los errores de validación
    if (!errors.isEmpty()) {
        // Si hay errores de validación, respondemos con un error 400
    }
    next();
};
```

Como puedes observar, los middlewares son funciones que reciben tres parámetros: `req`, `res` y `next`. En este caso, estamos utilizando `validationResult` de `express-validator` para obtener los errores de validación. Si hay errores, respondemos con un error 400 y no llamamos a `next()`, lo que detiene la ejecución del middleware. Si ejecutaramos `next()` sin errores, la ejecución continuaría hacia el siguiente middleware o controlador y es que sí, uno puede encadenar middlewares para que se ejecuten en orden.
```typescript
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

Un código base que para el middleware podría verse así, donde si hay algún tipo de error que haya sido encontrado (representado por un array de errores) se responde con un error 400 y un mensaje que indica que hubo errores de validación. Además, se incluye un array de errores con información sobre cada uno de ellos, como el campo afectado, el mensaje de error y el valor que causó el error.

Ahora crearemos con ayuda de `express-validator` los esquemas de validación para las rutas que hemos creado. Por ejemplo, si tenemos una ruta para crear un usuario, podemos definir un esquema de validación como este:

> Crea una carpeta llamada `validators` y dentro de ella crea un archivo `userValidator.ts` donde definiremos las validaciones para el usuario. Recuerda crear el archivo `index.ts` en la carpeta `validators` para exportar los validadores.

```typescript
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middlewares';

export const userValidations = {
};
```

Dentro de este objeto tu puedes definir las validaciones que necesites. Por ejemplo, si quieres validar que el nombre de usuario sea una cadena de texto y tenga una longitud mínima, puedes hacer lo siguiente:

```typescript
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

En este ejemplo, estamos validando que el campo `name` sea una cadena de texto con una longitud mínima de 1 y máxima de 100 caracteres, que el campo `email` sea un correo electrónico válido y que el campo `password` tenga al menos 8 caracteres. Si alguna de estas validaciones falla, se enviará un error 400 con un mensaje descriptivo.
Para usar estas validaciones en tus rutas, simplemente importa el validador y agrégalo a la ruta correspondiente. Por ejemplo:

```typescript
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

Ahora es tu turno de implementar las validaciones para las demás rutas que hayas creado. Recuerda que puedes definir diferentes validaciones para cada ruta según sea necesario.

Te adjunto alguna lista de métodos que existen en `express-validator` para que puedas utilizarlos en tus validaciones:

| Método | Descripción |
|--------|-------------|
| `body(field)` | Valida el cuerpo de la solicitud para el campo especificado. |
| `query(field)` | Valida los parámetros de consulta para el campo especificado. |
| `param(field)` | Valida los parámetros de ruta para el campo especificado. |
| `header(field)` | Valida los encabezados de la solicitud para el campo especificado. |
| `cookie(field)` | Valida las cookies de la solicitud para el campo especificado. |
| `check(field)` | Valida cualquier campo de la solicitud (cuerpo, consulta, ruta, encabezado o cookie). |
| `exists()` | Verifica si el campo existe en la solicitud. |
| `isEmail()` | Verifica si el campo es un correo electrónico válido. |
| `isLength({ min, max })` | Verifica si la longitud del campo está dentro del rango especificado. |
| `isInt({ min, max })` | Verifica si el campo es un número entero dentro del rango especificado. |
| `isFloat({ min, max })` | Verifica si el campo es un número de punto flotante dentro del rango especificado. |
| `isBoolean()` | Verifica si el campo es un valor booleano. |
| `isIn(values)` | Verifica si el campo está dentro de un conjunto de valores permitidos. |
| `matches(regex)` | Verifica si el campo coincide con una expresión regular. |
| `trim()` | Elimina los espacios en blanco al inicio y al final del campo. |
| `escape()` | Escapa caracteres especiales en el campo para prevenir inyecciones de código. |
| `toLowerCase()` | Convierte el campo a minúsculas. |
| `toUpperCase()` | Convierte el campo a mayúsculas. |
| `custom(callback)` | Permite definir una validación personalizada mediante una función de callback. |

## Middlewares

Los middlewares son funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP en Express. Se pueden utilizar para realizar tareas como la validación de datos, el manejo de errores, la autenticación, entre otras.

De momento ya hemos creado un middleware de validación de datos, pero también podemos crear un middleware de loggeo que registre las solicitudes entrantes. Este middleware puede ser útil para depurar y monitorear la actividad de tu aplicación.

Para crear un middleware de loggeo, puedes seguir estos pasos:
1. Crea un archivo `logger.ts` en la carpeta `middlewares`.
2. Define una función middleware que registre la hora, la ruta y el método HTTP de cada solicitud entrante.

```typescript	
export const logger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString(); // Formato de fecha ISO 8601 ej: 2023-10-01T12:34:56.789Z
    const startTime = Date.now(); // Marca de tiempo de inicio de la solicitud

    const originalSend = res.send; // Guardamos la función original de envío de respuesta
    res.send = function (body) { // Sobrescribimos la función de envío de respuesta
        // Operación que se ejecuta al finalizar la solicitud
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

        // Llamamos a la función original de envío de respuesta
        return originalSend.call(this, body);
    };

    next();
};
```

Puede resultar un poco raro esta forma de sobrescribir la función `res.send`, pero es una técnica común para agregar funcionalidad adicional a las respuestas sin perder la funcionalidad original. En palabras simples, lo que buscamos es guardar el método `res.send` original en una variable `originalSend`, luego sobrescribir `res.send` con una nueva función que registre la solicitud y finalmente llamar a `originalSend` para enviar la respuesta. De esta manera podemos registrar la solicitud y aún así enviar la respuesta al cliente.

Este middleware lo registraremos en el archivo `index.ts`  general del proyecto, justo antes de definir las rutas. De esta manera, todas las solicitudes entrantes pasarán por este middleware y se registrarán en un archivo de log.

```typescript
app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Lo añadimos para poder recibir datos de formularios HTML si se da el caso

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

Hemos observado dos lugares donde podemos añadir middlewares, uno es antes de definir las rutas y otro es después de definir las rutas. La diferencia entre estos dos lugares es que si lo añadimos antes de las rutas, el middleware se ejecutará para todas las solicitudes entrantes, mientras que si lo añadimos después de las rutas, el middleware solo se ejecutará para las solicitudes que no coincidan con ninguna ruta definida.

¿Qué sucedería si quiero multiples middlewares ejecutados en un orden para una ruta en específico? Puedes encadenar middlewares en la definición de la ruta. Por ejemplo:

```typescript
router.post(
    "/",
    userValidations.create, // Middleware de validación
    logger, // Middleware de loggeo
    userController.create // Controlador para manejar la creación del usuario
);
```

## Excepciones

Respecto a las excepciones, podemos crear un middleware de manejo de errores que capture cualquier error que ocurra en la aplicación y responda adecuadamente. Este middleware se ejecutará después de todos los demás middlewares y rutas, y se encargará de enviar una respuesta al cliente con el error.

Para crear un middleware de manejo de errores, sigue estos pasos:
1. Crea un archivo `errorHandler.ts` en la carpeta `middlewares`.
2. Define una función middleware que capture los errores y envíe una respuesta adecuada.

```typescript
import { Request, Response, NextFunction } from 'express';

// Interfaz para errores personalizados
interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Clase para crear errores personalizados
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

// Middleware para manejar errores
export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log('🚨 Error Handler ejecutado!');
    console.log('Error:', error.message);
    console.log('Status Code:', error.statusCode || 500);
    console.log('URL:', req.url);
    console.log('Método:', req.method);

    // Si es un error personalizado (AppError)
    if (error.isOperational) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }

    // Error genérico (no operacional)
    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'dev' ? error.message : 'Algo salió mal'
    });
};

// Función helper para crear errores
export const createError = (message: string, statusCode: number = 500) => {
    return new AppError(message, statusCode);
};
```

Este middleware captura cualquier error que ocurra en la aplicación y verifica si es un error personalizado (de tipo `AppError`). Si es así, responde con el código de estado y el mensaje del error. Si no, responde con un error genérico 500.
Para usar este middleware, simplemente impórtalo y regístralo en tu archivo `index.ts` general del proyecto, justo después de definir las rutas. De esta manera, cualquier error que ocurra en las rutas será capturado por este middleware.

```typescript
app.use('/api/users', userRoutes);
app.use(errorHandler); // Middleware de manejo de errores
```

