---
sidebar_position: 2
---

# Guards, Passport y JSON Web Tokens (JWT)

Para implementar una capa de seguridad profesional en NestJS, es indispensable comprender cómo se integran tres piezas clave: el sistema nativo de **Guards**, la librería de autenticación **Passport** a través del patrón **Strategy**, y el estándar de tokens **JSON Web Tokens (JWT)**.

En esta guía analizaremos la función arquitectónica de los Guards en el ciclo de vida de NestJS, el desacoplamiento que ofrece el patrón Strategy y la anatomía criptográfica de un token JWT.

---

## 1. ¿Qué es un Guard en NestJS?

Un **Guard** (guardián) es una clase decorada con `@Injectable()` que implementa la interfaz `CanActivate`. Su única responsabilidad es determinar si una solicitud entrante tiene autorización para ser procesada por el método manejador (*route handler*) correspondiente.

<ZoomableMermaid value={`flowchart LR
    Req["HTTP Request"] --> Mid["Middlewares"]
    Mid --> G["Guards<br/>(CanActivate)"]
    G -->|true| Int1["Interceptors<br/>(Pre-controller)"]
    G -->|false / Excepción| Err["401 / 403 Response"]
    Int1 --> P["Pipes<br/>(Validación DTO)"]
    P --> C["Controlador<br/>(Handler)"]
    C --> Int2["Interceptors<br/>(Post-controller)"]
    Int2 --> Res["HTTP Response"]

    classDef guardStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef nestStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef errStyle fill:#fee2e2,stroke:#dc2626,stroke-width:1.5px,color:#7f1d1d;

    class G guardStyle;
    class Mid,Int1,P,C,Int2,Req,Res nestStyle;
    class Err errStyle;`} />

### Posición en el Ciclo de Vida

A diferencia de los Middlewares tradicionales de Express (que desconocen qué controlador o método se ejecutará a continuación), los Guards se ejecutan **después de los middlewares** pero **antes de los interceptores y pipes**.

Tienen acceso al objeto `ExecutionContext`, lo que les permite inspeccionar:
- El contexto de transporte (HTTP, WebSockets, Microservicios o GraphQL).
- El objeto de solicitud subyacente (`Request` de Express o Fastify).
- Los metadatos de la clase controladora y del método específico que va a ser ejecutado (mediante `Reflector`).

### La Interfaz `CanActivate`

Todo Guard debe declarar el método `canActivate`:

```typescript
export interface CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>;
}
```

- Si el método retorna `true`, la solicitud continúa su camino hacia los pipes e interceptores.
- Si retorna `false`, NestJS aborta la solicitud y devuelve automáticamente una respuesta HTTP `403 Forbidden`.
- Si el método arroja una excepción explícita (como `UnauthorizedException`), NestJS devuelve el código de estado correspondiente (HTTP `401`).

---

## 2. El Ecosistema Passport y el Patrón Strategy

**Passport** es el middleware de autenticación más popular y probado en el ecosistema Node.js. Su éxito radica en su diseño modular basado en el patrón de diseño **Strategy** (*Estrategia*).

### ¿Qué es el Patrón Strategy?

El patrón **Strategy** es un patrón de diseño del comportamiento que permite definir una familia de algoritmos, encapsular cada uno de ellos en una clase independiente y hacer que sus objetos sean intercambiables en tiempo de ejecución.

<ZoomableMermaid value={`classDiagram
    class AuthGuard {
        +canActivate(context)
    }

    class PassportStrategyBase {
        <<abstract>>
        +validate(...args)*
    }

    class LocalStrategy {
        +validate(username, password)
    }

    class JwtStrategy {
        +validate(payload)
    }

    class GoogleStrategy {
        +validate(accessToken, profile)
    }

    AuthGuard --> PassportStrategyBase : delega validación a
    PassportStrategyBase <|-- LocalStrategy : implementa
    PassportStrategyBase <|-- JwtStrategy : implementa
    PassportStrategyBase <|-- GoogleStrategy : implementa`} />

### ¿Cómo aplica NestJS el Patrón Strategy con Passport?

En lugar de mezclar la lógica de autenticación en los controladores o middlewares:
1. El paquete oficial `@nestjs/passport` expone la clase base `PassportStrategy`.
2. Creamos clases de estrategia dedicadas (como `JwtStrategy`) donde configuramos **cómo se extrae** el token (por ejemplo, desde la cabecera `Authorization: Bearer <token>`) y **cómo se valida**.
3. En los controladores, simplemente invocamos el guard genérico `AuthGuard('jwt')`. Si en el futuro cambiamos de mecanismo de autenticación o añadimos OAuth2, la estructura de los controladores permanece intacta.

---

## 3. Estructura y Funcionamiento de JSON Web Tokens (JWT) (RFC 7519)

