---
sidebar_position: 3
description: "Introducción a GraphQL: el problema que resuelve frente a REST, el schema y sus tipos, consultas y mutaciones, cómo se ejecuta con resolvers, ventajas, desventajas y cuándo usarlo."
---

# Introducción a GraphQL

Hasta ahora, tu frontend le pide datos al backend con **REST**: un endpoint por recurso (`/users/1`, `/users/1/posts`) y una respuesta con la forma que decidió el servidor. Funciona, pero cuando una pantalla necesita datos de varios recursos, o solo una parte de cada uno, aparecen los problemas. **GraphQL** propone otro acuerdo entre cliente y servidor: **el cliente describe exactamente los datos que necesita y el servidor responde con esa forma**.

En este documento entenderemos qué es GraphQL y cómo piensa. En la siguiente sesión lo configuraremos en una aplicación NestJS con Apollo Server.

---

## 1. El problema que resuelve

Una pantalla de perfil muestra el nombre de un usuario y los títulos de sus posts. Mira cuántas peticiones y cuántos datos necesita cada enfoque; activa «La pantalla también muestra los comentarios» y observa qué crece en cada lado:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/rest-vs-graphql/index.html"
  title="Comparación entre REST y GraphQL para una misma pantalla: cuántas peticiones hacen y cuántos campos de sobra reciben"
  height={640}
/>

Con REST aparecen dos problemas clásicos:

| Problema | Qué ocurre |
| :--- | :--- |
| **Over-fetching** (traer de más) | `GET /users/1` devuelve todos los campos del usuario aunque la pantalla solo use el nombre. |
| **Under-fetching** (traer de menos) | Un endpoint no alcanza: hay que encadenar peticiones (`/users/1`, luego `/users/1/posts`, luego los comentarios de cada post). |

Además, cada pantalla distinta suele terminar pidiendo un endpoint nuevo o una variante del existente. GraphQL mueve esa decisión al cliente.

:::note[De dónde viene]
GraphQL lo creó Facebook en 2012 para sus aplicaciones móviles, donde cada petición de más cuesta batería y datos. Se liberó como código abierto en 2015 y hoy lo mantiene la GraphQL Foundation.
:::

---

## 2. Qué es (y qué no es) GraphQL

- **Es un lenguaje de consulta para APIs** y un **motor de ejecución** que responde esas consultas con los datos que ya tienes.
- **Tiene un sistema de tipos:** el servidor publica un **schema** que describe qué datos existen y cómo se relacionan. El cliente solo puede pedir lo que el schema permite.
- **Normalmente tiene un solo endpoint** (por ejemplo `/graphql`). La consulta viaja en el cuerpo de una petición HTTP `POST` como texto, junto con sus variables.
- **No es una base de datos** ni un reemplazo de ella: es una capa entre tus clientes y tus datos (que pueden venir de una base de datos, de otras APIs o de servicios).
- **No está atado a un lenguaje ni a un framework:** hay servidores en Node.js, Java, Python y más. Nosotros usaremos NestJS con Apollo Server.

---

## 3. El schema: el contrato

El schema se escribe en un lenguaje sencillo, el **SDL** (*Schema Definition Language*). Define los **tipos** de datos y los **puntos de entrada**:

```graphql title="schema.graphql" showLineNumbers
type User {
  id: ID!
  name: String!
  email: String!
  posts(last: Int): [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createPost(userId: ID!, title: String!): Post!
}
```

Cada tipo de objeto tiene **campos**, y cada campo tiene un tipo y, a veces, **argumentos** (`user(id: ID!)`). Los tipos básicos (*scalars*) son `Int`, `Float`, `String`, `Boolean` e `ID`.

### Nulabilidad y listas

Por defecto, todo campo puede ser `null`. El signo `!` lo vuelve **obligatorio**: el servidor se compromete a nunca devolver `null` en él. Los corchetes indican una lista:

| Tipo | Significa |
| :--- | :--- |
| `String` | Un texto, o `null`. |
| `String!` | Un texto, siempre. |
| `[String]` | Una lista que puede ser `null`, y sus elementos también. |
| `[String!]` | Una lista que puede ser `null`, pero sin elementos `null`. |
| `[String]!` | Una lista siempre presente, con elementos que pueden ser `null`. |
| `[String!]!` | Una lista siempre presente y sin elementos `null`. |

### Los tipos raíz

Tres tipos especiales son las **puertas de entrada**: todo lo que un cliente puede hacer empieza en uno de ellos.

| Tipo raíz | Para qué | Operación |
| :--- | :--- | :--- |
| `Query` | **Leer** datos. | `query` |
| `Mutation` | **Escribir**: crear, actualizar o borrar. | `mutation` |
| `Subscription` | Recibir datos **en tiempo real** cuando algo cambia. | `subscription` |

Además existen los `enum` (un conjunto fijo de valores), los `input` (objetos que se envían como argumento, por ejemplo al crear algo), y las `interface` y `union` para tipos relacionados.

