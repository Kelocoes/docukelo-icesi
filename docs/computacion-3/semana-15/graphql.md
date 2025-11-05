---
sidebar_position: 1
---

# Taller de GraphQL

## Introducción

¡Hola! En este taller vamos a revisar los conceptos básicos de **GraphQL** y cómo implementarlo en un proyecto simple. Para esto necesito que te prepares creando un proyecto de **NestJS** a partir de la rama [del curso](https://github.com/Kelocoes/compunet3-20252/tree/nest/graphql) o aceptando la asignación que te hice en el **Github Classroom** (revisa tu _inbox de intu_).

A modo de contextualización de este pequeño proyecto, te explicaré lo siguiente: 

## 1. Contexto del Proyecto

Este proyecto es una aplicación **NestJS** que utiliza **TypeORM** y **PostgreSQL** para gestionar un sistema de autores y publicaciones (posts). La estructura está organizada en dos módulos principales:

### Módulos

- **Authors**: Gestiona la información de autores (nombre, email, biografía, país, etc.)
- **Posts**: Maneja las publicaciones de blog (título, contenido, categoría, vistas, likes, etc.)

### Relaciones

- Un autor puede tener **múltiples posts**
- Cada post pertenece a **un autor específico**

<img src="/img/db_authors_posts.png" alt="Diagrama de Entidad-Relación" width="600" />

### Datos de Prueba

El proyecto incluye una base de datos pre-poblada con:
- **50 autores** de diferentes países
- **50 posts** sobre diversos temas de tecnología

### Configuración Inicial

Para trabajar con el proyecto necesitas:

1. Instalar dependencias: `npm install`
2. Copiar el archivo de configuración: `cp .env.example .env`
3. Iniciar PostgreSQL con Docker: `docker-compose up -d`
4. Cargar datos de prueba: `cd db/scripts && bash insert.sh`
5. Iniciar el servidor: `npm run start:dev`

El proyecto ya cuenta con servicios funcionales para **CRUD** de autores y posts, sobre los cuales construiremos las operaciones GraphQL en este taller.

## 2. ¿Por qué GraphQL?

**GraphQL** es un lenguaje de consulta para APIs que permite a los clientes solicitar _exactamente_ los datos que necesitan, ni más ni menos. Fue desarrollado por **Facebook** en 2012 y liberado como un proyecto de código abierto en 2015. Desde entonces, ha ganado popularidad como una alternativa a las APIs REST tradicionales.

<img src="/img/graphql_rest.png" alt="Logo de GraphQL" width="600" />

### Problemas comunes con REST que GraphQL resuelve

Durante el desarrollo de APIs REST, es común escuchar frases como estas:

1. **Over-fetching y endpoints específicos**
   
   _"Uhh, lo siento, necesitamos otro endpoint con menos información, ¿podrías crearlo?"_
   
   Con REST, cada necesidad de datos diferente requiere un **nuevo endpoint** o modificar uno existente.

2. **Múltiples requests (N+1 problem)**
   
   _"Estamos haciendo demasiadas llamadas al API para cargar una sola pantalla, ¿puedes optimizar esto?"_
   
   REST obliga a **múltiples requests** para obtener datos relacionados (problema de N+1).

3. **Transferencia de datos innecesarios**
   
   _"El equipo de mobile se queja que estamos enviando demasiados datos innecesarios y está afectando el rendimiento"_
   
   REST devuelve estructuras fijas, causando **over-fetching** de datos no utilizados.

4. **Versionado constante**
   
   _"Necesitamos una versión v2 del API porque cambiaron los requerimientos del frontend"_
   
   REST requiere **versionado** cuando las necesidades de datos evolucionan.

5. **Dependencias entre equipos**
   
   _"El equipo de frontend está esperando que terminemos 3 endpoints diferentes para poder avanzar con su feature"_
   
   REST crea **dependencias fuertes** entre equipos de backend y frontend.

**GraphQL soluciona estos problemas** permitiendo que el cliente solicite exactamente los datos que necesita, en _una sola consulta_, sin necesidad de crear múltiples endpoints o versiones del API.

### Beneficios de GraphQL

- **Consulta flexible**: Los clientes pueden especificar exactamente qué datos necesitan.
- **Reducción de llamadas**: Una sola consulta puede obtener datos relacionados, minimizando el número de requests.
- **Evolución sin versiones**: Nuevos campos pueden ser añadidos sin afectar a los clientes existentes.
- **Mejor colaboración**: Frontend y backend pueden trabajar de manera más independiente.
- **Documentación automática**: Las herramientas de GraphQL generan documentación basada en el esquema.
- **Tipado fuerte**: El esquema define claramente los tipos de datos y sus relaciones.

:::warning
A pesar de sus beneficios, GraphQL también presenta desafíos, como la complejidad en la implementación de _resolvers_ y la necesidad de un mayor control sobre el rendimiento de las consultas y más. Te dejaré esta lectura para que profundices en el tema: [Enlace!](https://bessey.dev/blog/2024/05/24/why-im-over-graphql)
:::

## 3. Primeros Pasos con GraphQL en NestJS

Para implementar GraphQL en un proyecto de NestJS, tendrás que tener en cuenta los siguientes pasos:

1. **Instalación de dependencias necesarias**:
   ```bash
   npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql
   ```

:::info
Espera, ¿qué? ¿Qué es eso de Apollo?
**Apollo** es una plataforma de gestión de datos que facilita la implementación y el consumo de APIs GraphQL. Proporciona herramientas tanto para el servidor como para el cliente, permitiendo a los desarrolladores construir, gestionar y consumir APIs GraphQL de manera eficiente. Podríamos decir que es el _estándar de facto_ para trabajar con GraphQL, siendo GraphQL una especificación abierta.
:::

2. **Configuración del módulo GraphQL en NestJS**:
   En el archivo `app.module.ts`, importa y configura el módulo GraphQL:
   ```typescript
   import { GraphQLModule } from '@nestjs/graphql';
   import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
   import { join } from 'path';

   @Module({
     imports: [
       GraphQLModule.forRoot<ApolloDriverConfig>({
         driver: ApolloDriver, // Usamos Apollo como driver de GraphQL
         autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Genera el esquema automáticamente
         playground: false, // Deshabilita el playground en producción
         plugins: [ApolloServerPluginLandingPageLocalDefault()], // Habilita el sandbox de Apollo, recomendado por NestJS
         sortSchema: true, // Ordena el esquema para mejor legibilidad
       }),
       // otros módulos...
     ],
   })
   export class AppModule {}
   ```

¿Esquemas... como los de SQL? ¡Exactamente! GraphQL utiliza un **esquema** para definir la estructura de los datos que se pueden consultar y las operaciones disponibles. En NestJS, puedes definir tu esquema utilizando _decoradores_ en tus clases y métodos, pero al final podemos dejar que NestJS genere el esquema automáticamente a partir de nuestras entidades y DTOs.

Un esquema de GraphQL se puede ver así:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}
```

En este ejemplo, definimos un tipo `User` con campos `id`, `name` y `email`. También definimos dos operaciones de consulta (`Query`) para obtener usuarios y una operación de mutación (`Mutation`) para crear un nuevo usuario.

:::info
El símbolo `!` indica que el campo es **obligatorio**, es decir, no puede ser nulo.
:::

## 4. Mapeo de Entidades a Tipos GraphQL

Para mapear tus entidades de TypeORM a tipos de GraphQL en NestJS, puedes utilizar los decoradores proporcionados por el paquete `@nestjs/graphql`. Aquí te muestro cómo hacerlo:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Role } from './role.entity';

@ObjectType() // Define un tipo de objeto GraphQL
export class UserType {
  @Field(() => ID) // Define un campo de tipo ID
  id: number;

  @Field() // Define un campo de tipo String
  name: string;

  @Field() // Define un campo de tipo String
  email: string;

  @Field(() => [Role], { nullable: true }) // Define un campo que es una lista de Roles, puede ser nulo
  roles: Role[];
}
```

En este ejemplo, estamos definiendo un tipo de objeto GraphQL `UserType` que corresponde a nuestra entidad `User`. Los decoradores `@ObjectType()` y `@Field()` se utilizan para definir el esquema de GraphQL.

¿Pero cuáles decoradores existen?
Aquí tienes una lista de los decoradores más comunes que puedes usar para mapear tus entidades a tipos de GraphQL en NestJS:

- `@ObjectType()`: Define un tipo de objeto GraphQL.
- `@Field()`: Define un campo dentro de un tipo de objeto.
- `@ID()`: Define un campo como un identificador único.

Realmente puedes definir el mapeo **directamente en la entidad**, pero si quieres mantener una separación clara entre la lógica de la base de datos y la definición del esquema GraphQL, es recomendable crear clases **DTO (Data Transfer Object)** separadas para los tipos GraphQL.

Aquí te dejo un ejemplo de la entidad de Post y su correspondiente tipo GraphQL:

```typescript
@ObjectType()
@Entity('posts')
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ length: 200 })
    title: string;

    @Field()
    @Column({ type: 'text' })
    content: string;

    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    category: string;

    @Field(() => Int)
    @Column({ type: 'int', default: 0 })
    views: number;

    @Field(() => Int)
    @Column({ type: 'int', default: 0 })
    likes: number;

    @Field()
    @Column({ default: true })
    isPublished: boolean;

    @Field(() => String, { nullable: true }) // Fecha en formato String
    @Column({ type: 'date', nullable: true })
    publishedDate: Date;

    @Field(() => [String], { nullable: true }) // Array de strings
    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => Author)
    @ManyToOne(() => Author, (author) => author.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: Author;

    @Field(() => Int)
    @Column()
    authorId: number;
}
```

¿Existe alguna diferencia entre poner `@Field` y `@Field(() => Tipo)`?
Sí, hay una diferencia importante entre usar `@Field()` y `@Field(() => Tipo)` en los decoradores de GraphQL en NestJS:

- `@Field()`: Se utiliza para campos que son de **tipos primitivos** como `String`, `Int`, `Float`, `Boolean`, etc. NestJS puede inferir automáticamente el tipo de datos basado en el tipo TypeScript del campo.
- `@Field(() => Tipo)`: Se utiliza cuando el campo es de un **tipo personalizado** o una clase que no es un tipo primitivo. Aquí, debes proporcionar una función que retorne el tipo para que NestJS pueda resolverlo correctamente.

Será tu trabajo definir los tipos GraphQL para las entidades restantes siguiendo un patrón similar.

## 5. Definición de Consultas y Mutaciones

En GraphQL, las **consultas (queries)** y **mutaciones (mutations)** se definen utilizando _resolvers_ en NestJS. Los resolvers son clases que contienen métodos que corresponden a las operaciones de consulta y mutación definidas en el esquema GraphQL _(como los Controllers en REST :3)_. Aquí te muestro cómo definir consultas y mutaciones para la entidad `Author`:


### 5.1 Definición de la clase Resolver

Para definir un resolver en NestJS, primero necesitas crear una clase decorada con `@Resolver()`. Dentro de esta clase, puedes definir métodos para las consultas y mutaciones utilizando los decoradores `@Query()` y `@Mutation()` respectivamente.

```typescript
import { Resolver } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
@Resolver(() => Author)
export class AuthorsResolver {
    constructor(private readonly authorsService: AuthorsService) {}
}
```

Y lo agregamos al módulo correspondiente:

```typescript
@Module({
    imports: [TypeOrmModule.forFeature([Author])],
    providers: [AuthorsService, AuthorsResolver], // <--- Aquí!
    exports: [AuthorsService, TypeOrmModule],
})
export class AuthorsModule {}
```

### 5.2 Definición de Consultas

Ahora sí pensemos en las consultas. Aprovechando que ya tenemos unos cuantos servicios creados, haremos las siguientes consultas:

- `authors`: Obtiene una lista de todos los autores.
- `author(id: ID!)`: Obtiene un autor por su ID.
- `authorByEmail(email: String!)`: Obtiene un autor por su email.
- `activeAuthors`: Obtiene una lista de autores activos.

```typescript
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';

@Resolver(() => Author) // Indica que este resolver maneja el tipo Author
export class AuthorsResolver { // <--- Aquí!
    constructor(private readonly authorsService: AuthorsService) {} // Inyecta el servicio de autores

    @Query(() => [Author], { name: 'authors', description: 'Get all authors' }) // Define una consulta llamada 'authors' que retorna una lista de Author
    findAll() {
        return this.authorsService.findAll();
    }

    @Query(() => Author, { name: 'author', description: 'Get author by ID' }) // Define una consulta llamada 'author' que retorna un Author por ID
    findOne(@Args('id', { type: () => ID }) id: number) {
        return this.authorsService.findOne(id);
    }

    @Query(() => Author, {
        name: 'authorByEmail',
        description: 'Get author by email',
    }) // Define una consulta llamada 'authorByEmail' que retorna un Author por email
    findByEmail(@Args('email') email: string) { // Recibe el email como argumento
        return this.authorsService.findByEmail(email);
    }

    @Query(() => [Author], {
        name: 'activeAuthors',
        description: 'Get all active authors',
    }) // Define una consulta llamada 'activeAuthors' que retorna una lista de autores activos
    findActive() {
        return this.authorsService.getActiveAuthors();
    }
}
```

¡Ahora es momento de probar! Puedes iniciar tu servidor NestJS con `npm run start:dev` y acceder a la interfaz de GraphQL en `http://localhost:3000/graphql` (o el puerto que estés usando). Desde allí, puedes ejecutar las consultas definidas para verificar que todo funcione correctamente. Si configuraste el **sandbox de Apollo**, podrás usar esa interfaz para probar tus consultas y mutaciones de GraphQL de manera interactiva.

<img src="/img/apollo_sandbox.png" alt="Interfaz de GraphQL Sandbox" width="1000" />

Te explico a grandes rasgos la interfaz:

- **Panel de consultas**: Aquí es donde puedes escribir y ejecutar tus consultas y mutaciones de GraphQL.
- **Panel de resultados**: Muestra los resultados de las consultas y mutaciones que ejecutas.
- **Documentación del esquema**: A la derecha, puedes explorar el esquema GraphQL, ver los tipos disponibles, consultas, mutaciones y sus descripciones.

Te recomiendo que explores la documentación del esquema para familiarizarte con las operaciones disponibles y los tipos de datos que puedes consultar.

Aquí te dejo un ejemplo de consulta para obtener todos los autores:

```graphql
query {
  authors {
    id
    name
    email
    isActive
  }
}   
```

También puedes probar la consulta para obtener un autor por su ID:

```graphql
query {
  author(id: 1) {
    id
    name
    email
    isActive
  }
}
```

:::tip
Échale un vistazo a qué sucede si buscas un autor que no existe, por ejemplo con un ID muy alto. Te darás cuenta de cómo GraphQL maneja los errores.
:::

### 5.3 Definición de Mutaciones

Ya que tenemos las consultas listas, vamos a definir las mutaciones para **crear**, **actualizar** y **eliminar** autores. Aquí te muestro cómo hacerlo para la entidad `Author`:

```typescript
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';

@Resolver(() => Author)
export class AuthorsResolver {
    constructor(private readonly authorsService: AuthorsService) {}

    @Mutation(() => Author, { description: 'Create a new author' }) // Define una mutación para crear un nuevo autor
    createAuthor(
        @Args('firstName') firstName: string, // Argumento: nombre del autor
        @Args('lastName') lastName: string, // Argumento: apellido del autor
        @Args('email') email: string, // Argumento: email del autor
        @Args('bio', { nullable: true }) bio?: string, // Argumento opcional: biografía del autor
        @Args('country', { nullable: true }) country?: string, // Argumento opcional: país del autor
        @Args('birthDate', { nullable: true }) birthDate?: Date, // Argumento opcional: fecha de nacimiento del autor
    ) {
        return this.authorsService.create({
            firstName,
            lastName,
            email,
            bio,
            country,
            birthDate,
            isActive: true,
        });
    }

    @Mutation(() => Author, { description: 'Update an existing author' }) // Define una mutación para actualizar un autor existente
    updateAuthor(
        @Args('id', { type: () => ID }) id: number, // Argumento: ID del autor a actualizar
        @Args('firstName', { nullable: true }) firstName?: string,
        @Args('lastName', { nullable: true }) lastName?: string,
        @Args('email', { nullable: true }) email?: string,
        @Args('bio', { nullable: true }) bio?: string,
        @Args('country', { nullable: true }) country?: string,
        @Args('birthDate', { nullable: true }) birthDate?: Date,
        @Args('isActive', { nullable: true }) isActive?: boolean,
    ) {
        return this.authorsService.update(id, {
            firstName,
            lastName,
            email,
            bio,
            country,
            birthDate,
            isActive,
        });
    }

    @Mutation(() => Boolean, { description: 'Delete an author' }) // Define una mutación para eliminar un autor
    async removeAuthor(@Args('id', { type: () => ID }) id: number) { // Argumento: ID del autor a eliminar
        await this.authorsService.remove(id);
        return true;
    }
}
```

Uhh, nada mal, pero ¿en serio tengo que definir en cada mutación un montón de argumentos? ¿No puedo crear un DTO de entrada o algo así?
Sí, definitivamente puedes (y _deberías_) usar **DTOs de entrada** para simplificar la definición de mutaciones en GraphQL con NestJS. Esto no solo hace que tu código sea más limpio y manejable, sino que también te permite reutilizar los mismos DTOs en diferentes partes de tu aplicación. Aquí te muestro cómo hacerlo:

### Uso de DTOs de Entrada para Mutaciones

Primero, crea un DTO de entrada para la creación y actualización de autores:

```typescript
import { InputType, Field } from '@nestjs/graphql';

@InputType() // Define un tipo de entrada GraphQL
export class CreateAuthorInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  birthDate?: Date;
}

@InputType() // Define un tipo de entrada GraphQL
export class UpdateAuthorInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  isActive?: boolean;
}
```

Y así podrías actualizar tu resolver para usar estos DTOs de entrada:

```typescript
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

@Resolver(() => Author)
export class AuthorsResolver {
    constructor(private readonly authorsService: AuthorsService) {}

    @Mutation(() => Author, { description: 'Create a new author' })
    createAuthor(
        @Args('createAuthorInput') createAuthorInput: CreateAuthorInput, // Usa el DTO de entrada
    ) {
        return this.authorsService.create({
            ...createAuthorInput,
            isActive: true,
        });
    }

    @Mutation(() => Author, { description: 'Update an existing author' })
    updateAuthor(
        @Args('id', { type: () => ID }) id: number,
        @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
    ) {
        return this.authorsService.update(id, updateAuthorInput);
    }

    @Mutation(() => Boolean, { description: 'Delete an author' })
    async removeAuthor(@Args('id', { type: () => ID }) id: number) {
        await this.authorsService.remove(id);
        return true;
    }
}
```

Con este enfoque, tus mutaciones son mucho más limpias y fáciles de mantener. Además, los DTOs de entrada te permiten validar y transformar los datos de entrada de manera más efectiva si es necesario.

¡Ahora a probar! Puedes probar las mutaciones en la interfaz de **GraphQL Sandbox**. Aquí tienes ejemplos de cómo se verían las mutaciones para crear, actualizar y eliminar un autor:

**Crear un nuevo autor:**

```graphql
mutation {
  createAuthor(createAuthorInput: { // Usa el DTO de entrada
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    bio: "Autor de tecnología",
    country: "Colombia",
    birthDate: "1985-06-15"
  }) { // Campos a retornar
    id
    firstName
    lastName
    email
    isActive
  }
}
```

**Actualizar un autor existente:**

```graphql
mutation {
  updateAuthor( // Mutación para actualizar un autor
    id: 1, // ID del autor a actualizar
    updateAuthorInput: { // Usa el DTO de entrada
      firstName: "Juan Carlos",
      isActive: false
    }
  ) { // Campos a retornar
    id
    firstName
    lastName
    email
    isActive
  }
}
```

**Eliminar un autor:**

```graphql
mutation {
  removeAuthor(id: 1) # ID del autor a eliminar
}
```

:::info
¡Ahora es tu momento de brillar! Implementa las mutaciones para la entidad `Post` siguiendo el mismo patrón que usamos para `Author`. Asegúrate de crear los DTOs de entrada necesarios y definir las mutaciones en el resolver correspondiente. ¡Buena suerte! 
(ʘ‿ʘ)ﾉ🌸 _"Hold my flower"_
:::

## 6. TODO

Ahora, la idea es que vayas _más allá_ de esta guía. ¡Haz un frontend sencillo en **React** o el framework que prefieras para consumir tu API GraphQL! Aquí te dejo algunos elementos que deberás implementar:

- Listar todos los autores y sus posts.
- Crear, actualizar y eliminar autores y posts desde el frontend.

No hay problema si usas IA para ayudarte con el frontend, lo importante es que logres consumir tu API GraphQL de manera efectiva usando **Apollo Client**.

:::warning
Si eres un estudiante de **Computación en Internet 3**, sí debes entregar este taller en tu repositorio de Github Classroom tanto el backend como el frontend. (ﾉ´ヮ´)ﾉ\*:･ﾟ✧
:::