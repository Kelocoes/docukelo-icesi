---
sidebar_position: 4
---

# Inyección de Dependencias y Providers

En las guías anteriores exploramos los fundamentos de NestJS, creamos controladores y servicios en memoria, y modelamos entidades relacionales con TypeORM y PostgreSQL. Sin embargo, para que todos estos elementos operen armónicamente en un backend escalable y mantenible, es indispensable comprender cómo se comunican las capas entre sí: la **Inversión de Control (IoC)**, la **Inyección de Dependencias (DI)** y los **Providers**.

---

## 1. La Arquitectura por Capas en NestJS

Una aplicación backend moderna desacopla responsabilidades en niveles bien delimitados para que cada pieza cumpla un propósito único. En NestJS, la información fluye a través de capas estructuradas:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-layered-architecture.svg" alt="Arquitectura por capas en NestJS" width="100%" />
</div>

* **Cliente**: Navegador, aplicación móvil o cliente HTTP que inicia la petición y consume la respuesta.
* **Controlador (`@Controller`)**: Punto de entrada de las solicitudes HTTP; enruta URLs, extrae parámetros y delega el trabajo al servicio.
* **Servicio (`@Injectable`)**: Contiene las reglas del negocio, validaciones de dominio y orquestación de operaciones.
* **Repositorio (`Repository<T>`)**: Abstrae el acceso a datos mediante TypeORM, traduciendo operaciones orientadas a objetos en consultas SQL seguras.
* **Base de Datos (PostgreSQL)**: Motor de persistencia física de tablas y registros.

---

## 2. Acoplamiento Fuerte frente a Inversión de Control

Ahora que conocemos las capas, la interrogante fundamental es: **¿cómo obtiene el controlador una instancia de su servicio o repositorio?**

### Enfoque tradicional acoplado (Instanciación manual con `new`)

En la programación tradicional sin contenedores de dependencias, una clase crea directamente a sus dependencias mediante `new`:

```typescript title="src/users/users.controller.ts (Sin Inversión de Control)" showLineNumbers
export class UsersController {
  private usersService: UsersService;

  constructor() {
    // Acoplamiento rígido: el controlador crea la instancia directamente
    this.usersService = new UsersService();
  }

  getUsers() {
    return this.usersService.findAll();
  }
}
```

Este esquema genera serios problemas arquitectónicos:
* **Acoplamiento rígido**: Si `UsersService` cambia su constructor en el futuro (por ejemplo, para requerir una conexión de base de datos o un repositorio), todos los controladores que lo instanciaban con `new` dejarán de compilar y deberán reescribirse.
* **Dificultad extrema en pruebas unitarias**: Resulta imposible sustituir el servicio real por un sustituto simulado (*mock*), impidiendo aislar el controlador para pruebas de unidad.
* **Duplicación ineficiente de memoria**: Cada consumidor crea una nueva instancia de la dependencia, desperdiciando recursos.

---

### Enfoque con Inversión de Control (IoC) e Inyección de Dependencias (DI)

En NestJS se adopta el patrón de **Inversión de Control (IoC)**. La clase consumidora ya no se preocupa por fabricar lo que necesita; únicamente **declara sus necesidades en los parámetros de su constructor**.

El **Contenedor IoC de NestJS** se encarga de instanciar los componentes, resolver el grafo de dependencias en el orden correcto y suministrarlos listos para su uso:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-ioc-container.svg" alt="Contenedor IoC de NestJS y suministro de dependencias" width="100%" />
</div>

| Criterio | Instanciación Manual (`new`) | Inyección de Dependencias (IoC) |
|---|---|---|
| **Responsabilidad de creación** | La clase consumidora crea sus dependencias | El Contenedor IoC de NestJS las construye automáticamente |
| **Nivel de acoplamiento** | Alto (depende de clases e implementaciones concretas) | Bajo (las clases declaran contratos o dependencias desacopladas) |
| **Pruebas unitarias** | Complejas (no permite inyectar *mocks*) | Sencillas (basta suministrar objetos falsos en el constructor) |
| **Mantenimiento** | Frágil ante cambios en los constructores | Centralizado y gestionado por los módulos de NestJS |

---

## 3. ¿Qué es un Provider en NestJS?

En NestJS, un **Provider** es cualquier clase simple de TypeScript decorada con `@Injectable()` que puede ser gestionada por el contenedor IoC y suministrada como dependencia a otros componentes.

La gran mayoría de las clases con lógica operativa en NestJS son providers:
* **Servicios (`Services`)**: Para las reglas de negocio de la aplicación.
* **Repositorios (`Repositories`)**: Para interactuar con las tablas mediante TypeORM.
* **Clientes de API o adaptadores**: Para consumir servicios externos (pasarelas de pago, correos, microservicios).
* **Helpers y utilidades**: Clases con funciones de cálculo o transformación reutilizables.

### El decorador `@Injectable()`

