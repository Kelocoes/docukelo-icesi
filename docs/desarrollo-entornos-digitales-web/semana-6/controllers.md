---
sidebar_position: 1
---

# Controladores en NestJS

En esta guía exploraremos las funcionalidades avanzadas que ofrecen los controladores en NestJS. Probablemente ya has creado controladores y definido rutas, pero NestJS proporciona muchas características adicionales que pueden facilitar el desarrollo de tus aplicaciones.

Para seguir esta guía, utiliza el proyecto que creaste en la `Semana 8` o el repositorio del curso en GitHub: [Kelocoes/compunet3-20252](https://github.com/Kelocoes/compunet3-20252/tree/nest/intro) usando la rama `nest/intro`.

## Etiqueta de ruta

En NestJS, puedes definir rutas utilizando decoradores. El decorador `@Controller()` se utiliza para definir un controlador y puede aceptar una cadena que representa la ruta base para todas las rutas definidas en ese controlador.

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'This action returns all users';
  }
}
```

En este ejemplo, todas las rutas definidas en `UsersController` estarán prefijadas con `/users`. Por lo tanto, la ruta para `findAll` será `/users`.

## Parámetros de ruta

Puedes definir parámetros en las rutas utilizando dos puntos (`:`) seguidos del nombre del parámetro. NestJS proporciona el decorador `@Param()` para acceder a estos parámetros en tus métodos de controlador.

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns user with id: ${id}`;
  }
}
```

## Acceder a los query parameters

Los query parameters son una forma común de enviar datos en las solicitudes HTTP. En NestJS, puedes acceder a ellos utilizando el decorador `@Query()`.

```typescript
import { Controller, Get, Query } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  findAll(@Query('category') category: string) {
    return `This action returns all products in category: ${category}`;
  }
}
```
Puedo acceder a los query parameters de la siguiente manera: `GET /products?category=electronics`.

## Acceder al cuerpo de la solicitud (Request Body)

Para manejar datos enviados en el cuerpo de una solicitud HTTP (como en solicitudes POST o PUT), puedes usar el decorador `@Body()`.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return `This action creates a user with name: ${createUserDto.name}`;
  }
}
```

En este ejemplo, `CreateUserDto` es una clase que define la estructura de los datos que esperas en el cuerpo de la solicitud.

## Acceder a los encabezados de la solicitud (Request Headers)

Puedes acceder a los encabezados de la solicitud utilizando el decorador `@Headers()`.

```typescript
import { Controller, Get, Headers } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('profile')
  getProfile(@Headers('authorization') authHeader: string) {
    return `Authorization header: ${authHeader}`;
  }
}
```

Lo que pondremos en el decorador de `@Headers()` es el nombre del encabezado que queremos obtener.

Aquí hay algunos ejemplos:

| Encabezado        | Descripción                                 | Ejemplo valor                |
|-------------------|---------------------------------------------|------------------------------|
| Authorization     | Token de autenticación                      | Bearer eyJhbGciOiJIUzI1Ni... |
| Content-Type      | Tipo de contenido enviado                   | application/json             |
| User-Agent        | Información del cliente                     | Mozilla/5.0                  |
| Accept            | Tipos de respuesta aceptados                | application/json             |
| X-Request-ID      | Identificador único de la solicitud         | 123e4567-e89b-12d3-a456...   |

## Respuestas personalizadas (status y headers)

Puedes personalizar las respuestas HTTP utilizando los decoradores `@Res()` y `@HttpCode()`. El decorador `@Res()` te permite acceder al objeto de respuesta nativo, mientras que `@HttpCode()` te permite establecer el código de estado HTTP.

```typescript
import { Controller, Get, Res, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('custom')
export class CustomController {
    @Get('response')
    @HttpCode(201)
    customResponse(@Res() res) {
        res.setHeader('X-Custom-Header', 'CustomValue');
        return res.send('This is a custom response with status 201');
    }

    @Get('simple-response')
    simpleResponse(@Res() res) {
        return res.status(HttpStatus.OK).json({ message: 'This is a simple JSON response' });
        
    }
}
```

También existen otros métodos ya definidos en NestJS que podemos usar para representar diferentes estados de error de la solicitud sin escribir el código manualmente:

```typescript
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private users = [{ id: 1, name: 'Kevin' }];

  @Get(':id')
  getUser(@Param('id') id: string) {
    const user = this.users.find(u => u.id === +id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
```

Aquí tienes algunos de los excepciones HTTP que puedes lanzar directamente en tus controladores usando NestJS:

| Excepción                           | Código de estado | Descripción                                 |
|--------------------------------------|------------------|---------------------------------------------|
| `BadRequestException`                | 400              | Solicitud mal formada                       |
| `UnauthorizedException`              | 401              | No autorizado                               |
| `ForbiddenException`                 | 403              | Prohibido                                   |
| `NotFoundException`                  | 404              | No encontrado                               |
| `MethodNotAllowedException`          | 405              | Método no permitido                         |
| `NotAcceptableException`             | 406              | No aceptable                                |
| `RequestTimeoutException`            | 408              | Tiempo de espera agotado                    |
| `ConflictException`                  | 409              | Conflicto                                   |
| `GoneException`                      | 410              | Recurso eliminado                           |
| `PayloadTooLargeException`           | 413              | Carga demasiado grande                      |
| `UnsupportedMediaTypeException`      | 415              | Tipo de medio no soportado                  |
| `UnprocessableEntityException`       | 422              | Entidad no procesable                       |
| `PreconditionFailedException`        | 412              | Fallo de precondición                       |
| `InternalServerErrorException`       | 500              | Error interno del servidor                  |
| `NotImplementedException`            | 501              | No implementado                             |
| `BadGatewayException`                | 502              | Puerta de enlace incorrecta                 |
| `ServiceUnavailableException`        | 503              | Servicio no disponible                      |
| `GatewayTimeoutException`            | 504              | Tiempo de espera de la puerta de enlace     |
| `HttpVersionNotSupportedException`   | 505              | Versión HTTP no soportada                   |
| `ImATeapotException`                 | 418              | Soy una tetera (broma RFC)                  |

