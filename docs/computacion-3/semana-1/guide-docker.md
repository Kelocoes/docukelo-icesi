---
sidebar_position: 3
---

# Guía de configuración de Docker

## Instalación y configuración de Docker

### Windows

1. Descargar Docker Desktop desde el sitio oficial de Docker.

<img src="/img/docker-install-win.png" alt="Descargar Docker Desktop" width="800"/>

2. Ejecutar el instalador y seguir las instrucciones en pantalla.
3. Una vez instalado, abrir Docker Desktop y asegurarse de que esté en ejecución.

A este punto es posible que necesites habilitar o instalar el WSL (Windows Subsystem for Linux) para que Docker funcione correctamente. Puedes seguir las instrucciones en la [documentación oficial de Docker](https://docs.docker.com/desktop/windows/wsl/) para habilitar WSL.

4. Para verificar que Docker está instalado correctamente, puedes abrir el Docker Desktop y ejecutar el siguiente comando en la terminal:

```bash
docker --version
```

### Linux (Ubuntu)

Sigue la guía oficial de [instalación de Docker en Ubuntu](https://docs.docker.com/desktop/setup/install/linux/ubuntu) para instalar Docker en tu sistema.


## Despliegue de una aplicación con Spring Boot y React en Docker

Para mantener simple el ejemplo, utilizaremos una aplicación de Spring Boot y React básica donde consumiremos una API. A continuación, se describen los pasos para desplegar esta aplicación utilizando Docker.

### Backend - Creación del Dockerfile 

Primero asumimos que estás usando maven, aunque realmente puedes usar cualquier herramienta de construcción que prefieras. Crea un archivo llamado `Dockerfile` en la raíz de tu proyecto de Spring Boot con el siguiente contenido:

```bash
# Etapa 1: Build del WAR
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Deploy del WAR en Tomcat
FROM tomcat:9-jdk17
COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

```

Aquí podemos observar algo llamado **multi-stage build**. Esto nos permite crear una imagen más liviana al separar el proceso de construcción del de ejecución. En la primera etapa, usamos una imagen de Maven para compilar el proyecto y generar el archivo WAR. En la segunda etapa, usamos una imagen de Tomcat para desplegar el WAR generado.

### Frontend - Creación del Dockerfile

Crea un archivo llamado `Dockerfile` en la raíz de tu proyecto de React con el siguiente contenido:

```bash
# Etapa 1: contruccion
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: servir con nginx (proxy reverso)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

Ya que estamos proponiendo usar nginx, es necesario crear un archivo de configuración llamado `nginx.conf` en la raíz de tu proyecto de React con el siguiente contenido:

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

Esto configura Nginx para servir tu aplicación React y manejar correctamente las rutas, sino es probable que redirija a una página 404 si intentas acceder a rutas que no existen como archivos estáticos.

### Construcción de las imágenes usando docker-compose

Crea un archivo llamado `docker-compose.yml` en la raíz de tu proyecto con el siguiente contenido:

```yaml
services:
  db:
    image: postgres:14.18
    container_name: postgres-db
    environment:
      - POSTGRES_DB=db-docker-spring-react
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5440:5432"

  backend:
    build:
      context: ./demo
      dockerfile: Dockerfile
    container_name: spring-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/db-docker-spring-react
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    depends_on:
      - db
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ./my-react-app
      dockerfile: Dockerfile
    container_name: react-frontend
    ports:
      - "3001:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

En este archivo `docker-compose.yml`, se definen tres servicios:

- **db**: Utiliza la imagen oficial de PostgreSQL y configura las variables de entorno necesarias para crear una base de datos y un usuario.
- **backend**: Construye la imagen del backend de Spring Boot desde el Dockerfile ubicado en la carpeta `demo`. Configura las variables de entorno necesarias para conectarse a la base de datos PostgreSQL y expone el puerto 8080.
- **frontend**: Construye la imagen del frontend de React desde el Dockerfile ubicado en la carpeta `my-react-app` y expone el puerto 3000.

### Construcción y ejecución de los contenedores

1. Asegurate que Docker y Docker Compose estén instalados y funcionando correctamente.
2. Abre una terminal y navega al directorio donde se encuentra tu archivo `docker-compose.yml`.
3. Ejecuta el siguiente comando para construir y ejecutar los contenedores:

```bash
docker-compose up --build
```
Esto construirá las imágenes de tu aplicación y levantará los contenedores definidos en el archivo `docker-compose.yml`.

4. Una vez que los contenedores estén en ejecución, podrás acceder a tu aplicación React en `http://localhost:3000` y al backend de Spring Boot en `http://localhost:8080`.