El decorador `@Injectable()` adjunta metadatos de reflexión que le indican al motor de NestJS que esta clase puede ser inyectada automáticamente donde sea requerida:

```typescript title="src/users/users.service.ts" showLineNumbers
import { Injectable } from '@nestjs/common';

export interface UserItem {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  private readonly users: UserItem[] = [
    { id: 1, email: 'ada@icesi.edu.co' },
    { id: 2, email: 'alan@icesi.edu.co' },
  ];

  findAll(): UserItem[] {
    return this.users;
  }

  findById(id: number): UserItem | undefined {
    return this.users.find((u) => u.id === id);
  }
}
```

---

## 4. Inyección Basada en Constructor

NestJS utiliza principalmente la **inyección basada en constructor**. Las dependencias requeridas se declaran como parámetros del constructor.

Al anteponer el modificador `private readonly` en TypeScript, la propiedad de la clase se declara y se asigna de manera simultánea en una sola línea:

```typescript title="src/users/users.controller.ts" showLineNumbers
import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService, UserItem } from './users.service';

@Controller('users')
export class UsersController {
  // Inyección por constructor:
  // NestJS identifica el tipo UsersService y suministra la instancia automáticamente
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): UserItem[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): UserItem {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
}
```

:::tip[Buenas prácticas: Modificador readonly]
Declarar las dependencias inyectadas como `readonly` impide que sean reasignadas accidentalmente en los métodos de la clase a lo largo de su ciclo de vida.
:::

---

## 5. Organización Modular: Estructura de `@Module()`

Para que el contenedor IoC sepa qué providers existen y cuáles componentes tienen permiso para consumirlos, deben registrarse dentro de un **Módulo**.

Un módulo es una clase decorada con `@Module()` que delimita el alcance y encapsulación de sus elementos:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-module-structure.svg" alt="Estructura de propiedades de @Module en NestJS" width="100%" />
</div>

### Propiedades Principales de `@Module()`

1. **`controllers: [ ... ]`**: Controladores que pertenecen a este módulo y deben ser instanciados para escuchar rutas HTTP.
2. **`providers: [ ... ]`**: Servicios y providers instanciados y administrados por el contenedor IoC dentro del módulo. Por defecto, son **privados** al módulo.
3. **`imports: [ ... ]`**: Lista de otros módulos cuyas exportaciones son requeridas dentro del módulo actual.
4. **`exports: [ ... ]`**: Subconjunto de providers de este módulo que se hacen **públicos** para que otros módulos que importen a este puedan inyectarlos.

```typescript title="src/users/users.module.ts" showLineNumbers
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],                    // Módulos importados
  controllers: [UsersController], // Controladores que escuchan rutas
  providers: [UsersService],      // Providers registrados en el módulo
  exports: [UsersService],        // Hace público a UsersService para otros módulos
})
export class UsersModule {}
```

---

## 6. Diagnóstico de Errores Frecuentes

### Error: `Nest can't resolve dependencies of the UsersController (?)`

Este es el error más recurrente cuando se trabaja con inyección de dependencias en NestJS. Ocurre cuando un componente solicita un provider en su constructor pero el contenedor IoC no encuentra instrucciones para resolverlo en el módulo actual:

```text title="Consola de Error de NestJS"
Error: Nest can't resolve dependencies of the UsersController (?). 
Please make sure that the argument UsersService at index [0] is available in the UsersModule context.

Potential solutions:
- If UsersService is a provider, is it part of the current UsersModule?
- If UsersService is exported from a separate @Module, is that module imported within UsersModule?
```

**Lista de verificación para solucionarlo:**
1. **Verificar `@Injectable()`**: Confirma que la clase del servicio tenga el decorador `@Injectable()` sobre su declaración.
2. **Verificar `providers`**: Comprueba que el servicio esté incluido en el arreglo `providers` del módulo (`UsersModule`).
3. **Verificar `exports` e `imports`**: Si el servicio proviene de otro módulo (por ejemplo `AuthModule`), verifica que `AuthModule` tenga al servicio en su lista de `exports` y que `UsersModule` tenga a `AuthModule` en su lista de `imports`.

---

## Autoevaluación

<Quiz id="compu3-providers-di-quiz">

<Question title="En la arquitectura por capas de NestJS, ¿cuál es la responsabilidad principal del Controlador?">
  <Option>Ejecutar directamente consultas SQL con sentencias CREATE TABLE o ALTER TABLE</Option>
  <Option correct>Servir como punto de entrada HTTP, enrutar endpoints, validar parámetros entrantes y delegar la ejecución al servicio</Option>
  <Option>Crear las tablas en la base de datos PostgreSQL de manera física</Option>
  <Option>Almacenar de forma permanente los registros en la memoria caché del cliente</Option>
</Question>

