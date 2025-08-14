---
sidebar_position: 3
---

# Express | Typescript | Mongodb | Docker. Parte 1

Taller guiado para la elaboración de un proyecto base con Mongo DB, Express y Typescript.

## 1. ¿Qué es express?

Express es un framework para el entorno de ejecución Node.js que facilita la creación de aplicaciones web y APIs. Este proporciona una serie de características y herramientas que simplifican el desarrollo de aplicaciones del lado del servidor sobre todo para el desarrollo de microservicios y APIs RESTful. Algunas de las características clave de Express incluyen:

- **Rutas**: Permite definir rutas para manejar diferentes solicitudes HTTP (GET, POST, PUT, DELETE, etc.) y asociarlas con funciones específicas.
- **Middleware**: Soporta el uso de middleware, que son funciones que se ejecutan durante el ciclo de vida de una solicitud. Esto permite agregar funcionalidades como autenticación, manejo de errores, análisis de cuerpos de solicitudes, etc.
- **Plantillas**: Facilita la integración con motores de plantillas para generar contenido HTML dinámico.
- **Manejo de errores**: Proporciona un sistema para manejar errores de manera eficiente.
- **Extensibilidad**: Permite la integración con una amplia variedad de módulos y paquetes de Node.js para ampliar sus funcionalidades.

Proveniendo de antiguos desarrollos y aprendizajes del curso de Computación en Internet 2, encontrarás bastantes similitudes con Express y el framework de Backend Spring, por lo que para ayudarte en tu proceso de entender el funcionamiento de Express, realizaré algunas semejanzas con lo que ya conoces.

## 2. ¿Por qué usar Express?
Express es una opción popular para el desarrollo de aplicaciones web y APIs por varias razones:

- **Simplicidad y flexibilidad**: Express es minimalista y no impone una estructura rígida, lo que permite a los desarrolladores tener un control total sobre la arquitectura de su aplicación.
- **Ecosistema**: Al ser uno de los frameworks más populares para Node.js, cuenta con una gran cantidad de módulos y paquetes disponibles que pueden integrarse fácilmente, dentro de esta guía se revisarán algunos de ellos o serán adicionados en próximas sesiones.
- **Rendimiento**: Express es conocido por su rendimiento eficiente, lo que lo hace adecuado para aplicaciones de alta concurrencia (aunque no es tan robusto como otros frameworks más pesados como Spring).
- **Comunidad activa**: Cuenta con una comunidad grande y activa que contribuye con documentación, tutoriales y soporte, lo que facilita la resolución de problemas y el aprendizaje.
- **Compatibilidad con JavaScript/TypeScript**: Al estar basado en Node.js, Express permite a los desarrolladores usar JavaScript o TypeScript tanto en el frontend como en el backend, lo que puede simplificar el desarrollo y la colaboración entre equipos.

## 3. ¿Por qué usar MongoDB combinado con Express y TS?

Siguiendo los stack de desarrollo más populares, el stack MERN (MongoDB, Express, React, Node.js) es ampliamente utilizado para construir aplicaciones web modernas. MongoDB es una base de datos NoSQL que se integra bien con Express y Node.js debido a su naturaleza flexible y escalable.

<img src="/img/mern.png" alt="MERN Stack" width="800"/>

## 4. Contexto del taller guiado

Los juegos de mesa han sido unas de las actividades más populares que he podido experimentar en los últimos años, me han permitido conocer nuevas formas de ver el mundo y relacionarme con personas. No obstante, he notado que no existen aplicaciones modernas que hablen sobre ellos y generen comunidad, es por eso que a modo de taller guiado, desarrollaremos una aplicación básica que permita a los usuarios registrarse, iniciar sesión y compartir sus juegos de mesa favoritos. La aplicación tendrá las siguientes características:

- Registro de usuarios: Los usuarios podrán crear una cuenta proporcionando su nombre, correo electrónico y una contraseña segura.
- Inicio de sesión: Los usuarios podrán iniciar sesión en la aplicación utilizando su correo electrónico y contraseña.
- Gestión de juegos de mesa: Los usuarios podrán agregar, editar y eliminar juegos de mesa.
- Creación de comentarios: Los usuarios podrán comentar sobre los juegos de mesa y compartir sus opiniones.
- Agendar sesiones con ubicaciones y fechas: Los usuarios podrán agendar sesiones de juego, especificando la ubicación y la fecha del evento.

