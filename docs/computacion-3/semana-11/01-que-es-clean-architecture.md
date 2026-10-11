---
sidebar_position: 1
---

# ¿Qué es Clean Architecture?

Antes de escribir una sola línea de código, conviene entender **la idea**. Clean Architecture no es una carpeta ni una librería: es una forma de decidir **qué parte del software puede depender de qué otra**. En esta lección veremos qué es, qué problema resuelve, qué busca, qué propone y cuáles son sus partes.

:::note[Resumen en una frase]
Clean Architecture propone que las **reglas de negocio** vivan en el centro del sistema y que todo lo demás (interfaz, base de datos, frameworks, APIs) sea un **detalle intercambiable** que depende del centro, nunca al revés.
:::

---

## 1. Definición y origen

**Clean Architecture** (Arquitectura Limpia) es un estilo de organización del software propuesto por **Robert C. Martin**, conocido como *Uncle Bob*, en un artículo publicado en 2012 y desarrollado ampliamente en su libro *Clean Architecture: A Craftsman's Guide to Software Structure and Design* (2017).

No parte de cero. Es una **síntesis** de ideas anteriores que perseguían el mismo objetivo: separar lo que es importante para el negocio de lo que es una herramienta.

![Línea de tiempo: Hexagonal, Onion y Clean Architecture](/img/computacion-3/clean-arch-origins-timeline.svg)

| Propuesta | Autor | Aporte principal |
|:---|:---|:---|
| **Arquitectura Hexagonal** (Ports and Adapters) | Alistair Cockburn, 2005 | La aplicación se comunica con el exterior por **puertos** y **adaptadores** reemplazables. |
| **Onion Architecture** | Jeffrey Palermo, 2008 | Capas **concéntricas** con el dominio en el centro y dependencias hacia adentro. |
| **Clean Architecture** | Robert C. Martin, 2012 | Unifica las anteriores y formaliza la **Regla de Dependencia** con cuatro círculos. |

---

## 2. ¿Qué problema resuelve?

El software cambia constantemente: se reemplaza el framework, se rediseña la interfaz, se migra de base de datos, el backend cambia su API. Cuando la lógica de negocio está **mezclada** con esas herramientas, cada cambio externo obliga a reescribir código que, conceptualmente, no debería haber cambiado.

Martin lo resume distinguiendo dos tipos de código:

- **Políticas**: lo que el sistema *hace* y por qué importa al negocio (validar un ejercicio, calcular un precio, decidir un permiso). Cambian poco y despacio.
- **Detalles**: *cómo* se muestra o se guarda (React, Next.js, PostgreSQL, `fetch`). Cambian rápido y con frecuencia.

El problema aparece cuando las políticas **dependen** de los detalles. La solución es invertir esa relación.

:::tip[Una pregunta para evaluar cualquier arquitectura]
¿Cuánto código tengo que tocar si mañana cambio de framework, de base de datos o de proveedor de API? Cuanto menos, más limpia es la arquitectura.
:::

---

## 3. ¿Qué busca? Los objetivos

Una arquitectura limpia persigue que el sistema sea:

| Objetivo | Significado | Beneficio práctico |
|:---|:---|:---|
| **Independiente de frameworks** | El framework es una herramienta, no el esqueleto del sistema. | Se puede actualizar o reemplazar sin reescribir el negocio. |
| **Independiente de la interfaz** | La UI se puede cambiar sin tocar las reglas. | La misma lógica sirve para web, móvil o consola. |
| **Independiente de la base de datos** | El negocio no sabe si hay SQL, NoSQL o una API. | Se cambia el almacenamiento con impacto mínimo. |
| **Independiente de agentes externos** | Las reglas no conocen servicios de terceros. | Un proveedor puede sustituirse por otro. |
| **Testeable** | Las reglas se prueban sin UI, sin servidor y sin base de datos. | Pruebas rápidas, estables y baratas. |

![Núcleo con detalles intercambiables](/img/computacion-3/clean-arch-independence.svg)

En el diagrama, las piezas con borde punteado son **alternativas** que se pueden enchufar en el mismo lugar. Eso es independencia: el núcleo no se entera de cuál está conectada.

---

## 4. ¿Qué propone? La Regla de Dependencia

Toda la propuesta se apoya en una sola regla:

