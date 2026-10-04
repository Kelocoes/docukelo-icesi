---
sidebar_position: 1
---

# Despliegue de APIs con NestJS, Docker y PostgreSQL en Railway

Durante las semanas anteriores construimos controladores, servicios, repositorios con TypeORM y mecanismos de autenticación mediante JWT. Todo este desarrollo ocurrió en nuestra máquina de trabajo (`localhost`). Sin embargo, el objetivo final del desarrollo web no es ejecutar software en aislamiento, sino ponerlo a disposición de usuarios reales, clientes móviles y aplicaciones frontend a través de internet de forma confiable, segura y continua.

En esta guía abordaremos el **concepto de despliegue**, el rol fundamental de la **contenedorización con Docker** mediante arquitecturas *multi-stage*, y el proceso de puesta en producción de un backend en **NestJS** conectado a una base de datos relacional **PostgreSQL** sobre la plataforma en la nube **Railway**.

---

## 1. Fundamentos Teóricos: ¿Qué Significa Desplegar?

El **despliegue (deployment)** es el conjunto de actividades técnicas y operativas necesarias para trasladar una aplicación desde el entorno de desarrollo local del programador hasta un servidor o infraestructura en la nube, dejándola operativa, monitorizada y accesible mediante la red.

![El Concepto de Despliegue en la Web](/img/desarrollo-entornos-digitales-web/deployment-concept-flow.svg)

### Diferencias Clave: Entorno Local vs. Entorno de Producción

| Criterio Técnico | Entorno Local (Desarrollo) | Entorno de Producción (Nube) |
| :--- | :--- | :--- |
| **Disponibilidad** | Efímera (se detiene al cerrar la laptop o apagar la terminal). | Continua 24/7 con reinicio automático ante caídas (*self-healing*). |
| **Direccionamiento** | Loopback privado (`127.0.0.1` o `localhost:3000`). | Dominio público con resolución DNS global (`https://api.tudominio.com`). |
| **Cifrado de Red** | HTTP en texto plano (inseguro). | HTTPS obligatorio con certificados TLS/SSL administrados. |
| **Persistencia de Datos** | Base de datos local o contenedor temporal en disco. | Volúmenes persistentes gestionados y copias de seguridad (*backups*). |
| **Compilación** | Ejecución interpretada con recarga en caliente (`ts-node` / `start:dev`). | Código JavaScript compilado, minificado y altamente optimizado (`dist/main.js`). |

---

## 2. Requerimientos para el Despliegue

Antes de iniciar el proceso de despliegue a la nube, una arquitectura backend moderna requiere cumplir con los siguientes estándares de la industria (alineados con la metodología de los *12-Factor Apps*):

1. **Código fuente desacoplado de la configuración**: Ninguna contraseña, llave criptográfica o URL de base de datos debe estar escrita en duro (*hardcoded*) en el código fuente. Toda configuración sensible debe inyectarse en tiempo de ejecución a través de **variables de entorno**.
2. **Artefacto reproducible y portable**: El proyecto debe contener un archivo de dependencias estricto (`package-lock.json`) y una receta de construcción determinista (un **Dockerfile**) que garantice que la aplicación se construya con las mismas versiones de Node.js y paquetes en cualquier servidor del planeta.
3. **Gestión de ciclo de vida de base de datos**: El motor de persistencia (PostgreSQL) debe ejecutarse en un entorno administrado con almacenamiento en volumen persistente, garantizando que los datos no se destruyan si el contenedor de la aplicación se reinicia.
4. **Control de versiones**: Todo el código debe estar versionado en un repositorio de **GitHub**, el cual servirá como canal de integración y despliegue continuo (*CI/CD*) hacia la plataforma en la nube.

---

## 3. ¿Por Qué Dockerizar Nuestro Backend?

En el desarrollo de software tradicional, una de las mayores fuentes de frustración es el conocido síndrome de *"en mi máquina sí funciona"*. Las discrepancias en la versión de Node.js instalada en el sistema operativo del desarrollador, las configuraciones de librerías nativas y las diferencias entre Windows, macOS y Linux suelen causar fallos críticos al subir a un servidor remoto.

**Docker** resuelve este problema empaquetando la aplicación, el motor de ejecución de Node.js, las dependencias exactas y las directivas de red dentro de una **imagen inmutable**.

![Ventajas de Contenedorizar con Docker](/img/desarrollo-entornos-digitales-web/docker-benefits-comparison.svg)

