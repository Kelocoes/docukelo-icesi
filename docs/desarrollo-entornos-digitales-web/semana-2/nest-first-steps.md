---
sidebar_position: 5
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