---

## 4. Consultas y mutaciones

Una consulta se parece a un JSON sin valores: escribes la forma que quieres y la respuesta tiene **exactamente esa forma**. Recorre sus partes, o pasa el mouse por el código o por la respuesta:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-consulta/index.html"
  title="Anatomía de una consulta de GraphQL: operación, nombre, variables, campo raíz, argumentos, campos y campos anidados, enlazados con la respuesta JSON que producen"
  height={880}
/>

La petición HTTP que envía el cliente lleva la consulta, sus variables y, opcionalmente, el nombre de la operación:

```json title="POST /graphql" showLineNumbers
{
  "query": "query ObtenerUsuario($id: ID!) { user(id: $id) { name posts(last: 3) { title } } }",
  "variables": { "id": "1" },
  "operationName": "ObtenerUsuario"
}
```

Una **mutación** tiene la misma forma, pero escribe. Pide también campos de vuelta: así el cliente recibe en la misma respuesta el dato ya creado, sin una consulta adicional:

```graphql title="Una mutación" showLineNumbers
mutation NuevoPost($userId: ID!, $title: String!) {
  createPost(userId: $userId, title: $title) {
    id
    title
    author {
      name
    }
  }
}
```

Dos herramientas más que verás en el sandbox:

- **Alias:** renombran un campo en la respuesta, y permiten pedir el mismo campo dos veces con argumentos distintos (`colombia: country(code: "CO")`, `peru: country(code: "PE")`).
- **Fragmentos:** un grupo de campos con nombre que se reutiliza en varias partes de la consulta.

:::note[Queries en paralelo, mutations en orden]
Los campos de una consulta pueden resolverse en paralelo. Los campos de una mutación **se ejecutan uno tras otro**, en el orden en que los escribiste, porque podrían depender entre sí.
:::

---

## 5. Cómo se ejecuta una consulta

El servidor sigue tres pasos con cada petición:

1. **Analiza y valida** la consulta contra el schema. Si pides un campo que no existe o con el tipo equivocado, se rechaza **antes de ejecutar nada**.
2. **Ejecuta:** cada campo se resuelve con una función propia, un **resolver**. Los resolvers de `Query` traen el dato de partida (de una base de datos, de otra API) y los resolvers de los campos anidados completan el resto.
3. **Responde** con un JSON que tiene la misma forma que la consulta.

Elige qué pide el cliente y mira cómo valida y responde el servidor. La última opción pide un campo que no existe:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/pide-lo-que-necesitas/index.html"
  title="Cómo el servidor GraphQL valida la consulta contra el schema, resuelve solo los campos pedidos y devuelve una respuesta con la misma forma, o un error si se pide un campo que no existe"
  height={520}
/>

### Los errores en GraphQL

La respuesta de GraphQL tiene hasta dos claves: `data` y `errors`. Si un campo falla, no se pierde todo: `data` trae lo que sí se pudo resolver y `errors` explica qué falló y dónde.

```json title="Respuesta de un servidor ante un campo inexistente" showLineNumbers
{
  "errors": [
    {
      "message": "Cannot query field \"poblacion\" on type \"Country\".",
      "locations": [{ "line": 4, "column": 5 }],
      "extensions": { "code": "GRAPHQL_VALIDATION_FAILED" }
    }
  ]
}
```

:::warning[El código HTTP no basta]
Muchos servidores GraphQL responden `200 OK` aunque la respuesta traiga `errors`. En un cliente hay que revisar siempre el cuerpo de la respuesta, no solo el código de estado.
:::

---

## 6. Introspección y herramientas

Un servidor GraphQL **se describe a sí mismo**: puedes consultarle su propio schema con campos especiales como `__schema` y `__type`. Se llama **introspección**, y es lo que permite que las herramientas autocompleten, validen y muestren la documentación sin que nadie la escriba aparte.

```graphql title="Preguntarle al servidor por sus tipos" showLineNumbers
query {
  __type(name: "Country") {
    fields {
      name
    }
  }
}
```

Las herramientas gráficas se apoyan en eso. Las dos más usadas son **Apollo Sandbox** y **GraphiQL**: un editor con autocompletado, un panel con la documentación del schema, variables y el historial de consultas.

### Practica: explora una API pública

Entra a [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer), escribe esta dirección como endpoint, `https://countries.trevorblades.com/graphql`, y prueba:

1. **Explora el schema.** Abre el panel de documentación y mira los campos de `Country`.
2. **Una consulta con anidación:**

```graphql title="Países de Suramérica" showLineNumbers
query PaisesDeSuramerica {
  continent(code: "SA") {
    name
    countries {
      name
      capital
      currency
    }
  }
}
```

3. **Variables.** Cambia el país sin tocar el texto de la consulta (en el panel de variables: `{ "code": "CO" }`):

```graphql title="Una consulta con variable" showLineNumbers
query Pais($code: ID!) {
  country(code: $code) {
    name
    capital
    phone
  }
}
```

