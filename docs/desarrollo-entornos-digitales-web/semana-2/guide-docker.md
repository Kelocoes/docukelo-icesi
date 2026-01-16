---
sidebar_position: 2
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


## Despliegue de una aplicación de React en Docker

Para mantener simple el ejemplo, utilizaremos una aplicación de React básica donde consumiremos una API. A continuación, se describen los pasos para desplegar esta aplicación utilizando Docker.

### Frontend - Creación del Dockerfile

Crea un archivo llamado `Dockerfile` en la raíz de tu proyecto de React con el siguiente contenido:

```bash
# Etapa 1: contruccion
FROM node:22-alpine AS builder
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
```

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

Si usas basepath en tu aplicación de React, asegúrate de ajustar la configuración de Nginx de la siguiente manera:

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  absolute_redirect off;

  location /dmi {
    try_files $uri $uri/ /dmi/index.html;
  }

}
```

```bash
# Etapa 1: contruccion
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: servir con nginx (proxy reverso)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/dmi # Ajusta según el basepath, en este caso es /dmi
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
### Construcción de las imágenes usando docker-compose

Crea un archivo llamado `docker-compose.yml` en la raíz de tu proyecto con el siguiente contenido:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: react-frontend
    ports:
      - "3001:80"
```

En este archivo `docker-compose.yml`, se definen un servicio, aunque podrías expandirlo para más servicios si tu aplicación lo requiere.

### Construcción y ejecución de los contenedores

1. Asegurate que Docker y Docker Compose estén instalados y funcionando correctamente.
2. Abre una terminal y navega al directorio donde se encuentra tu archivo `docker-compose.yml`.
3. Ejecuta el siguiente comando para construir y ejecutar los contenedores:

```bash
docker compose up --build
```
Esto construirá las imágenes de tu aplicación y levantará los contenedores definidos en el archivo `docker-compose.yml`.

4. Una vez que los contenedores estén en ejecución, podrás acceder a tu aplicación React en `http://localhost:3001`.