### Ventajas Técnicas de la Contenedorización

- **Aislamiento Total**: No requieres instalar PostgreSQL ni dependencias nativas en el sistema anfitrión de tu computador.
- **Portabilidad Inmediata**: La misma imagen que pruebas localmente con Docker es la que correrá sin sorpresas en Railway, AWS, DigitalOcean o Google Cloud.
- **Reducción de Superficie de Ataque**: Los contenedores corren en espacios de usuario protegidos y solo exponen los puertos explícitamente configurados.
- **Estandarización de Equipo**: Cualquier nuevo desarrollador que ingrese al proyecto solo necesita clonar el repositorio y ejecutar un comando para tener el entorno operativo idéntico al de producción.

---

## 4. Construcción Multietapa: El Dockerfile de NestJS

En aplicaciones desarrolladas con **TypeScript** como NestJS, no podemos enviar el código `.ts` directamente a producción porque Node.js solo entiende **JavaScript** estándar. Tampoco es una buena práctica subir a producción herramientas pesadas como el compilador de TypeScript (`tsc`), herramientas de pruebas (`jest`) o dependencias de desarrollo (`@types/*`).

Para resolver esto implementamos un patrón de **Construcción Multietapa (Multi-Stage Build)**. Este enfoque divide el proceso en tres fases aisladas:

![Ciclo de Vida Multi-Stage en Docker](/img/desarrollo-entornos-digitales-web/docker-multistage-lifecycle.svg)

A continuación se presenta el archivo `Dockerfile` optimizado. Analiza los comentarios línea a línea para comprender la función de cada directiva:

```docker title="Dockerfile" showLineNumbers
# ==============================================================================
# ETAPA 1: Resolución y Descarga de Dependencias (deps)
# ==============================================================================
# Usamos una imagen ligera basada en Alpine Linux con Node.js 20
FROM node:20-alpine AS deps
WORKDIR /app

# Copiamos únicamente los manifiestos de paquetes para aprovechar la caché de Docker.
# Si package.json ni package-lock.json cambian, Docker no volverá a descargar paquetes.
COPY package.json package-lock.json ./

# 'npm ci' (Clean Install) garantiza una instalación exacta y determinista
# basada exclusivamente en package-lock.json, instalando también devDependencies
RUN npm ci

# ==============================================================================
# ETAPA 2: Compilación de TypeScript a JavaScript (builder)
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Importamos las dependencias instaladas en la etapa previa (deps)
COPY --from=deps /app/node_modules ./node_modules

# Copiamos la totalidad del código fuente del proyecto
COPY . .

# Ejecutamos el compilador de NestJS ('nest build').
# Esto toma el código TypeScript de /src y genera JavaScript puro en /app/dist
RUN npm run build

# ==============================================================================
# ETAPA 3: Imagen Final de Producción (runner)
# ==============================================================================
# Esta será la ÚNICA imagen que se sube y ejecuta en el servidor de Railway
FROM node:20-alpine AS runner
WORKDIR /app

# Definimos la variable de entorno para que las librerías activen optimizaciones de producción
ENV NODE_ENV=production

# Copiamos nuevamente los manifiestos de dependencias
COPY package.json package-lock.json ./

# Instalamos ÚNICAMENTE las dependencias de producción (--omit=dev),
# descartando TypeScript, linters, compiladores y herramientas de test
RUN npm ci --omit=dev

# Copiamos únicamente el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# Documentamos el puerto en el que escucha el servicio interno
EXPOSE 3000

# Comando definitivo de arranque: Node ejecuta directamente el punto de entrada JavaScript
CMD ["node", "dist/main"]
```

:::info[¿Por qué esta estrategia reduce el peso de la imagen?]
En una instalación tradicional, la carpeta `node_modules` junto con las dependencias de desarrollo y el código TypeScript puede superar fácilmente **1.2 GB**. Al utilizar *multi-stage builds*, la imagen productiva final (`runner`) contiene únicamente Node.js Alpine, las dependencias estrictas de producción y la carpeta `dist/`, alcanzando un tamaño aproximado de tan solo **~140 MB**. Esto se traduce en despliegues ultrarrápidos y menor consumo de memoria en la nube.
:::

---

## 5. Orquestación Local con Docker Compose

Durante el desarrollo local necesitamos ejecutar simultáneamente la base de datos PostgreSQL y opcionalmente el backend sin tener que configurar servicios manuales en el sistema operativo.