> Las dependencias del código fuente solo pueden apuntar **hacia adentro**, hacia las políticas de más alto nivel.

Esto significa que:

1. Un círculo interno **no puede nombrar** nada que esté declarado en un círculo externo: ni funciones, ni clases, ni variables, ni formatos de datos.
2. Un círculo externo **sí puede** usar lo que ofrece uno interno.
3. Si el centro necesita algo del exterior (por ejemplo, guardar datos), declara una **interfaz** propia y el exterior la implementa.

Este último punto es la aplicación del **Principio de Inversión de Dependencias** (la D de SOLID).

### Flujo de control frente a dependencia de código

En tiempo de ejecución la llamada va de la interfaz al caso de uso y luego a la base de datos. Pero en el **código fuente**, la flecha hacia la base de datos se invierte:

```typescript title="Inversión de dependencias" showLineNumbers
// Círculo interno: el caso de uso declara QUÉ necesita
export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
}

export class GetExercisesUseCase {
  constructor(private readonly repository: ExerciseRepository) {}
  execute() {
    return this.repository.getAll();
  }
}

// Círculo externo: la infraestructura CUMPLE el contrato
export class ExerciseRepositoryImpl implements ExerciseRepository {
  async getAll() {
    // fetch, mappers, etc.
  }
}
```

El caso de uso nunca importa `ExerciseRepositoryImpl`. Es la infraestructura la que importa la interfaz del dominio. Por eso la dependencia de código apunta hacia adentro aunque la ejecución viaje hacia afuera.

---

## 5. Las partes: los cuatro círculos

![Anillos concéntricos y regla de dependencia](/img/computacion-3/clean-arch-onion-layers.svg)

El diagrama original de Martin tiene cuatro círculos. El diagrama de arriba es una versión simplificada que agrupa los dos círculos externos en uno. De adentro hacia afuera, los cuatro son:

### 5.1. Entidades (Entities)
Contienen las **reglas de negocio de la empresa**: objetos con datos y comportamiento que serían válidos en cualquier aplicación del mismo negocio. Son lo más estable del sistema y lo último que debería cambiar por razones técnicas.

*Ejemplo*: un `Exercise` que exige un nombre de mínimo tres caracteres.

### 5.2. Casos de uso (Use Cases)
Contienen las **reglas propias de la aplicación**. Cada caso de uso representa una intención concreta del usuario y **orquesta** el flujo de datos desde y hacia las entidades. No sabe si lo llaman desde una web o desde una prueba.

*Ejemplo*: `CreateExerciseUseCase`, `GetExercisesUseCase`.

### 5.3. Adaptadores de interfaz (Interface Adapters)
Son **traductores**. Convierten los datos del formato cómodo para casos de uso y entidades al formato cómodo para el exterior, y viceversa. Aquí viven controladores, presentadores y gateways, es decir, repositorios concretos y mappers.

*Ejemplo*: `ExerciseMapper`, `ExerciseRepositoryImpl`.

### 5.4. Frameworks y drivers
Es la capa más externa: **herramientas y detalles**. Base de datos, framework web, cliente HTTP, la interfaz gráfica. Aquí se escribe poco código propio, sobre todo configuración y pegamento.

*Ejemplo*: Next.js, React, `fetch`, el servidor NestJS.

### Resumen por capa

| Capa | Qué contiene | Estabilidad | Conoce a |
|:---|:---|:---|:---|
| Entidades | Reglas de negocio generales | Muy alta | Nadie |
| Casos de uso | Reglas de la aplicación | Alta | Entidades |
| Adaptadores | Mappers, repositorios, presenters | Media | Casos de uso y entidades |
| Frameworks y drivers | UI, base de datos, web, HTTP | Baja | Adaptadores |

:::note[Los cuatro círculos no son obligatorios]
Martin aclara que el diagrama es **esquemático**: puedes tener más o menos círculos. Lo único que no se negocia es la Regla de Dependencia.
:::

---

## 6. Cruzar las fronteras

Cuando los datos pasan de un círculo a otro deben hacerlo como **estructuras simples**: objetos planos, DTOs o argumentos. Nunca se debe pasar hacia adentro una fila de base de datos o un objeto propio del framework, porque eso haría que el círculo interno **dependa** de un detalle externo.

