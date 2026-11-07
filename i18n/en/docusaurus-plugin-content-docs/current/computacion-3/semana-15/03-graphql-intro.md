---
sidebar_position: 3
description: "Introduction to GraphQL: the problem it solves compared to REST, the schema and its types, queries and mutations, how it executes with resolvers, advantages, disadvantages and when to use it."
---

# Introduction to GraphQL

So far, your frontend asks the backend for data with **REST**: one endpoint per resource (`/users/1`, `/users/1/posts`) and a response with the shape the server decided. It works, but when a screen needs data from several resources, or only part of each one, problems appear. **GraphQL** proposes a different agreement between client and server: **the client describes exactly the data it needs and the server responds with that shape**.

In this document we will understand what GraphQL is and how it thinks. In the next session we will configure it in a NestJS application with Apollo Server.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

---

## 1. The problem it solves

A profile screen shows a user's name and the titles of their posts. See how many requests and how much data each approach needs; turn on «La pantalla también muestra los comentarios» (the screen also shows the comments) and watch what grows on each side:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/rest-vs-graphql/index.html"
  title="Comparison between REST and GraphQL for the same screen: how many requests they make and how many extra fields they receive"
  height={640}
/>

With REST two classic problems appear:

| Problem | What happens |
| :--- | :--- |
| **Over-fetching** (getting too much) | `GET /users/1` returns all of the user's fields even though the screen only uses the name. |
| **Under-fetching** (getting too little) | One endpoint is not enough: you have to chain requests (`/users/1`, then `/users/1/posts`, then the comments of each post). |

In addition, each different screen usually ends up asking for a new endpoint or a variant of an existing one. GraphQL moves that decision to the client.

:::note[Where it comes from]
GraphQL was created by Facebook in 2012 for its mobile applications, where every extra request costs battery and data. It was released as open source in 2015 and today it is maintained by the GraphQL Foundation.
:::

---

## 2. What GraphQL is (and what it is not)

- **It is a query language for APIs** and an **execution engine** that answers those queries with the data you already have.
- **It has a type system:** the server publishes a **schema** that describes what data exists and how it is related. The client can only ask for what the schema allows.
- **It normally has a single endpoint** (for example `/graphql`). The query travels in the body of an HTTP `POST` request as text, together with its variables.
- **It is not a database** or a replacement for one: it is a layer between your clients and your data (which can come from a database, from other APIs or from services).
- **It is not tied to a language or a framework:** there are servers in Node.js, Java, Python and more. We will use NestJS with Apollo Server.

---

## 3. The schema: the contract

The schema is written in a simple language, the **SDL** (*Schema Definition Language*). It defines the data **types** and the **entry points**:

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

Each object type has **fields**, and each field has a type and, sometimes, **arguments** (`user(id: ID!)`). The basic types (*scalars*) are `Int`, `Float`, `String`, `Boolean` and `ID`.

### Nullability and lists

By default, every field can be `null`. The `!` sign makes it **mandatory**: the server commits to never returning `null` in it. Square brackets indicate a list:

| Type | Means |
| :--- | :--- |
| `String` | A text, or `null`. |
| `String!` | A text, always. |
| `[String]` | A list that can be `null`, and its elements too. |
| `[String!]` | A list that can be `null`, but without `null` elements. |
| `[String]!` | A list that is always present, with elements that can be `null`. |
| `[String!]!` | A list that is always present and without `null` elements. |

### The root types

Three special types are the **entry doors**: everything a client can do starts at one of them.

| Root type | What for | Operation |
| :--- | :--- | :--- |
| `Query` | **Read** data. | `query` |
| `Mutation` | **Write**: create, update or delete. | `mutation` |
| `Subscription` | Receive data **in real time** when something changes. | `subscription` |

There are also `enum`s (a fixed set of values), `input`s (objects sent as an argument, for example when creating something), and `interface`s and `union`s for related types.

---

## 4. Queries and mutations

A query looks like a JSON without values: you write the shape you want and the response has **exactly that shape**. Go through its parts, or hover over the code or the response:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-consulta/index.html"
  title="Anatomy of a GraphQL query: operation, name, variables, root field, arguments, fields and nested fields, linked to the JSON response they produce"
  height={880}
/>

The HTTP request the client sends carries the query, its variables and, optionally, the operation name:

```json title="POST /graphql" showLineNumbers
{
  "query": "query ObtenerUsuario($id: ID!) { user(id: $id) { name posts(last: 3) { title } } }",
  "variables": { "id": "1" },
  "operationName": "ObtenerUsuario"
}
```

A **mutation** has the same shape, but it writes. It also asks for fields back: that way the client receives the created data in the same response, without an additional query:

```graphql title="A mutation" showLineNumbers
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

Two more tools you will see in the sandbox:

- **Aliases:** they rename a field in the response, and let you ask for the same field twice with different arguments (`colombia: country(code: "CO")`, `peru: country(code: "PE")`).
- **Fragments:** a named group of fields that is reused in several parts of the query.

:::note[Queries in parallel, mutations in order]
The fields of a query can be resolved in parallel. The fields of a mutation **run one after another**, in the order you wrote them, because they could depend on each other.
:::

---

## 5. How a query is executed

The server follows three steps with each request:

1. **Parses and validates** the query against the schema. If you ask for a field that does not exist or with the wrong type, it is rejected **before running anything**.
2. **Executes:** each field is resolved with its own function, a **resolver**. The `Query` resolvers fetch the starting data (from a database, from another API) and the resolvers of the nested fields complete the rest.
3. **Responds** with a JSON that has the same shape as the query.

Choose what the client asks for and see how the server validates and responds. The last option asks for a field that does not exist:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/pide-lo-que-necesitas/index.html"
  title="How the GraphQL server validates the query against the schema, resolves only the requested fields and returns a response with the same shape, or an error if a field that does not exist is requested"
  height={520}
/>

### Errors in GraphQL

A GraphQL response has up to two keys: `data` and `errors`. If a field fails, not everything is lost: `data` carries what could be resolved and `errors` explains what failed and where.

```json title="A server's response to a nonexistent field" showLineNumbers
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

