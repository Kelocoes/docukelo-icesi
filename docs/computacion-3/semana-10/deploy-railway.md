---
sidebar_position: 3
---

# Deploy en Railway

Railway es una plataforma de despliegue en la nube que permite publicar aplicaciones de forma rápida y sencilla. En esta sección aprenderás a desplegar una aplicación en Railway.

## Paso 1: Crear una cuenta en Railway

Para comenzar, debes crear una cuenta en Railway. Puedes hacerlo visitando su sitio web oficial: [Railway](https://railway.app/).

## Paso 2: Crear el proyecto y configurar la base de datos

Una vez que hayas creado tu cuenta, inicia sesión y haz clic en el botón "New Project" para crear un nuevo proyecto en Railway.

Antes de agregar la aplicación, configura primero la base de datos. Ve a la sección `+ Add` y selecciona el tipo de base de datos que deseas usar (por ejemplo, PostgreSQL o MySQL). Sigue las instrucciones para crearla y obtener sus credenciales.

Si estás trabajando completamente en Railway, usa las credenciales internas proporcionadas por la plataforma para conectar la aplicación, ya que están diseñadas para funcionar dentro del entorno de Railway y pueden diferir de las credenciales externas.

<img src="/img/railway-3.png" alt="Configuración de la base de datos en Railway" width="800" />

## Paso 3: Agregar y configurar la aplicación

Con la base de datos ya creada, agrega ahora la aplicación. En el campo `What would you like to create?` de `+ Add`, selecciona `GitHub Repository` y luego el repositorio que deseas desplegar. Recuerda que el repositorio debe ser público para que Railway pueda acceder a él.

Después de seleccionar el repositorio y la rama, configura las variables de entorno de la aplicación, incluyendo las credenciales de la base de datos que creaste en el paso anterior.

En la sección `Build`, define el comando de construcción y el comando de inicio. Por ejemplo, para una aplicación Node.js puedes usar `npm install` como comando de construcción y `npm start` como comando de inicio. Si tu proyecto usa Docker, configura la construcción para que utilice tu archivo `Dockerfile`.

<img src="/img/railway-1.png" alt="Creación de proyecto en Railway" width="800" />

<img src="/img/railway-2.png" alt="Configuración del despliegue en Railway" width="800" />

## Paso 4: Desplegar y publicar

Al finalizar, ve al apartado `Settings` y, en la sección `Networking`, selecciona `Generate Domain` para generar el dominio de tu aplicación y compartirla.

Cuando la base de datos, las variables de entorno y la configuración de `Build` estén listas, haz clic en `Deploy` para iniciar el despliegue.

