---
sidebar_position: 5
---

# Deploying Express with MongoDB using Railway

Deployment guide for Express and MongoDB on Railway.

## 1. Create a Railway Account

1. Go to [Railway](https://railway.com/)
2. Sign in with GitHub

## 2. Provision a MongoDB Database

1. Select **Create > Database**
2. Choose **MongoDB**
3. Railway will provision the database automatically.
4. Copy the MongoDB connection string displayed in the database settings tab. This URL is required to connect your Express backend to the MongoDB cluster.

## 3. Link your Express Repository with Railway

1. Click **Create**
2. Choose **Deploy from GitHub**
3. Select the Express repository you want to deploy
4. Select the newly created project node for your repository
5. Open the **Settings** tab and configure deployment properties such as the targeted production branch.
6. Open the **Variables** tab and register all necessary environment variables, including the `MONGODB_URI` connection string retrieved previously. For example:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
   - Ensure you replace placeholders (`<username>`, `<password>`, `<cluster-url>`, `<database-name>`) with your actual credentials.

> **Note:** If deploying the project developed through this course's earlier guides, keep the following configuration adjustments in mind:
- In `package.json`, verify you have scripts to compile TypeScript to JavaScript:
  ```json
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
  ```
- Use `dotenv` to manage environment variables. Install the dependency with:
  ```bash
  npm install dotenv
  ```
- In your main entrypoint (e.g., `index.ts`), initialize environment variables at the top of the file:
  ```typescript
  import dotenv from 'dotenv';
  dotenv.config();
  ```

- Configure CORS appropriately if frontend clients will consume your API. Install `cors`:
  ```bash
  npm install cors
  npm install -D @types/cors
  ```
  And configure in your application:
  ```typescript
  import cors from 'cors';
  app.use(cors());
  ```

## 4. Generate a Public Domain

1. Open the **Settings** tab.
2. Under the **Networking** section, select **Generate Domain**.
3. Railway will provision a public URL allowing global access to your deployed Express application.