El archivo `docker-compose.yml` orquesta ambos contenedores dentro de una red virtual compartida:

```yaml title="docker-compose.yml" showLineNumbers
services:
  # ----------------------------------------------------------------------------
  # Servicio 1: Base de Datos Relacional PostgreSQL
  # ----------------------------------------------------------------------------
  postgres:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    ports:
      # Mapeo: Puerto en tu máquina host : Puerto interno del contenedor
      # Usamos 5435 externamente para evitar conflictos con instancias locales de Postgres
      - "${DB_PORT_EXTERNAL:-5435}:5432"
    volumes:
      # Volumen persistente para que los registros no se borren al apagar el contenedor
      - postgres_data:/var/lib/postgresql/data
    networks:
      - nestjs-network

  # ----------------------------------------------------------------------------
  # Servicio 2: Backend NestJS (Opcional para pruebas integrales locales)
  # ----------------------------------------------------------------------------
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nestjs-api
    restart: always
    environment:
      PORT: ${PORT}
      DB_TYPE: ${DB_TYPE}
      # Dentro de la red de Docker, el host es el nombre del servicio 'postgres'
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
      DB_SYNCHRONIZE: ${DB_SYNCHRONIZE}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      SALT_ROUNDS: ${SALT_ROUNDS}
    ports:
      - "${PORT:-3001}:3000"
    depends_on:
      - postgres
    networks:
      - nestjs-network

# ------------------------------------------------------------------------------
# Definición de Redes y Volúmenes
# ------------------------------------------------------------------------------
networks:
  nestjs-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

---

## 6. Variables de Entorno (`.env.example`)

Para salvaguardar la seguridad del proyecto, el archivo `.env` que contiene las contraseñas reales **nunca** debe comitearse a GitHub. En su lugar, se incluye una plantilla llamada `.env.example` para que cualquier miembro del equipo o servicio de despliegue sepa qué variables debe suministrar.

Crea o actualiza el archivo `.env.example` en la raíz de tu proyecto NestJS:

```properties title=".env.example" showLineNumbers
# ==============================================================================
# Configuración del Servidor HTTP
# ==============================================================================
PORT=3001

# ==============================================================================
# Configuración de Base de Datos PostgreSQL
# ==============================================================================
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_PORT_EXTERNAL=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interfaces3
DB_SYNCHRONIZE=true

# ==============================================================================
# Autenticación y Criptografía (JWT)
# ==============================================================================
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=1h