- Hacia adentro: el mapper convierte el DTO crudo en una entidad.
- Hacia afuera: el mapper convierte la entidad en el DTO que espera la API.

Esto es lo que veremos en detalle en las lecciones de infraestructura.

---

## 7. ¿Cómo se ve en un frontend con Next.js?

Clean Architecture nació pensando en sistemas de backend, pero la idea se traslada al frontend con una adaptación pragmática:

| Círculo de Martin | En nuestro proyecto Next.js |
|:---|:---|
| Entidades | `domain/entities` |
| Casos de uso | `domain/usecases` y contratos en `domain/repositories` |
| Adaptadores de interfaz | `infrastructure/mappers`, `infrastructure/repositories`, hooks de presentación |
| Frameworks y drivers | Next.js, React, `fetch`, componentes visuales |

Usaremos **tres carpetas por feature** (`domain`, `infrastructure`, `presentation`) en lugar de cuatro círculos. Es una simplificación válida porque respeta la regla esencial.

---

## 8. Críticas y cuándo no aplicarla

Ninguna arquitectura es gratis. Conviene conocer sus costos:

- **Más archivos y más indirección**: para una pantalla simple puede parecer excesivo.
- **Curva de aprendizaje**: exige comprender interfaces, inversión de dependencias y mappers.
- **Riesgo de sobreingeniería**: aplicar todas las capas a un CRUD pequeño o a un prototipo desperdicia tiempo.

:::tip[Regla práctica]
Aplica Clean Architecture cuando el proyecto vaya a **vivir y crecer**, tenga reglas de negocio reales, cambie de fuentes de datos o necesite buenas pruebas. Para un prototipo de un fin de semana, una arquitectura más simple es razonable. La clave es decidirlo de forma consciente, no por inercia.
:::

---

## 9. Ideas para llevarse

1. Clean Architecture separa **políticas** (negocio) de **detalles** (herramientas).
2. Su regla central: **las dependencias apuntan solo hacia adentro**.
3. Busca independencia de frameworks, UI, base de datos y servicios externos, además de ser **testeable**.
4. Se organiza en círculos: **Entidades, Casos de uso, Adaptadores y Frameworks**.
5. La **inversión de dependencias** permite que el centro defina contratos y el exterior los cumpla.
6. En las siguientes lecciones la llevaremos a la práctica con **Next.js y TypeScript**.

---

## Para profundizar

<CardGrid cols={2}>
  <Card
    title="The Clean Architecture"
    description="Artículo original de Robert C. Martin (2012)."
    link="https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html"
  />
  <Card
    title="Screaming Architecture"
    description="Martin sobre arquitecturas que comunican el propósito del sistema."
    link="https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html"
  />
  <Card
    title="Hexagonal Architecture"
    description="Texto original de Alistair Cockburn sobre puertos y adaptadores."
    link="https://alistair.cockburn.us/hexagonal-architecture/"
  />
  <Card
    title="The Onion Architecture"
    description="Serie de Jeffrey Palermo que presenta las capas concéntricas."
    link="https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/"
  />
