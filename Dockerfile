# syntax=docker/dockerfile:1

# Build multi-stage de DocuKelo.
#
#   deps    -> instala dependencias (capa cacheable mientras no cambie package-lock.json)
#   build   -> compila el sitio con Docusaurus
#   export  -> imagen vacia que solo contiene el sitio estatico; es el objetivo que usa
#              GitHub Actions para extraer `build/` y publicarlo en GitHub Pages
#   serve   -> nginx con el sitio, para revisar el build de produccion en local (stage por defecto)
#
# Publicar (lo hace .github/workflows/deploy.yml):
#   docker buildx build --target export --output type=local,dest=./build .
#
# Revisar en local el build de produccion en http://localhost:8080/:
#   docker build --build-arg BASE_URL=/ -t docukelo .
#   docker run --rm -p 8080:80 docukelo

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:${NODE_VERSION}-alpine AS build
# git es necesario para "Ultima actualizacion" (fecha de cada documento), que se calcula con `git log`.
# El contexto debe incluir .git y, en CI, el checkout debe tener el historial completo.
RUN apk add --no-cache git
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Valores por defecto: los de produccion en GitHub Pages. Se pueden sobreescribir con --build-arg.
ARG SITE_URL=https://kelocoes.github.io
ARG BASE_URL=/docukelo-icesi/
ENV SITE_URL=${SITE_URL} \
    BASE_URL=${BASE_URL} \
    NODE_OPTIONS=--max-old-space-size=4096

# Docker copia el repo como otro usuario; sin esto git se niega a leer el historial.
RUN git config --global --add safe.directory /app \
    && npm run build

FROM scratch AS export
COPY --from=build /app/build /

FROM nginx:1.27-alpine AS serve
ARG BASE_URL=/docukelo-icesi/
COPY nginx.conf /etc/nginx/conf.d/default.conf
# El sitio se coloca bajo su baseUrl para que las rutas coincidan con las del build.
COPY --from=build /app/build /usr/share/nginx/html${BASE_URL}
EXPOSE 80