<Question title="¿Por qué se considera una mala práctica arquitectónica que un Controlador instancie su Servicio usando 'new UsersService()'?">
  <Option>Porque JavaScript no permite invocar métodos asíncronos en clases creadas con new</Option>
  <Option>Porque genera una excepción de sintaxis que impide la transpilación con TypeScript</Option>
  <Option correct>Porque crea un acoplamiento fuerte, impide sustituir el servicio por un mock en pruebas unitarias y duplica instancias innecesariamente</Option>
  <Option>Porque obliga al navegador web a reiniciar la conexión TCP en cada solicitud</Option>
</Question>

<Question title="En el flujo interno de una petición en NestJS, ¿cuál es la secuencia correcta de capas por las que viaja la información?">
  <Option>Cliente -&gt; Base de Datos -&gt; Repositorio -&gt; Controlador -&gt; Servicio</Option>
  <Option correct>Cliente -&gt; Controlador -&gt; Servicio -&gt; Repositorio -&gt; Base de Datos</Option>
  <Option>Cliente -&gt; Repositorio -&gt; Servicio -&gt; Controlador -&gt; Base de Datos</Option>
  <Option>Controlador -&gt; Cliente -&gt; Servicio -&gt; Base de Datos -&gt; Repositorio</Option>
</Question>

<Question title="¿Cuál es la función del decorador @Injectable() en una clase de TypeScript?">
  <Option>Transformar la clase en un endpoint REST accesible públicamente mediante URL</Option>
  <Option correct>Marcar la clase como un provider elegible para ser administrado e inyectado por el contenedor IoC de NestJS</Option>
  <Option>Configurar una columna de clave primaria autoincremental en PostgreSQL</Option>
  <Option>Forzar a la clase a ejecutarse exclusivamente en el navegador del cliente</Option>
</Question>

<Question title="¿Cómo se declara habitualmente una dependencia inyectable en el constructor de un controlador en NestJS?">
  <Option>constructor(let usersService = new UsersService())</Option>
  <Option>constructor(@CreateInstance() usersService: UsersService)</Option>
  <Option correct>constructor(private readonly usersService: UsersService)</Option>
  <Option>constructor(usersService: import('./users.service'))</Option>
</Question>

<Question title="Por defecto, ¿cuál es el nivel de visibilidad de un provider declarado en el arreglo 'providers' de un módulo?">
  <Option>Es global y accesible automáticamente por cualquier archivo del proyecto</Option>
  <Option correct>Es privado al módulo; solo los controladores y servicios del mismo módulo pueden inyectarlo</Option>
  <Option>Solo puede ser consumido por la base de datos PostgreSQL</Option>
  <Option>Solo es visible para aplicaciones externas conectadas por WebSocket</Option>
</Question>

<Question title="Si un servicio declarado en ModuleA necesita ser consumido por un servicio en ModuleB, ¿qué configuración en los módulos es obligatoria?">
  <Option>ModuleA debe listar el servicio en controllers y ModuleB en imports</Option>
  <Option correct>ModuleA debe incluir el servicio en su arreglo exports, y ModuleB debe agregar a ModuleA en su arreglo imports</Option>
  <Option>Ambos servicios deben combinarse en un único archivo de TypeScript</Option>
  <Option>ModuleB debe eliminar su decorador @Module() para tener visibilidad total</Option>
</Question>

<Question title="¿Qué rol cumple la capa de Repositorio en una aplicación estructurada con NestJS y TypeORM?">
  <Option>Definir los componentes visuales de interfaz de usuario con HTML y CSS</Option>
  <Option>Recibir las solicitudes HTTP entrantes y enviar códigos de estado HTTP 404</Option>
  <Option correct>Abstraer el acceso a la base de datos, encapsulando las operaciones CRUD y mapeando tablas a objetos TypeScript</Option>
  <Option>Gestionar el inicio de sesión y la autenticación del usuario en el navegador</Option>
</Question>

<Question title="¿Qué ventaja técnica ofrece la Inversión de Control (IoC) gestionada por el framework frente al diseño tradicional?">
  <Option>Aumenta el tamaño del archivo JavaScript compilado para acelerar la carga en disco</Option>
  <Option correct>Desacopla la creación de instancias de su consumo, facilitando el mantenimiento, la modularidad y el testeo unitario con mocks</Option>
  <Option>Elimina por completo la necesidad de tener una base de datos relacional</Option>
  <Option>Convierte automáticamente todas las consultas SQL en consultas GraphQL</Option>
</Question>

<Question title="Si la terminal arroja el error 'Nest can't resolve dependencies of the UsersController (?)', ¿cuál es el primer paso para corregirlo?">
  <Option>Reinstalar el sistema operativo del servidor de desarrollo</Option>
  <Option>Eliminar el controlador de la aplicación</Option>
  <Option correct>Verificar que UsersService tenga el decorador @Injectable() y esté registrado en el arreglo providers del módulo correspondiente</Option>
  <Option>Cambiar el puerto del servidor de Node.js del 3000 al 8080</Option>
</Question>

</Quiz>