# ==============================================================================
# Parámetros de Hashing
# ==============================================================================
SALT_ROUNDS=10
```

:::warning[Alerta de Seguridad en Producción]
En tu entorno local, la propiedad `DB_SYNCHRONIZE=true` permite a TypeORM crear y alterar tablas automáticamente a partir de las entidades. Sin embargo, en **producción real** esta propiedad debe establecerse en `false` una vez generado el esquema, utilizando **migraciones controladas** para evitar la pérdida accidental de datos en tablas existentes.
:::

---

## 7. Despliegue en Producción con Railway

**Railway** es una plataforma en la nube moderna diseñada para simplificar el aprovisionamiento de infraestructura, bases de datos y servicios en contenedores sin la complejidad operacional de proveedores tradicionales. A continuación, ejecutamos el proceso de despliegue paso a paso:

<StepByStep>
  <Step number="1" title="Crear un Proyecto y Aprovisionar PostgreSQL en Railway">
    1. Ingresa a tu cuenta en [Railway.app](https://railway.app/) y crea un nuevo proyecto haciendo clic en **New Project**.
    2. En el menú de opciones de despliegue, selecciona la opción **Database**:

    ![Añadir Nuevo Servicio en Railway](/img/desarrollo-entornos-digitales-web/railway-new-service-modal.png)

    3. De la lista de motores de base de datos disponibles, selecciona **PostgreSQL**:

    ![Seleccionar Base de Datos PostgreSQL](/img/desarrollo-entornos-digitales-web/railway-select-postgres-database.png)

    4. Railway inicializará el contenedor de PostgreSQL con su respectivo volumen persistente (`postgres-volume`). Al hacer clic sobre el nodo de Postgres y entrar a la pestaña **Variables**, observarás las credenciales generadas automáticamente por la plataforma:

    ![Variables Autogeneradas de PostgreSQL](/img/desarrollo-entornos-digitales-web/railway-postgres-variables-overview.png)
  </Step>

  <Step number="2" title="Habilitar Acceso Público para Herramientas de Administración (DBeaver)">
    Para poder inspeccionar tablas, ejecutar sentencias SQL y auditar entidades desde tu cliente local (**DBeaver** o DataGrip), debes habilitar un puerto público para la base de datos:

    1. Haz clic sobre el nodo de **Postgres** en el canvas de Railway.
    2. Dirígete a la pestaña **Settings** y busca la sección **Networking**.
    3. Haz clic en el botón **Add Public Access**:

    ![Activar Acceso Público en PostgreSQL](/img/desarrollo-entornos-digitales-web/railway-postgres-enable-public-access.png)

    Railway generará una URL pública con formato:
    ```
    postgresql://postgres:PASSWORD@sakura.proxy.rlwy.net:PORT/railway
    ```
  </Step>

  <Step number="3" title="Solución de Problemas DNS con Proveedores de Internet (ISP) en DBeaver">
    :::caution[Diagnóstico Crítico: Fallos de Resolución DNS en tu Operador de Internet]
    En Colombia y diversos países de Latinoamérica, los servidores DNS de ciertos proveedores de internet residenciales (como Claro, Tigo o Movistar) **no resuelven correctamente** los dominios dinámicos de proxy de Railway (por ejemplo, `sakura.proxy.rlwy.net`), arrojando errores como *Unknown Host* o *Connection Timed Out* al intentar conectar con DBeaver.
    
    **La Solución Definitiva:** En lugar de ingresar el nombre de dominio en el campo *Host* de DBeaver, debes ingresar directamente la **dirección IP pública** del proxy (por ejemplo: `66.33.22.220`).
    :::

    Si la dirección IP cambia o tu proveedor no la resuelve, puedes obtener la IP vigente en tiempo real mediante comandos de diagnóstico de red en tu terminal:

    <Tabs>
      <TabItem value="win" label="Windows (PowerShell / CMD)" default>

      Abre tu terminal de Windows y ejecuta el comando `nslookup` apuntando al dominio de tu proxy:

      ```powershell title="PowerShell / CMD"
      nslookup sakura.proxy.rlwy.net
      ```

      **Ejemplo de respuesta en pantalla:**
      ```text
      Servidor:  UnKnown
      Address:  192.168.1.1

      Respuesta no autoritativa:
      Nombre:   sakura.proxy.rlwy.net
      Addresses:  66.33.22.220
      ```

      Copia el valor listado en `Addresses` (`66.33.22.220`) y pégalo en el campo **Host** de tu conexión en DBeaver, manteniendo el número de puerto asignado por Railway.

      </TabItem>
      <TabItem value="mac-linux" label="macOS y Linux">

      Abre tu terminal y consulta el registro DNS mediante `dig`, `host` o `nslookup`:

      ```bash title="Terminal (Bash / Zsh)"
      # Opción 1: Obtener únicamente la dirección IP directa con dig
      dig +short sakura.proxy.rlwy.net

      # Opción 2: Consulta estándar con nslookup
      nslookup sakura.proxy.rlwy.net

      # Opción 3: Consulta con host
      host sakura.proxy.rlwy.net
      ```

      Utiliza la dirección IP resultante en la configuración de conexión de DBeaver.

      </TabItem>
    </Tabs>
  </Step>

  <Step number="4" title="Vincular el Repositorio de GitHub en Railway">
    Una vez asegurada la base de datos, desplegamos nuestro backend:

    1. En el canvas de tu proyecto en Railway, haz clic en **+ New** o pulsa la tecla `Ctrl + K` (o `Cmd + K`).
    2. Selecciona la opción **GitHub Repository**:

    ![Seleccionar Repositorio de GitHub en Railway](/img/desarrollo-entornos-digitales-web/railway-github-repo-select.png)

    3. Elige el repositorio donde tienes alojado tu backend de NestJS (por ejemplo: `Kelocoes/interfaces-3-202602`).
    4. Confirma que la rama vinculada sea `main`:

    ![Configuración de Origen y Rama](/img/desarrollo-entornos-digitales-web/railway-service-source-branch-settings.png)
  </Step>

  <Step number="5" title="Configurar el Motor de Construcción a Dockerfile">
    Por defecto, Railway intenta compilar proyectos Node.js utilizando su constructor estándar (*Railpack* o *Nixpacks*). Para que Railway respete nuestra optimización **multi-stage** definida en el `Dockerfile`:

    1. Selecciona la tarjeta del servicio de NestJS en el canvas.
    2. Dirígete a la pestaña **Settings** y desplázate hasta la sección **Build**.
    3. En el selector **Builder**, cambia la opción de *Railpack* a **Dockerfile**:

    ![Configurar Builder a Dockerfile](/img/desarrollo-entornos-digitales-web/railway-service-builder-dockerfile.png)

    Railway utilizará ahora el motor BuildKit de Docker para compilar las tres fases (`deps`, `builder`, `runner`).
  </Step>

  <Step number="6" title="Inyectar Variables de Entorno en el Backend">
    Para que el backend pueda conectarse a PostgreSQL y firmar tokens JWT, debemos suministrarle sus variables de configuración:

    1. En el servicio de NestJS, haz clic en la pestaña **Variables**:

    ![Pestaña de Variables Vacía en Railway](/img/desarrollo-entornos-digitales-web/railway-service-variables-empty-view.png)

    2. Haz clic en el botón **Raw Editor** en la esquina superior derecha para configurar todas las variables en bloque.
    3. Pega los valores de producción correspondientes:

    ![Editor Raw de Variables en Railway](/img/desarrollo-entornos-digitales-web/railway-service-variables-raw-editor.png)

    ```properties title="Variables de Entorno para Producción en Railway"
    # Host interno de la base de datos en la red privada de Railway
    DB_HOST="postgres.railway.internal"
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD="TU_PASSWORD_AUTOGENERADA_POR_RAILWAY"
    POSTGRES_DB="railway"
    POSTGRES_PORT="5432"

    # Puerto HTTP de escucha del contenedor
    PORT="3000"

    # Parámetros de seguridad JWT y bcrypt
    SALT_ROUNDS="10"
    JWT_SECRET="clave_secreta_altamente_segura_para_produccion_icesi_2026"
    JWT_EXPIRES_IN="1h"
    ```

    :::note[Diferencia Fundamental entre DB_HOST Local y de Producción]
    Nota que en producción el `DB_HOST` **no es localhost ni la IP pública**, sino `postgres.railway.internal`. Esto le indica a NestJS que viaje por el túnel privado de alta velocidad dentro de Railway, sin exponer el tráfico de datos a internet.
    :::

    4. Haz clic en **Update Variables**. Railway detectará los cambios y ejecutará un nuevo despliegue automático (*redeploy*).
  </Step>

  <Step number="7" title="Generar Dominio Público y Verificar Despliegue">
    1. Dirígete a la pestaña **Settings** del servicio de NestJS y en la sección **Networking**, haz clic en **Generate Domain**.
    2. Railway te asignará un subdominio público protegido con SSL, por ejemplo:
       ```
       https://interfaces-3-production.up.railway.app
       ```
    3. Entra a la pestaña **Deployments** y pulsa en **View Logs**. Deberás ver los registros habituales del arranque de NestJS:
       ```text
       [NestFactory] Starting Nest application...
       [InstanceLoader] TypeOrmModule dependencies initialized
       [InstanceLoader] AuthModule dependencies initialized
       [RoutesResolver] AuthController {/api/v1/auth}:
       [NestApplication] Nest application successfully started on port 3000
       ```
    4. Abre tu colección en **Postman** (o navegador web), actualiza la variable `{{base_url}}` con tu nuevo dominio de Railway y ejecuta las peticiones para comprobar que la API responda en la nube con la misma exactitud que en tu entorno local.
  </Step>
</StepByStep>

---

## 8. Resumen de Buenas Prácticas para Producción

1. **Nunca incluyas secretos en el código fuente**: Utiliza siempre el archivo `.env` localmente y el gestor de variables de entorno de tu proveedor en la nube.
2. **Aprovecha el cacheo de capas de Docker**: Mantén siempre la copia de `package.json` y `npm ci` antes de copiar el resto del código (`COPY . .`). De esta forma, si modificas un controlador de NestJS, Docker no tardará minutos reinstalando paquetes.
3. **Mantén una imagen de producción limpia**: Nunca dejes herramientas como TypeScript Compiler (`tsc`) o ejecutables de pruebas dentro de la imagen productiva final.
4. **Utiliza la red interna para bases de datos**: El acceso público a PostgreSQL solo debe estar habilitado durante tareas administrativas de desarrollo; las aplicaciones en producción deben conectarse siempre por la red privada interna.
