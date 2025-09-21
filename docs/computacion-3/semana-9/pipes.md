---
sidebar_position: 2
---

# Pipes en NestJS

Los pipes son una funcionalidades de Nest que permite transformar y validar datos de entrada en las rutas de los controladores. Se pueden aplicar a nivel de método, controlador o globalmente en toda la aplicación. Es similar a la estructura de los middlewares en Express, no obstante los que usaremos ya vienen integrados en NestJS.

## Pipes integrados en NestJS

Los pipes, elementos anotados por el decorador `@Injectable()`, implementan la interfaz `PipeTransform`, que contiene el método `transform()`. Este método recibe dos argumentos:

- `value`: El valor que se va a transformar o validar.
- `metadata`: Información adicional sobre el contexto en el que se está ejecutando el pipe, como el tipo de dato esperado y la ubicación del valor (por ejemplo, en el cuerpo de la solicitud, en los parámetros de la ruta, etc.).

Inicialmente NestJS proporciona varios pipes integrados que puedes utilizar directamente en tus controladores:

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe
- ParseFilePipe
- ParseDatePipe

## Uso de Pipes en controladores

Puedes aplicar pipes a nivel de método, controlador o globalmente en toda la aplicación. Aquí tienes algunos ejemplos de cómo usar los pipes integrados en NestJS:

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

En este ejemplo, el pipe `ParseIntPipe` se aplica al parámetro `id`, asegurando que se convierta a un número entero antes de ser pasado al método `findOne`.

También puedes usar los pipes de ParseUUID y ParseEnum:

```typescript
@Get(':id')
async findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.catsService.findOne(id);
}
```

```typescript
@Get(':status')
async findByStatus(@Param('status', new ParseEnumPipe(CatStatus)) status: CatStatus) {
  return this.catsService.findByStatus(status);
}
```

En este último ejemplo, no estamos haciendo uso de la clase `ParseEnumPipe` directamente, sino que estamos creando una nueva instancia de la clase y pasándole el enum `CatStatus` como argumento. Esto permite que el pipe valide que el valor del parámetro `status` sea uno de los valores definidos en el enum `CatStatus`.

## Creación de Pipes personalizados

Además de los pipes integrados, puedes crear tus propios pipes personalizados implementando la interfaz `PipeTransform`. Estos pueden ser útiles para casos específicos de validación o transformación de datos. Para hacer algo similar a lo que hacíamos en Express con middlewares, podemos crear un pipe personalizado que valide si un ID es un número positivo:

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('Validation failed (positive integer is expected)');
    }
    return val;
  }
}
```

No obstante, a veces querremos hacer validaciones más específicas, para esto podríamos hacerlo por nuestra cuenta, pero existen librerías como `Zod`, `class-validator` o `Joi` que nos facilitan la vida. Aquí un ejemplo usando `class-validator`:

Instalamos las respectivas dependencias:

```bash
npm install class-validator class-transformer
npm install --save-dev @types/class-validator
```

Después, modificaremos nuestros DTOs para incluir las validaciones:

```typescript
import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    email: string;

    @IsString()
    passwordHash: string;

    @IsString()
    bio: string;

    @IsString()
    roleName: string;
}
```

Luego, aplicamos el `ValidationPipe` en nuestra aplicación principal (`main.ts`):

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
// Or import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

También tenemos la posibilidad de validar los parámetros de las rutas, para esto podemos crear un DTO específico para los parámetros:

```typescript
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class GetUserParams {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    id: number;
}
```

Y luego usarlo en nuestro controlador:

```typescript
@Get(':id')
@HttpCode(HttpStatus.OK)
findOne(@Param('id', ParseIntPipe) id: GetUserParams['id']) {
    return this.usersService.findOne(id);
}
```