Un **JSON Web Token (JWT)** es un estándar abierto definido en el RFC 7519 que establece una forma compacta y autónoma (*self-contained*) de transmitir información estructurada de forma segura entre distintas partes como un objeto JSON.

<img src="/img/desarrollo-entornos-digitales-web/jwt-anatomy-flow.svg" alt="Anatomía y ciclo de vida de un JWT" width="100%" />

### Anatomía de un Token JWT

Un token JWT consta de tres cadenas de texto separadas por puntos (`.`):

$$\text{JWT} = \text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$$

```text title="Ejemplo de Token JWT Codificado"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6ImFuYUBpY2VzaS5lZHUuY28ifQ.k7G_X9R7q0LwE58vY6pZaM1o9TuQeWd8xP
```

#### 1. Header (Encabezado)
Indica los metadatos del token: el tipo (`typ: "JWT"`) y el algoritmo criptográfico utilizado para generar la firma digital (por ejemplo, `alg: "HS256"` para HMAC con SHA-256 o `RS256` para claves pública/privada RSA).

```json title="Header Decodificado"
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload (Carga Útil o Claims)
Contiene las declaraciones (*claims*) sobre una entidad (usualmente el usuario autenticado) y datos de metadatos adicionales:

- **Claims Registrados (RFC 7519)**:
  - `sub` (*Subject*): Identificador único del usuario (por ejemplo, el ID primario en la base de datos).
  - `iat` (*Issued At*): Marca de tiempo epoch en la que fue emitido el token.
  - `exp` (*Expiration Time*): Marca de tiempo epoch a partir de la cual el token deja de ser válido.
- **Claims Públicos / Personalizados**:
  - Información no confidencial útil para la aplicación, como `email`, `role` o la lista de permisos `permissions`.

```json title="Payload Decodificado"
{
  "sub": 12,
  "email": "ana@icesi.edu.co",
  "permissions": ["users:read", "users:create"],
  "iat": 1773517905,
  "exp": 1773521505
}
```

:::caution[Los JWT NO son Cifrados]
El Header y el Payload están simplemente codificados en **Base64Url**, no cifrados. Cualquier persona o proxy que intercepte el token puede decodificarlo y leer su contenido de forma inmediata. **Nunca coloques contraseñas, claves privadas, números de tarjetas de crédito ni secretos dentro del Payload de un JWT.**
:::

#### 3. Signature (Firma Criptográfica)
La firma garantiza la **integridad** y la **autenticidad** del token. Se genera combinando el Header codificado, el Payload codificado y una clave secreta conocida únicamente por el servidor de backend (`JWT_SECRET`):

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

Si un atacante o cliente malicioso intenta modificar el `sub` o añadir un rol en el Payload, la firma calculada por el servidor dejará de coincidir con la firma presente en el token, rechazando la petición automáticamente.

---

## 4. Stateful vs. Stateless: ¿Por qué JWT?

La elección de JWT frente a sesiones tradicionales basadas en cookies impacta directamente la arquitectura y escalabilidad del servidor:

| Criterio | Sesiones Tradicionales (Stateful) | Tokens JWT (Stateless) |
| :--- | :--- | :--- |
| **Almacenamiento de Estado** | En memoria del servidor o en un almacén centralizado (Redis, DB). | En el cliente (almacenamiento local o cookies HttpOnly). |
| **Escalabilidad Horizontal** | Requiere servidores de sesión compartida (*sticky sessions* o clúster de Redis). | Excelente; cualquier réplica del backend con el mismo `JWT_SECRET` valida peticiones. |
| **Impacto en Memoria del Servidor** | Crece proporcionalmente con el número de usuarios conectados simultáneamente. | Casi nulo; el servidor no guarda registros de sesiones activas en memoria. |
| **Sobrecarga de Red (Payload Size)** | Muy baja (una cookie contiene solo un SessionID de pocos bytes). | Moderada (el token transporta claims, lo que aumenta el tamaño de los headers HTTP). |
| **Revocación Inmediata** | Inmediata (basta con eliminar la sesión en la base de datos o en Redis). | Desafiante (el token es válido hasta su fecha de expiración, a menos que se use una lista negra). |

---

## 5. Instalación del Ecosistema de Dependencias

Para implementar esta arquitectura en NestJS, instala las siguientes dependencias de producción y desarrollo:

```bash title="Terminal"
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install -D @types/passport-jwt
```

### Función de cada paquete:

1. **`@nestjs/passport`**: Módulo oficial que adapta Passport al contenedor de Inyección de Dependencias de NestJS y provee `PassportStrategy` y `AuthGuard`.
2. **`passport`**: Núcleo del middleware de autenticación para Node.js.
3. **`passport-jwt`**: Estrategia de Passport para extraer y verificar tokens JWT desde cabeceras HTTP (`Bearer <token>`).
4. **`@nestjs/jwt`**: Módulo utilitario de NestJS que encapsula la librería `jsonwebtoken` para firmar (`sign`) y verificar (`verify`) tokens de manera reactiva e inyectable.
5. **`@types/passport-jwt`**: Definiciones tipadas de TypeScript para autocompletado y validación de tipos estáticos en estrategias JWT.

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s7-02-guards-passport-jwt-quiz">
  <Question title="¿Cuál es la responsabilidad principal de un Guard en una aplicación NestJS?">
    <Option>Transformar y validar los datos de entrada del cuerpo de la petición mediante class-validator.</Option>
    <Option correct>Determinar si una solicitud entrante tiene permiso para acceder a un manejador de ruta específico antes de su ejecución.</Option>
    <Option>Capturar excepciones no controladas y transformarlas en respuestas JSON estandarizadas.</Option>
    <Option>Cifrar la carga útil de la respuesta HTTP antes de enviarla a la red.</Option>
  </Question>

  <Question title="¿Qué interfaz de TypeScript debe implementar obligatoriamente una clase para actuar como Guard en NestJS?">
    <Option>NestInterceptor</Option>
    <Option>PipeTransform</Option>
    <Option correct>CanActivate</Option>
    <Option>ConsumerProvider</Option>
  </Question>

  <Question title="En el ciclo de vida de una petición HTTP en NestJS, ¿en qué momento se ejecutan los Guards?">
    <Option>Inmediatamente después de que el controlador emite su respuesta.</Option>
    <Option>Antes de los middlewares globales de la aplicación.</Option>
    <Option correct>Después de los middlewares, pero antes de los interceptores y pipes asociados al controlador.</Option>
    <Option>Únicamente cuando se lanza una excepción de tipo 500.</Option>
  </Question>

  <Question title="¿Qué patrón de diseño del software emplea la librería Passport para permitir múltiples mecanismos de autenticación intercambiables?">
    <Option>Observer (Observador)</Option>
    <Option>Singleton</Option>
    <Option correct>Strategy (Estrategia)</Option>
    <Option>Abstract Factory</Option>
  </Question>

  <Question title="¿Cuáles son las tres partes que componen estructuralmente un token JWT de acuerdo con el estándar RFC 7519?">
    <Option>Username, PasswordHash y Salt.</Option>
    <Option>Protocol, Domain y QueryParams.</Option>
    <Option correct>Header (Encabezado), Payload (Carga Útil) y Signature (Firma Digital).</Option>
    <Option>ClientKey, SecretKey y Nonce.</Option>
  </Question>

  <Question title="¿Por qué está estrictamente desaconsejado almacenar contraseñas o secretos en el Payload de un token JWT?">
    <Option>Porque el compilador de TypeScript lanza un error de desbordamiento de memoria.</Option>
    <Option correct>Porque el Payload solo está codificado en Base64Url, no cifrado, por lo que cualquier entidad puede decodificarlo y leerlo.</Option>
    <Option>Porque los tokens JWT son firmados con algoritmos asimétricos no compatibles con texto alfanumérico.</Option>
    <Option>Porque la librería passport-jwt rechaza tokens que contengan más de tres propiedades.</Option>
  </Question>

  <Question title="¿Qué claim estándar de un JWT se utiliza por convención internacional (RFC 7519) para representar el identificador o sujeto del usuario?">
    <Option>usr</Option>
    <Option>id</Option>
    <Option correct>sub</Option>
    <Option>auth</Option>
  </Question>

  <Question title="¿Cuál es la función esencial de la firma digital (Signature) en un token JWT?">
    <Option>Ocultar el email del usuario para cumplir con las regulaciones de privacidad.</Option>
    <Option correct>Permitir al servidor verificar la autenticidad del token y comprobar que su contenido no fue alterado por terceros.</Option>
    <Option>Acelerar las consultas SQL generadas por TypeORM en la base de datos.</Option>
    <Option>Renovar automáticamente el token cada vez que el usuario navega por una página web.</Option>
  </Question>

  <Question title="¿Qué ventaja primordial ofrece una arquitectura de autenticación Stateless (JWT) frente a una arquitectura Stateful tradicional basada en sesiones?">
    <Option>Permite invalidar un token de forma inmediata sin necesidad de persistencia adicional.</Option>
    <Option>Elimina la necesidad de utilizar variables de entorno en el servidor.</Option>
    <Option correct>Facilita el escalado horizontal de réplicas de la API, ya que los servidores no requieren compartir memoria de sesión.</Option>
    <Option>Reduce el tamaño de las cabeceras HTTP a cero bytes.</Option>
  </Question>

  <Question title="¿Qué paquete oficial de NestJS proporciona la clase base PassportStrategy y el decorador AuthGuard?">
    <Option>@nestjs/core</Option>
    <Option>@nestjs/common</Option>
    <Option correct>@nestjs/passport</Option>
    <Option>@nestjs/jwt</Option>
  </Question>
</Quiz>
