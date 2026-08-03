---
sidebar_position: 3
---

# Comandos de Docker

Al utilizar docker, tendremos en cuenta múltiples áreas donde realizar bloques de código o comandos para la configuración de un contenedor. A continuación, se presentan los comandos más comunes y útiles para trabajar con Docker.

## Comandos básicos de Docker

| Comando | Descripción |
|---------|-------------|
| `docker images` | Lista todas las imágenes descargadas. |
| `docker pull <nombre-imagen>:<tag>` | Descarga una imagen desde un repositorio. |
| `docker rmi <nombre-imagen>:<tag>` | Elimina una imagen descargada. |
| `docker create --name <nombre-contenedor> <nombre-imagen>:<tag>` | Crea un contenedor a partir de una imagen. |
| `docker start <id>` | Inicia un contenedor ya creado. |
| `docker run <id>` | Crea e inicia un contenedor (equivale a create + start). |
| `docker rm <nombre-contenedor>` | Elimina un contenedor. |
| `docker stop <id-contenedor>` | Detiene un contenedor en ejecución. |
| `docker ps -a` | Muestra todos los contenedores, incluyendo los detenidos. |
| `docker logs --follow <nombre-contenedor>` | Muestra los logs del contenedor en tiempo real. |
| `docker network ls` | Lista las redes configuradas en Docker. |
| `docker network create <nombre-red>` | Crea una nueva red. |
| `docker network rm <nombre-red>` | Elimina una red existente. |
| `docker build -t <nombre-imagen>:<mi-etiqueta>` | Construye una imagen a partir de un Dockerfile. |


## Estructura de un Dockerfile

Un Dockerfile es un archivo de texto que contiene una serie de instrucciones para construir una imagen de Docker. A continuación, se presenta la estructura básica de un Dockerfile:

```bash
# Dockerfile
FROM <nombre-imagen-base>:<tag>  # Imagen base
MAINTAINER <nombre> <email>  # Información del mantenedor
RUN <comando>  # Comando para ejecutar durante la construcción de la imagen
COPY <origen> <destino>  # Copia archivos al contenedor
ADD <origen> <destino>  # Similar a COPY, pero con más funcionalidades
EXPOSE <puerto>  # Expone un puerto del contenedor
CMD ["<comando>", "<argumentos>"]  # Comando por defecto al iniciar el contenedor
ENTRYPOINT ["<comando>", "<argumentos>"]  # Comando que se ejecuta al iniciar el contenedor
```

¿Qué diferencia hay entre el CMD y ENTRYPOINT?
CMD y ENTRYPOINT son dos instrucciones en un Dockerfile que definen el comando que se ejecutará cuando se inicie un contenedor. La principal diferencia es que CMD proporciona valores por defecto que pueden ser sobrescritos al ejecutar el contenedor, mientras que ENTRYPOINT define un comando fijo que siempre se ejecutará, aunque se puedan añadir argumentos adicionales.

## Estructura de un docker-compose.yml

Un archivo `docker-compose.yml` permite definir y ejecutar aplicaciones multi-contenedor. A continuación, se presenta la estructura básica de un archivo `docker-compose.yml`:

```yaml
version: "3.9"
services:
    backendnode:
        depends_on:
            - mi_postgres
        build: .
        ports: 
            - "3000:3000"
        links:
            - mi_postgres
    mi_postgres:
        image: postgres:14.18
        ports:
            - "5440:5432"
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=postgres
            - POSTGRES_DB=test_docker
        volumes:
            - mi_postgres_data:/var/lib/postgresql/data

volumes:
    mi_postgres_data:
```

En este ejemplo de archivo `docker-compose.yml`, se definen dos servicios: `backendnode` y `mi_postgres`. 

- **backendnode**: 
    - Depende del servicio `mi_postgres` para garantizar que este último se inicie primero.
    - Construye su imagen desde el contexto actual (`build: .`).
    - Expone el puerto `3000` del contenedor al puerto `3000` del host.
    - Utiliza `links` para conectarse al servicio `mi_postgres`.

- **mi_postgres**:
    - Utiliza la imagen oficial de PostgreSQL en su versión `14.18`.
    - Expone el puerto `5432` del contenedor al puerto `5440` del host.
    - Configura variables de entorno para el usuario, contraseña y base de datos predeterminada.
    - Monta un volumen llamado `mi_postgres_data` para persistir los datos de la base de datos.