## 5. Configuración del entorno de desarrollo

Siguiendo con los temas revisados en el curso, intentaré que gran parte de la aplicación que desarrollemos en este taller guiado, sea usando las tecnologías de contenedores provistas por Docker y Docker Compose, para que puedas entender el flujo de trabajo y la importancia de estas tecnologías en el desarrollo moderno de software. Además de poder migrar y desplegar tus aplicaciones a la nube de manera sencilla.

### 5.1. Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:
- [Node.js](https://nodejs.org/) (versión 22)
- [Docker](https://www.docker.com/get-started)

### 5.2 Creación de la base de datos contenerizada

Para facilitar la creación de la base de datos, usaremos Docker Compose para definir y ejecutar un contenedor de MongoDB. Crea un archivo llamado `docker-compose.yml` en la raíz de tu proyecto con el siguiente contenido:

```yaml
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

En este caso usaremos la versión 8.0.12 de MongoDB que es de las más modernas hasta el momento de escribir esta guía. El contenedor expondrá el puerto 27017, que es el puerto predeterminado de MongoDB, y establecerá un usuario administrador con las credenciales `admin` y `admin123`. Además, se crea un volumen llamado `mongo_data` para persistir los datos de la base de datos.

Podemos ejecutar el contenedor con el siguiente comando:

```bash
docker-compose up -d
```

Esto iniciará el contenedor de MongoDB en segundo plano. Puedes verificar que el contenedor esté funcionando correctamente con el comando:

```bash
docker ps
```
Deberías ver el contenedor de MongoDB en la lista de contenedores en ejecución.

Si deseas detener el contenedor, puedes usar el comando:

```bash
docker-compose down
```

### 5.3. Configuración del proyecto de Node.js con TypeScript

Para comenzar, usaremos el directorio donde creamos el archivo `docker-compose.yml` como nuestro directorio de trabajo. Abre una terminal y navega a ese directorio. Luego, ejecuta los siguientes comandos para inicializar un nuevo proyecto de Node.js:

```bash
npm init -y
```

Esto creará un archivo `package.json` con la configuración predeterminada del proyecto.

A continuación, instalaremos las dependencias necesarias para nuestro proyecto. Ejecuta el siguiente comando:

```bash
npm install express mongoose dotenv cors bcrypt
```

Ahora, instalaremos TypeScript y las herramientas relacionadas para configurar nuestro proyecto con TypeScript:

```bash
npm install --save-dev typescript @types/node @types/express @types/bcrypt ts-node nodemon
```

Luego, inicializa un archivo de configuración de TypeScript ejecutando:

```bash
npx tsc --init
```

Esto generará un archivo `tsconfig.json` en tu proyecto. Puedes personalizarlo según tus necesidades, pero la configuración predeterminada debería ser suficiente para comenzar.

El archivo configuración `tsconfig.json` debería verse algo así:

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    "outDir": "./dist", // Directorio de salida para los archivos compilados

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

> **Nota:** Asegúrate de crear un archivo .gitignore en la raíz de tu proyecto y agregar las siguientes líneas para evitar subir archivos innecesarios al repositorio:

```
node_modules/
dist/
.env
```

Finalmente modificaremos el archivo `package.json` para agregar un script que nos permita ejecutar nuestro proyecto con TypeScript y Nodemon. Agrega lo siguiente en la sección de scripts:

```json
"scripts": {
    "start": "ts-node ./src/index.ts",
    "dev": "nodemon ./src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

Ts-Node nos permitirá ejecutar archivos TypeScript directamente, mientras que Nodemon reiniciará automáticamente la aplicación cada vez que detecte cambios en los archivos.

### 5.4. Estructura del proyecto

A diferencia de cuando se trabaja con Java / Spring, en Node.js y Express no hay una estructura de proyecto estrictamente definida, pero es recomendable seguir una convención para mantener el código organizado. Una estructura común para un proyecto Express con TypeScript podría ser la siguiente:

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

Claramente se observa que hay diferencias con la estructura de un proyecto Java, pero la idea es que cada carpeta tenga una responsabilidad específica:

- **config/**: Contiene archivos de configuración, como la conexión a la base de datos y variables de entorno.
- **controllers/**: Contiene los controladores que manejan la lógica de negocio y las respuestas a las solicitudes HTTP similarmente a los controladores en Spring.
- **interfaces/**: Define las interfaces de TypeScript para los modelos de datos y otros tipos utilizados en la aplicación.
- **models/**: Contiene los modelos de datos, que representan las entidades de la aplicación y se comunican con la base de datos.
- **routes/**: Define las rutas de la aplicación y las asocia con los controladores correspondientes (Puedes relacionarlo con las etiquetas de `@RequestMapping` en Spring).
- **services/**: Contiene la lógica de negocio y servicios que interactúan con los modelos y controladores.
- **index.ts**: El punto de entrada de la aplicación, donde se configura y se inicia el servidor Express.

Además he adicionado un archivo `.env` para manejar las variables de entorno, como las credenciales de la base de datos y otras configuraciones sensibles.

## 6. Creación del servidor Express

### 6.1 Creación del archivo `index.ts`

Ahora que tenemos la estructura del proyecto y las dependencias instaladas, vamos a crear el servidor Express. Abre el archivo `src/index.ts` y agrega el siguiente código:

```typescript
import express, { Express, Request, Response } from 'express';

import { db } from './config/connectionDB'; // Aún no está creado

const app: Express = express(); // Creación de una instancia de express

process.loadEnvFile(); // Process es un módulo de nodejs para manejar el entorno de ejecución, aquí cargamos las variables de entorno desde el archivo .env

const port = process.env.PORT || 3000; // Definimos el puerto en el que escuchará el servidor, si no se especifica en las variables de entorno, usará el puerto 3000 por defecto.

app.use(express.json()); // Módulo de Express para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Módulo de Express para manejar solicitudes URL codificadas

app.get("/", (req: Request, res: Response) => { // Definimos una ruta raíz para probar que el servidor está funcionando correctamente.
    res.send('Hola Mundo');
});

// Conectamos a la base de datos y luego iniciamos el servidor
db.then(() =>
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
);
```

En este archivo buscamos una configuración sencilla usando `Express`, por lo que importamos las dependencias necesarias y configuramos el servidor para que escuche en un puerto específico (3000 por defecto). También configuramos el middleware para manejar solicitudes JSON y URL codificadas.

Ya que tenemos la posibilidad de configurar las variables de entorno (como se realizaba con el archivo `application.properties` de Spring), crearemos un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017
```

### 6.2. Creación del archivo de conexión a la base de datos

Para mantener una conexión a la base de datos MongoDB, crearemos un archivo de configuración en la carpeta `config` llamado `connectionDB.ts`. Este archivo se encargará de establecer la conexión a la base de datos utilizando Mongoose, que es una biblioteca de modelado de objetos MongoDB para Node.js.

Crea el archivo `src/config/connectionDB.ts` y agrega el siguiente código:

```typescript
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

En este archivo, importamos Mongoose y usamos la función `connect` para establecer una conexión a la base de datos MongoDB utilizando la cadena de conexión definida en las variables de entorno. También especificamos el nombre de la base de datos como `boardgame-db`, que es el que definimos en el archivo `docker-compose.yml`.

### 6.3. Ejecutar el servidor

Hagamos una prueba simple, ejecuta el siguiente comando en la terminal para iniciar el servidor:

```bash
npm run dev
```

Si todo funcionó correctamente, deberías ver en tu terminal un mensaje indicando que el servidor está corriendo en el puerto 3000. Ahora, abre tu navegador y ve a `http://localhost:3000`. Deberías ver el mensaje "Hola Mundo".

## 7. Creación de un modelo de datos


### 7.1 Creación del modelo Usuario

Ahora que tenemos el servidor funcionando, vamos a crear un modelo de datos para representar los juegos de mesa. Dentro de los entorno de desarrollo de Javascript, es común encontrar que los módulos de la aplicación presentan un archivo `index.ts` que exporta todos los módulos del directorio, por lo que crearemos un archivo `index.ts` en la carpeta `models` para exportar nuestro modelo de datos.

Crea el archivo `src/models/index.ts` y agrega el siguiente código:

```typescript
export * from "./user.model";
```

Luego, crearemos el modelo de datos para los usuarios en un archivo llamado `user.model.ts` dentro de la carpeta `models`. Crea el archivo `src/models/user.model.ts` y agrega el siguiente código:

```typescript
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

Mongoose es uno de los módulos que usaremos para interactuar con la base de datos MongoDB. Este se considera un `ODM (Object Document Mapper)`, que permite definir esquemas y modelos para los documentos de la base de datos, facilitando la interacción con MongoDB.

Las instrucciones que deseamos ilustrar con este Script es lo siguiente:
1. Definimos una interfaz `UserDocument` que extiende de `UserInput` y `mongoose.Document`. Esta interfaz representa un documento de usuario en la base de datos y define los campos que tendrá el modelo, incluyendo los campos de marca de tiempo (`createdAt`, `updatedAt`, `deletedAt`).
2. Creamos un esquema de Mongoose llamado `userSchema` que define la estructura del documento de usuario, incluyendo los campos `name`, `email` y `password`. El campo `email` es único y tiene un índice para mejorar el rendimiento de las consultas. Puedes relacionar los esquemas de Mongoose con las entidades en JPA/Hibernate.
3. Finalmente, exportamos el modelo `UserModel` que se basa en el esquema definido. Este modelo se utilizará para interactuar con la colección de usuarios en la base de datos como se hacía con los repositorios en Spring Data JPA.

> **Nota:** Aún no hemos definido la interfaz `UserInput`, será tu trabajajo definirla en el archivo `src/interfaces/user.interface.ts`. Esta interfaz debe contener los campos `name`, `email` y `password` que se utilizarán al crear un nuevo usuario. Recuerda especificar el archivo `index.ts` en la carpeta `interfaces` para exportar la interfaz `UserInput`.

### 7.2 Creación del modelo Games

Dentro del contexto de esta aplicación de juegos de mesa, es fundamental contar con un modelo que represente los juegos en sí, los cuales pueden ser registrados y gestionados por los usuarios. Este modelo nos permitirá almacenar información relevante sobre cada juego, facilitando su administración y consulta dentro de la aplicación.

Crea el archivo `src/models/game.model.ts` y agrega el siguiente código:

```typescript
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

Recuerda adicionar la exportación del modelo en el archivo `src/models/index.ts`:

```typescript
export * from "./user.model";
export * from "./game.model";
```

## 8. Creación de un servicio para la gestión de usuarios

Manteniendo una estructura similar a la de Spring, crearemos un servicio para manejar la lógica de negocio relacionada con los usuarios. Este servicio se encargará de interactuar con el modelo de usuario y proporcionar métodos para crear, leer, actualizar y eliminar usuarios.

### 8.1 Creación del servicio UserService

En el apartado de servicios, aunque en Javascript no es regla manejar todas las funcionalidades por medio de constantes o functiones, las clases son una buena forma de encapsular la lógica de negocio. Por lo que crearemos un archivo `user.service.ts` dentro de la carpeta `services` y agregaremos el siguiente código:

```typescript
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

Como se observa, lo que hemos hecho hasta el momento es definir una clase `UserService` que contiene métodos para crear, buscar, actualizar y obtener usuarios. Cada método interactúa con el modelo `UserModel` para realizar las operaciones necesarias en la base de datos.

Primero, revisemos el método que permitirá crear nuevos usuarios.

#### 8.1.1 Método create
Para implementar el método `create`, debemos asegurarnos de que la contraseña del usuario se almacene de forma segura. Para ello, utilizaremos `bcrypt` para hashear la contraseña antes de guardarla en la base de datos. Aquí está la implementación del método `create`:

```typescript
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

Ya que estamos trabajando con Typescript, podemos observar su uso avanzado en diferentes partes del código. Por ejemplo el uso de `Promise<UserDocument>` indica que el método `create` devolverá una promesa que resolverá un objeto de tipo `UserDocument`. Esto es útil para manejar operaciones asíncronas, como las consultas a la base de datos.

Además, el uso de `ReferenceError` para lanzar un error si el usuario ya existe es una buena práctica para manejar errores de manera controlada. También se utiliza `bcrypt.hash` para hashear la contraseña del usuario antes de guardarla en la base de datos, lo que mejora la seguridad de la aplicación (se podría mejorar).

#### 8.1.2 Método findByEmail
El método `findByEmail` se encargará de buscar un usuario por su correo electrónico. Aquí está la plantilla del método:

```typescript
public findByEmail(email: string): ? {
    return UserModel.?
}
```

Tu tarea será completar este método para que busque un usuario por su correo electrónico utilizando el modelo `UserModel`. Puedes usar el método `findOne` de Mongoose para realizar esta operación.

#### 8.1.3 Método update
El método `update` se encargará de actualizar la información de un usuario existente. Aquí está la plantilla del método:

```typescript
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

Como puedes observar, mongoose nos ofrece el método `findOneAndUpdate` que nos permite buscar un documento por su ID y actualizarlo con los nuevos datos proporcionados en `userInput`. El parámetro `{returnOriginal: false}` asegura que se devuelva el documento actualizado en lugar del original.

> **Nota:** Asegúrate de definir la interfaz `UserInputUpdate` en el archivo `src/interfaces/user.interface.ts` para que puedas usarla en este método. Esta interfaz debe contener los campos que se pueden actualizar, como `name` e `email`. Dejaremos la forma de actualizar la contraseña como un ejercicio posterior.

#### 8.1.4 Método getAll
El método `getAll` se encargará de obtener todos los usuarios de la base de datos.

```typescript
public getAll(): Promise<UserDocument[]> {
    return UserModel.find();
}
```

Este método utiliza el método `find` de Mongoose para recuperar todos los documentos de la colección de usuarios. Devuelve una promesa que resolverá un array de `UserDocument`.

#### 8.1.5 Método getById
El método `getById` se encargará de obtener un usuario por su ID. Aquí está la plantilla del método:

```typescript
public getById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
}
```

> **Nota:** Asegúrate de exportar el servicio `userService` al final del archivo `src/services/user.service.ts` para que pueda ser utilizado en otras partes de la aplicación. Esto se hará por medio del archivo `index.ts` en la carpeta `services`. No debes de preocuparte de que cada vez que se importe el servicio, se cree una nueva instancia, ya que en Javascript y Typescript, las clases son singleton por defecto, es decir, solo se crea una instancia de la clase y se reutiliza en todas las importaciones.

## 9. Creación de un controlador para la gestión de usuarios
Ahora que tenemos el servicio `UserService` implementado, vamos a crear un controlador para manejar las solicitudes HTTP relacionadas con los usuarios. Este controlador se encargará de recibir las solicitudes, llamar al servicio correspondiente y devolver las respuestas adecuadas.

### 9.1 Creación del controlador UserController

Crea un archivo `user.controller.ts` junto al archivo `index.ts` dentro de la carpeta `controllers` y agrega el siguiente código:

```typescript
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

Como manejaremos las solicitudes, cada método del controlador recibirá un objeto `Request` y un objeto `Response` de Express. Estos objetos nos permiten acceder a los datos de la solicitud y enviar respuestas al cliente como los códigos de estado HTTP, encabezados y cuerpos de respuesta.

#### 9.1.1 Método create
El método `create` se encargará de crear un nuevo usuario. Aquí está la implementación del método:

```typescript
public async create(req: Request, res: Response) {
    try {
        const userInput: UserInput = req.body;
        const user: UserDocument = await userService.create(userInput); // También podría ser req.body as UserInput;
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

Por el momento, su funcionalidad es limitada, por lo que lo usaríamos como un delegado para el servicio `userService`. Este método recibe los datos del usuario desde el cuerpo de la solicitud (`req.body`), llama al método `create` del servicio y devuelve el usuario creado con un código de estado 201 (Creado). Si ocurre un error, se maneja adecuadamente y se devuelve un mensaje de error con un código de estado 500 (Error interno del servidor).


#### 9.1.2 Método getAll
El método `getAll` se encargará de obtener todos los usuarios. Aquí está la implementación del método:

```typescript
public async getAll(req: Request, res: Response) {
    try {
        const users: UserDocument[] = ?;
        res.json(users);
    } catch (error) {
        res.status(?).json(error);
    }
}
```

#### 9.1.3 Método getOne
El método `getOne` se encargará de obtener un usuario por su ID, por lo que desearíamos recibirlo como un parámetro de la solicitud. Aquí está la implementación del método:

```typescript
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

#### 9.1.4 Método update

Realiza la implementación del método `update` de manera similar a los anteriores, asegurándote de que se manejen correctamente los errores y se devuelva el usuario actualizado.


## 10. Creación de las rutas para los usuarios

A diferencia de Spring, donde las rutas de los endpoints se definen directamente en los controladores mediante anotaciones, en Express las rutas se manejan de manera más explícita. Crearemos un archivo `user.route.ts` dentro de la carpeta `routes` para definir las rutas relacionadas con los usuarios (No olvides adicionar el archivo `index.ts`).

Crea el archivo `src/routes/user.route.ts` y agrega el siguiente código:

```typescript
import express, { Request, Response } from "express";
import { userController } from "../controllers";

export const router = express.Router();

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

router.put("/:id", userController.update);

router.post("/", userController.create);
```

De esta manera express nos permite especificar las rutas de la aplicación de manera más explícita. En este caso, hemos definido las rutas para obtener todos los usuarios (`GET /`), obtener un usuario por ID (`GET /:id`), actualizar un usuario por ID (`PUT /:id`) y crear un nuevo usuario (`POST /`).

### 10.1 Integración de las rutas en el servidor

Para integrar las rutas de usuarios en nuestro servidor Express, debemos importar el router que acabamos de crear y usarlo en el archivo `src/index.ts`. Agrega el siguiente código después de la configuración del middleware:

```typescript
import { router as userRouter } from "./routes/user.route";

app.use("/api/users", userRouter);
```

## 11. Pruebas de la API

Para probar nuestra API, podemos usar herramientas como Postman, Insomnia o directamente un cURL en la terminal. Estas herramientas nos permiten enviar solicitudes HTTP a nuestro servidor y ver las respuestas.

Primero asegúrate de que el servidor esté corriendo. Luego, puedes probar los siguientes endpoints:

```bash
npm run dev
```

## 12. Express en Docker

Para mantener simple el despliegue de nuestro servicio de docker, realizaremos un archivo `Dockerfile` en la raíz del proyecto. Este archivo se encargará de construir una imagen de Docker para nuestra aplicación Express. Posterior a esto la agregaremos en el archivo `docker-compose.yml` para que se ejecute junto con el contenedor de MongoDB.
Crea el archivo `Dockerfile` en la raíz del proyecto y agrega el siguiente contenido:

```bash
# Usamos la imagen oficial de Node.js como base
FROM node:22
# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app
# Copiamos los archivos de nuestro proyecto al contenedor
COPY package*.json ./
# Instalamos las dependencias del proyecto
RUN npm install
# Copiamos el resto de los archivos del proyecto al contenedor
COPY . .
# Exponemos el puerto en el que nuestra aplicación escuchará
EXPOSE 3000
# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
```

Posterior a esto, modificaremos el archivo `docker-compose.yml` para incluir nuestro servicio de Express. Agrega lo siguiente al archivo:

```yaml
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
Con esto, hemos definido un nuevo servicio llamado `express` que construirá la imagen de Docker a partir del `Dockerfile` en la raíz del proyecto. El contenedor expondrá el puerto 3000 y dependerá del contenedor de MongoDB para funcionar correctamente.

Podemos observar los logs del contenedor de Express ejecutando el siguiente comando:

```bash
docker-compose logs -f express
```

> **Nota:** Asegúrate de que el contenedor de MongoDB esté corriendo antes de iniciar el contenedor de Express, ya que este último depende del primero para funcionar correctamente. Además de eso, debido a que el ambos contenedores funcionarán a través de una red Docker, es necesario modificar la cadena de conexión a MongoDB en el archivo `.env` para que apunte al nombre del servicio de MongoDB en lugar de `localhost`. Cambia la línea `MONGO_URI=mongodb://admin:admin123@localhost:27017` a `MONGO_URI=mongodb://admin:admin123@mongo:27017`.

## 13. TO DO

- [ ] Implementar el método `delete` en el controlador de usuarios.
- [ ] Implementar un CRUD para el modelo de datos `Game`.
- [ ] Implementar un servicio para manejar la lógica de negocio relacionada con los juegos de mesa.
- [ ] Implementar un controlador para manejar las solicitudes HTTP relacionadas con los juegos de mesa.
- [ ] Implementar las rutas para los juegos de mesa.