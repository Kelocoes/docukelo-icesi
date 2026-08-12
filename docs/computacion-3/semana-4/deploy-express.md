---
sidebar_position: 2
---

# Despliegue de Express con MongoDB usando Railway

Despliegue en Railway

## 1. Crear cuenta en Railway

1. Ir a [Railway](https://railway.com/)
2. Registrarse con GitHub

## 2. Crear una base de datos con MongoDB

1. Selecciona create > Database
2. Selecciona MongoDB
3. Automáticamente empezará a crear la base de datos
4. Copia la URL de conexión de MongoDB que se muestra en la sección de configuración de la base de datos. Esta URL es necesaria para conectar tu aplicación Express con la base de datos MongoDB.

## 3. Enlaza tu repositorio de Express con Railway

1. Presiona la opción create
2. Escoje la opción de Deploy from GitHub
3. Selecciona el repositorio de Express que quieres desplegar
4. Selecciona el nuevo nodo creado para tu repositorio
5. Ve al apartado de Settings y agrega las configuraciones necesarias como la rama que deseas desplegar
6. Ve al apartado de variables y agrega las variables de entorno necesarias, como la URL de la base de datos de MongoDB que creaste anteriormente. Por ejemplo:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
   - Asegúrate de reemplazar `<username>`, `<password>`, `<cluster-url>` y `<database-name>` con los valores correspondientes.

> **Nota:** Es posible que la aplicación que deseas desplegar sea la creada usando las guías de este curso, no obstante hay algunas correcciones que debo de remarcar:
- En el archivo `package.json`, asegúrate de tener un script para transpilar el código TypeScript a JavaScript. Por ejemplo:
  ```json
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
  ```
- Asegúrate de estar usando una librería como `dotenv` para manejar las variables de entorno. Instala la librería con:
  ```bash
  npm install dotenv
  ```
- En tu archivo principal (por ejemplo, `index.ts`), asegúrate de cargar las variables de entorno al inicio del archivo:
  ```typescript
    import dotenv from 'dotenv';
    dotenv.config();
  ```

- Asegúrate de que tu aplicación tenga la configuración de CORS adecuada si planeas acceder a ella desde un frontend. Puedes usar el paquete `cors`:
  ```bash
  npm install cors
  npm install -D @types/cors
  ```
  Y en tu archivo principal:
  ```typescript
  import cors from 'cors';
  app.use(cors());
  ```

## 4. Genera un dominio público

1. Ve al apartado de Settings
2. En la sección de Networking selecciona la opción de generar un dominio público.
3. Esto te proporcionará una URL pública que puedes usar para acceder a tu aplicación Express desplegada.