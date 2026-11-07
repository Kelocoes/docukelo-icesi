# Plan: documento «GraphQL con NestJS y Apollo» (Computación 3, semana 16)

Memlog para escribir el segundo documento de GraphQL sin repetir la investigación. El primero (`docs/computacion-3/semana-15/03-graphql-intro.md`, en la semana 15 por decisión del profesor) ya existe y explica qué es GraphQL; este es el de **configuración**. Archivo a crear: `docs/computacion-3/semana-16/01-graphql-nestjs-apollo.md` (`sidebar_position: 1`; hay que crear también `semana-16/_category_.json`, «S16 - GraphQL con NestJS», `position: 16`), con su traducción en `i18n/en/` cuando se cierre todo.

## Lo que el profesor pidió (2026-11-07)

- Configurar GraphQL en una app de **NestJS con Apollo Server**; el IDE debe ser el **Apollo Sandbox**.
- La sesión 1 (hecha) es de entendimiento y explicación; esta es de configuración.
- Piezas interactivas en cada apartado (como en la semana 15); código explicado, poco texto.

## Lo que se verificó (2026-11-07, repos oficiales; Context7 falló ese día y después volvió a responder)

Versiones en npm ese día: `@nestjs/graphql` **14.2.0**, `@nestjs/apollo` **14.2.0**, `@apollo/server` **5.5.1**, `graphql` **17.1.0** (peer `^16.10.0 || ^17`), `@nestjs/core` **12.4.0**, `dataloader` **2.2.3**. Peer de `@nestjs/apollo` 14: `@nestjs/core ^12`, `@apollo/server ^5`, `@as-integrations/express5 ^1.1.2` (o `@as-integrations/fastify`).

**Decisión pendiente (la primera tarea):** ¿qué versión de NestJS usa el curso? Los documentos de las semanas 5 a 7 no la fijan (`nest new`). `@nestjs/graphql` 14 exige Nest 12. Si el proyecto del curso es Nest 10 u 11, hay que usar `@nestjs/graphql` y `@nestjs/apollo` 12 o 13 con `@apollo/server` 4, y los nombres de opciones cambian (en esas versiones existía `playground`). Comprobar con `npm ls @nestjs/core` en el repositorio del curso antes de escribir.

Instalación (guía oficial «quick start», Express):

```bash
npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql
```

Módulo (code first; el schema se genera desde las clases):

```ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // o `true` para generarlo solo en memoria
  context: ({ req, res }) => ({ req, res }),             // para guards y resolvers
})
```

**Apollo Sandbox (lo que pidió el profesor).** En `@nestjs/graphql` 14 el IDE por defecto es **GraphiQL** (`graphql-playground` se eliminó; con el driver de Apollo está activo si `NODE_ENV !== 'production'`; la opción `playground` quedó como alias deprecado de `graphiql`). Para usar Apollo Sandbox, según la guía oficial:

```ts
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  graphiql: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
})
```

Si la app usa Helmet, Apollo Sandbox carga scripts, imágenes y un iframe desde la CDN de Apollo y la política de seguridad de contenido (CSP) los bloquea: hay que permitir `https://embeddable-sandbox.cdn.apollographql.com` (scripts), `https://apollo-server-landing-page.cdn.apollographql.com` (imágenes y manifest) y `https://sandbox.embed.apollographql.com` (frames). Confirmado con Context7 (`/nestjs/docs.nestjs.com`, páginas de quick-start y de helmet).

Resolvers (decoradores de `@nestjs/graphql`): `@Resolver(() => Author)`, `@Query(() => Author)`, `@Args('id', { type: () => Int })`, `@ResolveField()` + `@Parent()` (hay que pasar el tipo a `@Resolver` cuando hay field resolvers), `@Mutation(() => Post)` y `@InputType()` + `@Field()` para los argumentos de objeto. Guards e interceptores acceden al contexto con `GqlExecutionContext.create(context).getContext()`.

Fuentes leídas: `nestjs/docs.nestjs.com` (`content/graphql/quick-start.md`, `resolvers-map.md`, `mutations.md`) en GitHub. Volver a verificar versiones y nombres de opciones antes de escribir: cambian rápido.

## Esquema de contenido propuesto

1. **Qué vamos a construir:** el mismo schema del documento de introducción (`User`, `Post`, `Query`, `Mutation`) sobre las entidades y servicios de la semana 5 (TypeORM). Pieza: arquitectura de una petición (Apollo -> resolver -> servicio -> base de datos), con `DK.layers` o `DK.canvas`.
2. **Instalar y configurar:** paquetes, `GraphQLModule.forRoot`, code first frente a schema first (tabla), el archivo `schema.gql` generado. Pieza: `DK.codemap` con la configuración enlazada con lo que produce (el schema generado y el Sandbox).
3. **Object types desde clases:** `@ObjectType`, `@Field`, `@InputType`; mapear entidades de TypeORM (una sola clase puede ser `@Entity` y `@ObjectType`, o separar DTO). Pieza: `DK.codemap` de la clase y el SDL que genera.
4. **Resolvers:** `@Query`, `@Mutation`, `@Args`, inyección del servicio; `@ResolveField` para relaciones. Pieza: `DK.codemap` o `DK.canvas` con selector (qué consulta -> qué resolver se ejecuta).
5. **Probar en Apollo Sandbox:** abrir `/graphql`, explorar el schema, ejecutar consultas y mutaciones, variables. Es el equivalente práctico del ejercicio con la API de países del documento 1.
6. **Validación y errores:** `ValidationPipe` global funciona con `@InputType` + `class-validator` (semana 6); excepciones de Nest se convierten en `errors` de GraphQL.
7. **Seguridad:** `JwtAuthGuard` de la semana 7 adaptado con `GqlExecutionContext`; `context` con `req`; límites de profundidad y desactivar la introspección en producción. Pieza: reutilizar `DK.layers` de guards.
8. **N+1 y DataLoader:** el problema de la pieza `n-mas-uno` del documento 1, ahora con `dataloader` en un resolver real. Pieza: reutilizar la del documento 1 o hacer una versión con código.
9. **Cliente (opcional):** consumir el API desde Next.js con `fetch` o Apollo Client; probablemente para otra sesión.

Preguntas abiertas para el profesor: ¿code first o schema first? (la guía de NestJS ofrece los dos; code first es lo natural con TypeORM y decoradores); ¿se usa Express o Fastify?; ¿se mezcla con los controladores REST del mismo proyecto o se crea uno aparte?

## Convenciones y enlaces

- Piezas nuevas en `static/interactive/computacion-3/semana-16/<slug>/`. Las del documento 1 ya existen en `static/interactive/computacion-3/semana-15/` (`rest-vs-graphql`, `anatomia-consulta`, `pide-lo-que-necesitas` y `n-mas-uno`) y se pueden reutilizar desde el documento 2 con su ruta de la semana 15. Seguir la skill `.agents/skills/docusaurus_animated_diagrams/` y `npm run test:pieces -- computacion-3/semana-16`.
- Ejemplo fijo del curso: usuario `ana@icesi.edu.co`, rutinas (`/routines`); en GraphQL conviene mantener `User` y `Post` como en el documento 1.
- API pública para los ejercicios sin servidor propio: `https://countries.trevorblades.com/graphql` (verificada el 2026-11-07).