Si usaras por ejemplo el `BadRequestException`, el código de estado HTTP que se enviará en la respuesta será `400`.
Además de eso, puedes personalizar el mensaje y la descripción del error. Por ejemplo, si envías lo siguiente en tu controlador:

```typescript
throw new BadRequestException('Something bad happened', {
    cause: new Error(),
    description: 'Some error description',
});
```

La respuesta que recibiría el cliente sería similar a:

```json
{
    "message": "Something bad happened",
    "error": "Some error description",
    "statusCode": 400
}
```

Esto te permite enviar información adicional sobre el error y mejorar la claridad de las respuestas en tu API.

## Wildcards en rutas

Puedes usar wildcards en las rutas para capturar múltiples segmentos de una URL. En NestJS, puedes usar el asterisco (`*`) para definir un wildcard.

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('files')
export class FilesController {
    @Get('*')
    getFile(@Param() params) {
        return `This action returns the file path: ${params[0]}`;
    }
}
```

También podríamos tener un wildcard en medio de la ruta:

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('files')
export class FilesController {
    @Get('download/*/details')
    getFileDetails(@Param() params) {
        return `This action returns the file details for path: ${params[0]}`;
    }
}
```
En este caso, si hacemos una solicitud a `/files/download/some/path/details`, el valor de `params[0]` será `some/path`.

## Resumen

En la guía hay algunos elementos que podrían ser útiles para ti al momento de crear controladores en NestJS. No obstante, quiero darte un ejemplo trabajando con el repositorio del curso, por lo que te daré un ejemplo de cómo se podría ver un controlador completo en una aplicación NestJS usando todas las funcionalidades vistas en esta guía.

Para esto crearé una nueva carpeta llamada `common` dentro de `src` y allí crearé una estructura de carpetas para especificar las excepciones personalizadas que usaré  en diferentes lugares de la aplicación.

```plaintext
src
└── common
    └── exceptions
        ├── http
        │   ├── role-not-found.exception.ts
        │   ├── user-not-found.exception.ts
        └── index.ts
```

En cada uno de los archivos de excepciones personalizadas, extenderé las excepciones HTTP que ya existen en NestJS para agregar mensajes y descripciones específicas para mi aplicación.

```typescript
// src/common/exceptions/http/role-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class RoleNotFoundException extends NotFoundException {
    constructor(roleId: number | string) {
        super({
            error: 'Role Not Found',
            message: `Role with ID/Name ${roleId} does not exist`,
        });
    }
}

// src/common/exceptions/http/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor(userId: number, code?: string) {
        super({
            error: 'User Not Found',
            message: `User with ID ${userId} does not exist`,
            code,
        });
    }
}
```

Luego, en el archivo `index.ts`, exportaré todas las excepciones para facilitar su importación en otros archivos.

```typescript
export * from './http/role-not-found.exception';
export * from './http/user-not-found.exception';
```

Ahora, modificaré el controlador llamado `UsersController` que utilizará estas excepciones personalizadas. Este controlador manejará las operaciones relacionadas con los usuarios, como obtener todos los usuarios, obtener un usuario por ID, crear un nuevo usuario y actualizar un usuario existente.

```typescript
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            return await this.usersService.update(+id, updateUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user', {
                cause: error,
                description:
                    'An error occurred while updating the user in the database.',
            });
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.usersService.remove(+id);
    }
}
```

Qué raro, por qué no puse ningúna excepción personalizada en este controlador? Bueno, la razón es que las excepciones personalizadas ya están siendo manejadas dentro del servicio `UsersService`. Por ejemplo, si un usuario no es encontrado, el servicio lanzará la excepción `UserNotFoundException`, y el controlador simplemente propagará esa excepción al cliente. Aquí tienes un ejemplo de cómo se ve el servicio `UsersService` con las excepciones personalizadas:

```typescript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../auth/services/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    RoleNotFoundException,
    UserNotFoundException,
} from '../common/exceptions';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private rolesService: RolesService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const role = await this.rolesService.findByName(createUserDto.roleName);
        if (!role) {
            throw new RoleNotFoundException(createUserDto.roleName);
        }

        const newUser = this.userRepository.create({
            ...createUserDto,
            role,
        });
        return await this.userRepository.save(newUser);
    }

    findAll() {
        return this.userRepository.find();
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const userExist = await this.userRepository.findOne({ where: { id } });
        if (!userExist) {
            throw new UserNotFoundException(id, 'P20250');
        }
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);
        if (!result.affected || result.affected === 0) {
            throw new UserNotFoundException(id);
        }
    }
}
```

Por supuesto, hay margen de mejora y optimización en este código, pero la idea principal es mostrarte cómo puedes estructurar tus controladores y servicios en NestJS utilizando las funcionalidades avanzadas que ofrece el framework, como los decoradores para manejar rutas, parámetros, cuerpos de solicitud, encabezados y respuestas personalizadas, así como la creación de excepciones personalizadas para mejorar la gestión de errores en tu aplicación.