</CardGrid>

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s11-que-es-clean-architecture-quiz">
  <Question title="¿Cuál es la premisa fundamental de Clean Architecture según Robert C. Martin?">
    <Option>El framework de frontend debe gobernar la estructura de carpetas y las entidades del sistema.</Option>
    <Option correct>Las reglas de negocio viven en el centro y las herramientas externas son detalles intercambiables que dependen del centro.</Option>
    <Option>Todas las capas deben conocer la estructura de la base de datos para optimizar las consultas.</Option>
    <Option>El flujo de datos debe depender estrictamente de componentes visuales reactivos.</Option>
  </Question>
  <Question title="¿Cuáles son dos antecedentes arquitectónicos directos sintetizados en Clean Architecture?">
    <Option>Model-View-Controller (1979) y Microservicios Event-Driven (2014).</Option>
    <Option>Arquitectura Monolítica Modular (2000) y Component-Driven Design (2015).</Option>
    <Option correct>Arquitectura Hexagonal (Cockburn, 2005) y Onion Architecture (Palermo, 2008).</Option>
    <Option>Serverless Architecture (2016) y Domain-Driven Storage (2003).</Option>
  </Question>
  <Question title="En la terminología de Uncle Bob, ¿cuál es la diferencia entre políticas y detalles?">
    <Option>Las políticas definen el CSS y la vista; los detalles definen los algoritmos criptográficos.</Option>
    <Option correct>Las políticas representan las reglas de negocio y cambian poco; los detalles son las herramientas de entrega y cambian con frecuencia.</Option>
    <Option>Las políticas son las bases de datos SQL; los detalles son las interfaces de TypeScript.</Option>
    <Option>Las políticas son configuraciones de despliegue; los detalles son los endpoints del backend.</Option>
  </Question>
  <Question title="¿Qué establece formalmente la Regla de Dependencia de Clean Architecture?">
    <Option>Las capas internas deben importar utilidades de las capas externas para evitar duplicidad.</Option>
    <Option>Las dependencias deben fluir en ciclos bidireccionales entre casos de uso y vistas.</Option>
    <Option correct>Las dependencias en el código fuente solo pueden apuntar hacia adentro, hacia las políticas de más alto nivel.</Option>
    <Option>El centro del sistema debe importar librerías externas de HTTP para gestionar la persistencia.</Option>
  </Question>
  <Question title="¿Qué sucede cuando se aplica el Principio de Inversión de Dependencias (DIP) al acceso a datos?">
    <Option>El caso de uso debe importar la implementación concreta del repositorio desde la capa externa.</Option>
    <Option correct>El dominio declara la interfaz del repositorio y la infraestructura externa se encarga de implementarla.</Option>
    <Option>La base de datos genera automáticamente las entidades de negocio mediante un ORM.</Option>
    <Option>La capa de presentación realiza peticiones fetch directamente sin pasar por abstracciones.</Option>
  </Question>
  <Question title="En el esquema de cuatro círculos concéntricos, ¿cuál es la capa más interna y estable?">
    <Option correct>Entidades (Entities).</Option>
    <Option>Casos de Uso (Use Cases).</Option>
    <Option>Adaptadores de Interfaz (Interface Adapters).</Option>
    <Option>Frameworks y Drivers.</Option>
  </Question>
  <Question title="¿Cuál es la función principal de la capa de Casos de Uso (Use Cases)?">
    <Option>Definir las conexiones a bases de datos y configurar sockets de red.</Option>
    <Option correct>Orquestar el flujo de datos hacia y desde las entidades, encapsulando las intenciones de la aplicación.</Option>
    <Option>Renderizar plantillas JSX y gestionar el estado reactivo del DOM.</Option>
    <Option>Almacenar las credenciales de autenticación y tokens JWT de la sesión.</Option>
  </Question>
  <Question title="¿Qué rol cumplen los Adaptadores de Interfaz (Interface Adapters) como Mappers y Presenters?">
    <Option>Ejecutar las reglas de negocio de la empresa sin permitir intervención externa.</Option>
    <Option>Gestionar el ciclo de vida del servidor web y los balanceadores de carga.</Option>
    <Option correct>Traducir datos entre el formato conveniente para el dominio y el formato conveniente para agentes externos.</Option>
    <Option>Reemplazar por completo el uso de TypeScript por esquemas dinámicos JSON.</Option>
  </Question>
  <Question title="¿Por qué se exige que los datos que cruzan fronteras entre capas sean estructuras simples o DTOs?">
    <Option>Para obligar al motor de JavaScript a serializar todo el estado en variables globales.</Option>
    <Option>Porque los navegadores no permiten transferir clases de TypeScript a través de props.</Option>
    <Option correct>Para evitar que un objeto propio de un framework o base de datos externa contamine y acople los círculos internos.</Option>
    <Option>Para prescindir del uso de interfaces y tipos estrictos en el desarrollo de la aplicación.</Option>
  </Question>
  <Question title="¿En cuál de los siguientes escenarios NO se recomienda implementar Clean Architecture con todas sus capas?">
    <Option>Una aplicación de banca con reglas estrictas y múltiples proveedores de pago intercambiables.</Option>
    <Option>Un sistema empresarial diseñado para mantenerse y evolucionar durante varios años.</Option>
    <Option correct>Un prototipo experimental desechable o un CRUD simple desarrollado para un fin de semana.</Option>
    <Option>Una plataforma de salud con requerimiento de pruebas unitarias exhaustivas sin conexión a red.</Option>
  </Question>
</Quiz>

