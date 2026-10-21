---
sidebar_position: 2
---

# Primeros pasos con NestJS

Guía detallada para iniciar un proyecto con NestJS.

## 1. Instalación de NestJS CLI

Para comenzar, es necesario instalar la herramienta de línea de comandos (CLI) de NestJS. Abre tu terminal y ejecuta el siguiente comando:

```bash
npm install -g @nestjs/cli
```

> **¿Por qué instalar el CLI?**  
> El CLI de NestJS facilita la creación, gestión y generación de código para proyectos NestJS, permitiendo automatizar tareas comunes y mantener buenas prácticas.

## 2. Crear un nuevo proyecto

Para crear un nuevo proyecto, utiliza el comando `nest new` seguido del nombre de tu proyecto. Por ejemplo, para crear un proyecto llamado `my-nest-app`, ejecuta:

```bash
nest new my-nest-app
```

El CLI te preguntará qué gestor de paquetes deseas usar (npm o yarn). Selecciona el que prefieras y espera a que se instalen las dependencias.

## 3. Estructura del proyecto

Una vez creado el proyecto, navega al directorio del proyecto:

```bash
cd my-nest-app
```

La estructura básica del proyecto será similar a la siguiente:

```
my-nest-app/
├── src/
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts
├── .eslint.config.mjs
├── .prettierrc
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

**Explicación de los archivos y carpetas principales:**

- `src/`: Contiene el código fuente de la aplicación.
    - `app.module.ts`: Módulo raíz de la aplicación, donde se importan y configuran los demás módulos.
    - `app.controller.ts`: Controlador principal, define rutas y métodos HTTP.
    - `app.service.ts`: Servicio principal, contiene la lógica de negocio.
    - `main.ts`: Punto de entrada de la aplicación, donde se inicia el servidor.
- `test/`: Contiene pruebas end-to-end.
- `package.json`: Configuración del proyecto, dependencias y scripts.
- `tsconfig.json`: Configuración de TypeScript.
- `nest-cli.json`: Configuración específica del CLI de NestJS.
- `.eslint.config.mjs` y `.prettierrc`: Configuraciones para ESLint (linter) y Prettier (formateador).  
    [¿Diferencia entre linter y formateador?](https://prettier.io/docs/comparison)

## 4. Ejecutar la aplicación

Para iniciar la aplicación en modo desarrollo, usa:

```bash
npm run start:dev
```

Para ejecutarla en modo producción:

```bash
npm run start
```

Esto iniciará el servidor en modo desarrollo, permitiendo recarga automática ante cambios en el código. Por defecto, la aplicación estará disponible en `http://localhost:3000`.

> **¿Cómo cambiar el puerto?**  
> Si el puerto 3000 está ocupado, edita el archivo `main.ts`:
>
> ```typescript
> await app.listen(3001); // Cambia 3001 por el puerto deseado
> ```

## 5. Creación de un nuevo módulo, controlador y servicio

NestJS organiza el código en **módulos**, **controladores** y **servicios**. El CLI permite generarlos fácilmente.

**Crear un módulo llamado `users`:**

```bash
nest generate module users
# o su forma corta
nest g mo users
```

**Crear un controlador llamado `users`:**

```bash
nest generate controller users
# o su forma corta
nest g co users
```

**Crear un servicio llamado `users`:**

```bash
nest generate service users
# o su forma corta
nest g s users
```

> **¿Qué es cada uno?**
> - **Módulo:** Agrupa código relacionado (controladores, servicios, etc.).
> - **Controlador:** Maneja solicitudes HTTP y define rutas.
> - **Servicio:** Contiene la lógica de negocio y es inyectado en los controladores.

**Generar todo junto como un recurso:**

```bash
nest generate resource users
# o su forma corta
nest g res users
```

El CLI preguntará si deseas REST o GraphQL, y si quieres incluir pruebas unitarias.

## 6. Creación de la entidad usuarios

Vamos a crear una entidad simple llamada `User`. Crea el archivo `user.entity.ts` dentro de `src/users/entities/`:

```typescript
// src/users/entities/user.entity.ts

/**
 * Representa un usuario en el sistema.
 */
export class User {
        id: number;
        username: string;
        email: string;
        passwordHash: string;
        bio: string;
        createdAt: Date;

        constructor(
                id: number,
                username: string,
                email: string,
                passwordHash: string,
                bio: string,
        ) {
                this.id = id;
                this.username = username;
                this.email = email;
                this.passwordHash = passwordHash;
                this.bio = bio;
                this.createdAt = new Date();
        }
}
```

> **Nota:**  
> Usamos una clase porque permite instanciar objetos y agregar lógica adicional si es necesario. Los getters y setters no son obligatorios en TypeScript a menos que se requiera lógica especial.

**Crear un DTO para crear usuarios:**  
Crea `create-user.dto.ts` en `src/users/dto/`:

```typescript
// src/users/dto/create-user.dto.ts

/**
 * DTO para la creación de usuarios.
 */
export class CreateUserDto {
        username: string;
        email: string;
        passwordHash: string;
        bio: string;
}
```

**DTO para actualizar usuarios:**  
Crea `update-user.dto.ts`:

```typescript
// src/users/dto/update-user.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO para actualizar usuarios, permite actualizar parcialmente los campos.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

> **¿Por qué clases y no interfaces?**  
> Las clases pueden ser instanciadas y decoradas para validación y transformación, lo cual es común en NestJS.

## 7. Implementación del servicio de usuarios

Edita `src/users/users.service.ts` para implementar la lógica de usuarios en memoria:

```typescript
// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
        private users: User[] = [];
        private idCounter = 1;

        /**
         * Crea un nuevo usuario y lo agrega al arreglo en memoria.
         */
        create(createUserDto: CreateUserDto) {
                const newUser: User = new User(
                        this.idCounter++,
                        createUserDto.username,
                        createUserDto.email,
                        createUserDto.passwordHash,
                        createUserDto.bio,
                );
                this.users.push(newUser);
                return newUser;
        }

        /**
         * Retorna todos los usuarios.
         */
        findAll() {
                return this.users;
        }

        /**
         * Busca un usuario por su ID.
         */
        findOne(id: number) {
                return this.users.find((user) => user.id === id);
        }

        /**
         * Actualiza un usuario existente.
         */
        update(id: number, updateUserDto: UpdateUserDto) {
                const userIndex = this.users.findIndex((user) => user.id === id);
                if (userIndex === -1) return null;
                this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
                return this.users[userIndex];
        }

        /**
         * Elimina un usuario por su ID.
         */
        remove(id: number) {
                const userIndex = this.users.findIndex((user) => user.id === id);
                if (userIndex === -1) return null;
                const removedUser = this.users.splice(userIndex, 1)[0];
                return removedUser;
        }
}
```

> **Comentario:**  
> Este servicio almacena los usuarios en memoria, ideal para pruebas o prototipos.

## 8. Implementación del recurso de roles

Supongamos que queremos manejar roles de usuario. Genera el recurso con el CLI:

```bash
nest g res roles
```

**Entidad de roles:**  
Crea `role.entity.ts` en `src/roles/entities/`:

```typescript
// src/roles/entities/role.entity.ts

/**
 * Representa un rol en el sistema.
 */
export class Role {
        id: number;
        name: string;
        description: string;

        constructor(id: number, name: string, description: string) {
                this.id = id;
                this.name = name;
                this.description = description;
        }
}
```

**DTO para crear roles:**  
Crea `create-role.dto.ts` en `src/roles/dto/`:

```typescript
// src/roles/dto/create-role.dto.ts

/**
 * DTO para la creación de roles.
 */
export class CreateRoleDto {
        name: string;
        description: string;
}
```

**Servicio de roles:**  
Edita `src/roles/roles.service.ts`:

```typescript
// src/roles/roles.service.ts

import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
        private roles: Role[] = [];
        private idCounter = 1;

        /**
         * Crea un nuevo rol.
         */
        create(createRoleDto: CreateRoleDto) {
                const newRole = new Role(
                        this.idCounter++,
                        createRoleDto.name,
                        createRoleDto.description,
                );
                this.roles.push(newRole);
                return newRole;
        }

        /**
         * Retorna todos los roles.
         */
        findAll() {
                return this.roles;
        }

        /**
         * Busca un rol por su ID.
         */
        findOne(id: number) {
                return this.roles.find((role) => role.id === id);
        }

        /**
         * Actualiza un rol existente.
         */
        update(id: number, updateRoleDto: UpdateRoleDto) {
                const role = this.roles.find((role) => role.id === id);
                if (role) {
                        Object.assign(role, updateRoleDto);
                        return role;
                }
                return null;
        }

        /**
         * Elimina un rol por su ID.
         */
        remove(id: number) {
                const index = this.roles.findIndex((role) => role.id === id);
                if (index !== -1) {
                        this.roles.splice(index, 1);
                        return { id };
                }
                return null;
        }

        /**
         * Busca un rol por su nombre.
         */
        findByName(name: string): Role | undefined {
                return this.roles.find((role) => role.name === name);
        }
}
```

> **Comentario:**  
> El método `findByName` permite buscar roles por nombre, útil para asignar roles a usuarios.

### Relacionar usuarios con roles

Ahora, queremos que cada usuario tenga un rol asignado. Modifica la entidad `User` para agregar la propiedad `roleId`:

```typescript
// src/users/entities/user.entity.ts

export class User {
        id: number;
        username: string;
        email: string;
        passwordHash: string;
        bio: string;
        createdAt: Date;
        roleId: number; // Nuevo campo