4. **Alias.** Compara dos países en una sola consulta:

```graphql title="Dos países en una consulta" showLineNumbers
query {
  colombia: country(code: "CO") { name capital }
  peru: country(code: "PE") { name capital }
}
```

5. **Provoca un error.** Pide un campo que no existe (por ejemplo `poblacion`) y lee el mensaje.

:::tip[Si Apollo Sandbox no abre]
Cualquier cliente de GraphQL sirve para el ejercicio. También puedes enviar la consulta con `curl` a esa misma dirección, con un `POST` y el cuerpo JSON de la sección 4.
:::

---

## 7. Ventajas y desventajas

| | Ventajas | Desventajas |
| :--- | :--- | :--- |
| **Datos** | El cliente pide exactamente lo que necesita: sin campos de sobra ni peticiones encadenadas. | La consulta puede ser **muy costosa** si no se limita (pedir listas dentro de listas, sin tope). |
| **Contrato** | El schema tipado se **documenta solo**; los errores se detectan al validar. | El servidor es más complejo: hay que escribir y mantener schema y resolvers. |
| **Evolución** | Puedes agregar campos sin romper a nadie y marcar los viejos como `@deprecated`: no hace falta versionar la API (`/v1`, `/v2`). | Quitar un campo sigue rompiendo a los clientes que lo usan. |
| **Un endpoint** | Una sola entrada para todo; los equipos de frontend avanzan sin esperar endpoints nuevos. | La **caché HTTP** de siempre (por URL) funciona peor: todas las peticiones van al mismo endpoint. |
| **Rendimiento** | Menos peticiones y menos datos por la red. | El problema **N+1** en el servidor (ver abajo). |
| **Operación** | Herramientas muy buenas (sandbox, autocompletado, generación de tipos). | Monitorear es más difícil: todo es `POST /graphql` y casi todo devuelve `200`. |

### El problema N+1

Es la desventaja más famosa. Cuando pides una lista y, para cada elemento, una relación, un resolver por elemento puede provocar **una consulta a la base de datos por cada uno**: 1 para la lista y N para las relaciones. Cambia el número de usuarios y activa el DataLoader para ver cómo se agrupan:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/n-mas-uno/index.html"
  title="El problema N+1 en GraphQL: con N usuarios se hacen 1 más N consultas a la base de datos, y con un DataLoader solo 2"
  height={540}
/>

Se resuelve **agrupando**: un *DataLoader* junta los pedidos de la misma ronda y hace una sola consulta con todos los ids. Lo veremos en la configuración del servidor.

### Buenas prácticas, en una lista

- **Limita las consultas:** profundidad máxima, costo estimado y tiempo de ejecución, para que nadie pueda pedir «todo dentro de todo».
- **Pagina las listas:** no devuelvas colecciones sin tope.
- **Autentica y autoriza en el servidor,** campo por campo si hace falta: el schema describe qué se puede pedir, no quién puede.
- **Valora desactivar la introspección en producción** si la API es solo para tus propias aplicaciones: reduce la superficie de ataque.
- **Usa nulabilidad con intención:** un campo `String!` que falla anula a su padre. Márcalo obligatorio solo si de verdad siempre existe.

---

## 8. ¿GraphQL o REST?

No es una pregunta de «cuál es mejor», sino de qué problema tienes:

| Conviene GraphQL cuando… | Conviene REST cuando… |
| :--- | :--- |
| Hay **varios clientes** (web, móvil) con necesidades de datos distintas. | La API es simple y los recursos son pocos y estables. |
| Las pantallas combinan datos de **muchos recursos** relacionados. | Aprovechas la **caché HTTP** y los CDN de manera intensiva. |
| El frontend cambia rápido y no quiere esperar endpoints nuevos. | El equipo necesita algo sencillo de operar y monitorear. |
| Quieres un contrato tipado y documentado automáticamente. | Subes y descargas archivos grandes con frecuencia. |

Tampoco son excluyentes: es común que una aplicación use REST para unas cosas y GraphQL para otras.

---

## ¿Qué sigue?

Ya sabes cómo piensa GraphQL. En la próxima sesión lo **configuramos** en una aplicación de NestJS con Apollo Server: instalamos los paquetes, definimos el schema y los resolvers, reutilizamos los servicios y las entidades que ya tenemos, y probamos todo en el sandbox.

## Further Reading

- [GraphQL: Learn](https://graphql.org/learn/)
- [GraphQL: Schemas and Types](https://graphql.org/learn/schema/)
- [GraphQL: Queries](https://graphql.org/learn/queries/)
- [GraphQL: Mutations](https://graphql.org/learn/mutations/)
- [GraphQL: Execution](https://graphql.org/learn/execution/)
- [GraphQL: Introspection](https://graphql.org/learn/introspection/)
- [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer)
- [API pública de países (la del ejercicio)](https://countries.trevorblades.com/)
