---
sidebar_position: 2
---

# Express con TypeScript

Express es un framework minimalista para Node.js que permite construir aplicaciones y APIs de forma sencilla. En este documento aprenderemos a usarlo con TypeScript, configurando un proyecto desde cero y explorando ejemplos prácticos.

---

## 1. Instalación y configuración del proyecto

### 1.1 Crear el proyecto
```bash
mkdir proyecto-express-ts
cd proyecto-express-ts
npm init -y
```

### 1.2 Instalar dependencias
```bash
npm install express
npm install -D typescript ts-node @types/node @types/express nodemon
```

### 1.3 Configurar TypeScript
```bash
npx tsc --init
```
Configura `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 2. Primer servidor Express con TypeScript

Estructura del proyecto:
```
proyecto-express-ts/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
```

Archivo `src/index.ts`:
```typescript
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hola mundo desde Express + TypeScript!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
```

---

## 3. Scripts para desarrollo
En `package.json`:
```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```
Iniciar en modo desarrollo:
```bash
npm run dev
```

---

## 4. Middleware en Express con TypeScript

### Middleware global
```typescript
app.use(express.json());

app.use((req: Request, res: Response, next: Function) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

### Middleware específico
```typescript
const verificarToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers['authorization'];
  if (token === '12345') {
    next();
  } else {
    res.status(401).send('No autorizado');
  }
};

app.get('/protegido', verificarToken, (req: Request, res: Response) => {
  res.send('Acceso concedido');
});
```

---

## 5. Rutas y controladores

### routes/userRoutes.ts
```typescript
import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Lista de usuarios');
});

router.post('/', (req: Request, res: Response) => {
  res.send(`Usuario creado: ${req.body.nombre}`);
});

export default router;
```

### index.ts
```typescript
import userRoutes from './routes/userRoutes';
app.use('/usuarios', userRoutes);
```

---

## 6. Tipado de datos

### Definir una interfaz para un usuario
```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

const usuarios: Usuario[] = [];

app.post('/usuarios', (req: Request, res: Response) => {
  const nuevoUsuario: Usuario = req.body;
  usuarios.push(nuevoUsuario);
  res.json(nuevoUsuario);
});
```

---

## 7. Manejo de errores
```typescript
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});
```