- **volumes**:
    - Se define un volumen llamado `mi_postgres_data` para almacenar los datos de PostgreSQL de manera persistente.


## Comandos para trabajar con Docker Compose

| Comando | Descripción |
|---------|-------------|
| `docker-compose up` | Inicia los servicios definidos en el archivo `docker-compose.yml`. |
| `docker-compose down` | Detiene y elimina los contenedores, redes y volúmenes creados por `up`. |
| `docker-compose build` | Construye las imágenes de los servicios definidos en el archivo `docker-compose.yml`. |
| `docker-compose logs` | Muestra los logs de todos los servicios. |
| `docker-compose exec <servicio> <comando>` | Ejecuta un comando en un contenedor en ejecución de un servicio específico. |

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-docker-commands-quiz">
  <Question title="¿Qué comando de Docker se utiliza para listar todas las imágenes almacenadas localmente?">
    <Option>docker ps -a</Option>
    <Option correct>docker images</Option>
    <Option>docker network ls</Option>
    <Option>docker pull</Option>
  </Question>
  <Question title="¿Qué comando combina en un solo paso la creación y el inicio de un contenedor?">
    <Option>docker build</Option>
    <Option>docker create</Option>
    <Option correct>docker run</Option>
    <Option>docker start</Option>
  </Question>
  <Question title="¿Para qué se utiliza la instrucción FROM en un Dockerfile?">
    <Option>Para exponer los puertos TCP hacia la red interna.</Option>
    <Option correct>Para especificar la imagen base y su versión a partir de la cual se construirá la nueva imagen.</Option>
    <Option>Para definir el comando por defecto al detener el contenedor.</Option>
    <Option>Para crear un volumen persistente en el sistema anfitrión.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia principal entre las instrucciones CMD y ENTRYPOINT en un Dockerfile?">
    <Option>CMD requiere permisos de administrador mientras que ENTRYPOINT se ejecuta como usuario sin privilegios.</Option>
    <Option correct>CMD proporciona valores por defecto que pueden ser sobrescritos al ejecutar, mientras que ENTRYPOINT establece un comando fijo.</Option>
    <Option>ENTRYPOINT se ejecuta durante la construcción de la imagen y CMD únicamente al publicar en el registro.</Option>
    <Option>No existe diferencia; ambas instrucciones son totalmente idénticas.</Option>
  </Question>
  <Question title="¿Qué directiva de Dockerfile permite copiar archivos locales desde el host hacia el sistema de archivos del contenedor?">
    <Option>EXPOSE</Option>
    <Option>MAINTAINER</Option>
    <Option correct>COPY</Option>
    <Option>RUN</Option>
  </Question>
  <Question title="En un archivo docker-compose.yml, ¿qué directiva asegura que el contenedor mi_postgres se inicie antes que backendnode?">
    <Option>environment</Option>
    <Option correct>depends_on</Option>
    <Option>volumes</Option>
    <Option>ports</Option>
  </Question>
  <Question title="En la configuración de docker-compose.yml, ¿qué función cumple la sección volumes?">
    <Option>Limita el consumo de memoria RAM de la base de datos.</Option>
    <Option>Mapea las variables de entorno de autenticación del usuario.</Option>
    <Option correct>Almacena los datos de la base de datos de manera persistente fuera del ciclo efímero del contenedor.</Option>
    <Option>Expone el puerto 5432 del contenedor hacia la red pública.</Option>
  </Question>
  <Question title="¿Qué comando de Docker Compose se debe ejecutar para detener y eliminar contenedores, redes y volúmenes definidos?">
    <Option>docker-compose stop</Option>
    <Option correct>docker-compose down</Option>
    <Option>docker-compose rmi</Option>
    <Option>docker-compose clear</Option>
  </Question>
  <Question title="¿Qué comando permite ejecutar una instrucción interna dentro de un servicio activo de Docker Compose?">
    <Option>docker-compose run &lt;servicio&gt;</Option>
    <Option correct>docker-compose exec &lt;servicio&gt; &lt;comando&gt;</Option>
    <Option>docker-compose build &lt;servicio&gt;</Option>
    <Option>docker-compose logs &lt;servicio&gt;</Option>
  </Question>
  <Question title="¿Qué bandera del comando docker build permite asignar un nombre amigable y etiqueta (tag) a la imagen construida?">
    <Option>-p</Option>
    <Option>-d</Option>
    <Option correct>-t</Option>
    <Option>-v</Option>
  </Question>
</Quiz>