:::warning[The HTTP code is not enough]
Many GraphQL servers respond `200 OK` even when the response carries `errors`. In a client you must always check the response body, not just the status code.
:::

---

## 6. Introspection and tools

A GraphQL server **describes itself**: you can ask it for its own schema with special fields such as `__schema` and `__type`. It is called **introspection**, and it is what lets tools autocomplete, validate and show the documentation without anyone writing it separately.

```graphql title="Ask the server about its types" showLineNumbers
query {
  __type(name: "Country") {
    fields {
      name
    }
  }
}
```

Graphical tools rely on that. The two most used are **Apollo Sandbox** and **GraphiQL**: an editor with autocompletion, a panel with the schema documentation, variables and a query history.

### Practice: explore a public API

Go to [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer), enter this address as the endpoint, `https://countries.trevorblades.com/graphql`, and try:

1. **Explore the schema.** Open the documentation panel and look at the fields of `Country`.
2. **A query with nesting:**

```graphql title="Countries of South America" showLineNumbers
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

3. **Variables.** Change the country without touching the query text (in the variables panel: `{ "code": "CO" }`):

```graphql title="A query with a variable" showLineNumbers
query Pais($code: ID!) {
  country(code: $code) {
    name
    capital
    phone
  }
}
```

4. **Aliases.** Compare two countries in a single query:

```graphql title="Two countries in one query" showLineNumbers
query {
  colombia: country(code: "CO") { name capital }
  peru: country(code: "PE") { name capital }
}
```

5. **Cause an error.** Ask for a field that does not exist (for example `poblacion`) and read the message.

:::tip[If Apollo Sandbox does not open]
Any GraphQL client works for the exercise. You can also send the query with `curl` to that same address, with a `POST` and the JSON body from section 4.
:::

---

## 7. Advantages and disadvantages

| | Advantages | Disadvantages |
| :--- | :--- | :--- |
| **Data** | The client asks for exactly what it needs: no extra fields or chained requests. | A query can be **very expensive** if it is not limited (lists inside lists, with no cap). |
| **Contract** | The typed schema **documents itself**; errors are detected on validation. | The server is more complex: you have to write and maintain the schema and the resolvers. |
| **Evolution** | You can add fields without breaking anyone and mark old ones as `@deprecated`: there is no need to version the API (`/v1`, `/v2`). | Removing a field still breaks the clients that use it. |
| **One endpoint** | A single entry for everything; frontend teams move forward without waiting for new endpoints. | The usual **HTTP cache** (by URL) works worse: all requests go to the same endpoint. |
| **Performance** | Fewer requests and less data over the network. | The **N+1** problem on the server (see below). |
| **Operation** | Very good tools (sandbox, autocompletion, type generation). | Monitoring is harder: everything is `POST /graphql` and almost everything returns `200`. |

### The N+1 problem

It is the most famous disadvantage. When you ask for a list and, for each element, a relation, one resolver per element can cause **one database query for each one**: 1 for the list and N for the relations. Change the number of users and turn on the DataLoader to see how they are grouped:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/n-mas-uno/index.html"
  title="The N+1 problem in GraphQL: with N users, 1 plus N database queries are made, and with a DataLoader only 2"
  height={540}
/>

It is solved by **batching**: a *DataLoader* collects the requests of the same round and makes a single query with all the ids. We will see it when configuring the server.

### Best practices, in a list

- **Limit queries:** maximum depth, estimated cost and execution time, so nobody can ask for «everything inside everything».
- **Paginate lists:** do not return collections with no cap.
- **Authenticate and authorize on the server,** field by field if needed: the schema describes what can be asked for, not by whom.
- **Consider disabling introspection in production** if the API is only for your own applications: it reduces the attack surface.
- **Use nullability on purpose:** a `String!` field that fails nullifies its parent. Mark it mandatory only if it really always exists.

---

## 8. GraphQL or REST?

It is not a question of «which is better», but of what problem you have:

| GraphQL fits when… | REST fits when… |
| :--- | :--- |
| There are **several clients** (web, mobile) with different data needs. | The API is simple and the resources are few and stable. |
| Screens combine data from **many** related resources. | You make heavy use of the **HTTP cache** and CDNs. |
| The frontend changes fast and does not want to wait for new endpoints. | The team needs something simple to operate and monitor. |
| You want a typed contract that is documented automatically. | You upload and download large files frequently. |

They are not mutually exclusive either: it is common for an application to use REST for some things and GraphQL for others.

---

## What's next?

You now know how GraphQL thinks. In the next session we will **configure** it in a NestJS application with Apollo Server: we install the packages, define the schema and the resolvers, reuse the services and entities we already have, and test everything in the sandbox.

## Further Reading

- [GraphQL: Learn](https://graphql.org/learn/)
- [GraphQL: Schemas and Types](https://graphql.org/learn/schema/)
- [GraphQL: Queries](https://graphql.org/learn/queries/)
- [GraphQL: Mutations](https://graphql.org/learn/mutations/)
- [GraphQL: Execution](https://graphql.org/learn/execution/)
- [GraphQL: Introspection](https://graphql.org/learn/introspection/)
- [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer)
- [Public countries API (the one for the exercise)](https://countries.trevorblades.com/)
