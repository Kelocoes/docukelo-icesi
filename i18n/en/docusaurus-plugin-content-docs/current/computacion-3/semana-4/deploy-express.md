---
sidebar_position: 2
---

# Deploying Express with MongoDB using Railway

Deployment on Railway

## 1. Create a Railway Account

1. Go to [Railway](https://railway.com/)
2. Sign up with GitHub

## 2. Create a MongoDB Database

1. Select **Create > Database**
2. Choose **MongoDB**
3. Railway will automatically provision the database.
4. Copy the MongoDB connection URL displayed in the database settings section. This URL is required to connect your Express application to the MongoDB database.

## 3. Link your Express Repository with Railway

1. Click **Create**
2. Choose **Deploy from GitHub repo**
3. Select the Express repository you wish to deploy.
4. Select the newly created service node for your repository.
5. Go to **Settings** and configure necessary settings such as the branch you want to deploy.
6. Go to **Variables** and add required environment variables, such as the `MONGODB_URI` created earlier:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
   - Make sure to replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your actual credentials.

> **Note:** If you are deploying an app created using earlier course guides, keep the following checklist in mind:
- In `package.json`, ensure you have build and start scripts for transpiling TypeScript:
  ```json
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
  ```
- Ensure you use a package like `dotenv` to load environment variables. Install it via:
  ```bash
  npm install dotenv
  ```
- In your main entry file (e.g., `index.ts`), load `dotenv` at the very top:
  ```typescript
  import dotenv from 'dotenv';
  dotenv.config();
  ```
- Ensure proper CORS configuration if accessing your API from a frontend. Install `cors`:
  ```bash
  npm install cors
  npm install -D @types/cors
  ```
  And enable it in your main file:
  ```typescript
  import cors from 'cors';
  app.use(cors());
  ```

## 4. Generate a Public Domain

1. Go to the **Settings** tab.
2. In the **Networking** section, select **Generate Domain**.
3. This provides a public URL to access your deployed Express REST application.