        constructor(
                id: number,
                username: string,
                email: string,
                passwordHash: string,
                bio: string,
                roleId: number, // Nuevo parámetro
        ) {
                this.id = id;
                this.username = username;
                this.email = email;
                this.passwordHash = passwordHash;
                this.bio = bio;
                this.createdAt = new Date();
                this.roleId = roleId;
        }
}
```

**Actualizar el DTO de creación de usuario:**  
Ahora, en vez de recibir `roleId`, recibiremos `roleName` para buscar el rol por nombre:

```typescript
// src/users/dto/create-user.dto.ts

export class CreateUserDto {
        username: string;
        email: string;
        passwordHash: string;
        bio: string;
        roleName: string; // Nuevo campo
}
```

**Actualizar el servicio de usuarios para asignar el rol:**  
Ahora el servicio de usuarios debe recibir el servicio de roles y buscar el rol por nombre antes de crear el usuario.

```typescript
// src/users/users.service.ts

import { RolesService } from '../roles/roles.service';

export class UsersService {
        private users: User[] = [];
        private idCounter = 1;

        constructor(private rolesService: RolesService) {}

        create(createUserDto: CreateUserDto) {
                // Buscar el rol por nombre
                const role = this.rolesService.findByName(createUserDto.roleName);
                if (!role) {
                        throw new Error('Role not found');
                }

                const newUser: User = new User(
                        this.idCounter++,
                        createUserDto.username,
                        createUserDto.email,
                        createUserDto.passwordHash,
                        createUserDto.bio,
                        role.id, // Asignar el ID del rol
                );
                this.users.push(newUser);
                return newUser;
        }

        // ...otros métodos igual
}
```

> **Nota:**  
> Si el rol no existe, lanzamos un error para evitar crear usuarios sin rol válido.

**Asegurar la inyección de dependencias entre módulos:**

Para que el servicio de usuarios pueda usar el servicio de roles, debes exportar el servicio de roles y asegurarte de importar el módulo de roles en el módulo de usuarios.

- En `src/roles/roles.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
        controllers: [RolesController],
        providers: [RolesService],
        exports: [RolesService], // Exportar el servicio
})
export class RolesModule {}
```

- En `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module'; // Importar el módulo de roles

@Module({
        imports: [RolesModule], // Importar aquí
        controllers: [UsersController],
        providers: [UsersService],
})
export class UsersModule {}
```

> **¿Por qué separar módulos?**  
> Si los roles se usan en diferentes partes de la aplicación, es mejor tenerlos en un módulo independiente. Si solo se usan en usuarios, puedes mantenerlos juntos.

**Ejemplo de estructura de proyecto modular:**

```
my-nest-app/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── roles/
│   │   ├── dto/
│   │   │   ├── create-role.dto.ts
│   │   │   └── update-role.dto.ts
│   │   ├── entities/
│   │   │   └── role.entity.ts
│   │   ├── roles.controller.ts
│   │   ├── roles.module.ts
│   │   └── roles.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts
├── .eslint.config.mjs
├── .prettierrc
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

## 9. Arreglo de pruebas unitarias

Al modificar los servicios y DTOs, es probable que las pruebas generadas por el CLI fallen. Debemos actualizarlas para reflejar la nueva lógica.

**Pruebas del servicio de usuarios:**  
Edita `src/users/users.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';

describe('UsersService', () => {
        let service: UsersService;

        // Mock del servicio de roles
        const mockRolesService = {
                findByName: jest.fn(),
        };

        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        providers: [
                                UsersService,
                                { provide: RolesService, useValue: mockRolesService },
                        ],
                }).compile();

                service = module.get<UsersService>(UsersService);
        });

        it('should be defined', () => {
                expect(service).toBeDefined();
        });
});
```

> **Comentario:**  
> Se utiliza un mock para el servicio de roles, permitiendo probar el servicio de usuarios de forma aislada.

**Pruebas del controlador de usuarios:**  
Edita `src/users/users.controller.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';

describe('UsersController', () => {
        let controller: UsersController;

        // Mock del servicio de roles
        const mockRolesService = {
                findByName: jest.fn(),
        };

        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        controllers: [UsersController],
                        providers: [
                                UsersService,
                                { provide: RolesService, useValue: mockRolesService },
                        ],
                }).compile();

                controller = module.get<UsersController>(UsersController);
        });

        it('should be defined', () => {
                expect(controller).toBeDefined();
        });
});
```

> **Alternativa:**  
> También puedes mockear el servicio de usuarios directamente si solo quieres probar el controlador:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
        let controller: UsersController;

        const mockUsersService = {
                create: jest.fn(),
                findAll: jest.fn(),
                findOne: jest.fn(),
                update: jest.fn(),
                remove: jest.fn(),
        };

        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        controllers: [UsersController],
                        providers: [{ provide: UsersService, useValue: mockUsersService }],
                }).compile();

                controller = module.get<UsersController>(UsersController);
        });

        it('should be defined', () => {
                expect(controller).toBeDefined();
        });
});
```
