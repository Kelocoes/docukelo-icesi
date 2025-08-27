---
sidebar_position: 3
---


# Introducción a Node.js y NPM



## 1. ¿Qué es Node.js?

- **Node.js** es un **entorno de ejecución de JavaScript**.  
- Permite ejecutar JavaScript fuera del navegador, por ejemplo en tu computadora o en un servidor.  
- Con Node.js puedes crear aplicaciones de servidor, herramientas de línea de comandos, APIs, etc.

Ejemplo: un archivo `hola.js`
```js
console.log("Hola desde Node.js");
```

Lo ejecutas en la terminal:
```bash
node hola.js
```

---

## 2. ¿Qué es NPM?

- **NPM** significa **Node Package Manager**.  
- Es el **gestor de paquetes** que viene junto con Node.js.  
- Sirve para instalar librerías o frameworks que otros programadores han creado.  

Ejemplo:
```bash
npm install express
```
Esto descarga la librería **Express** para hacer servidores web.

---

## 3. Comandos principales de NPM

| Comando                        | Descripción |
|--------------------------------|-------------|
| `npm init -y`                  | Crea un proyecto Node con un `package.json` por defecto |
| `npm install <paquete>`        | Instala un paquete y lo agrega a dependencias |
| `npm install -D <paquete>`     | Instala un paquete como **dependencia de desarrollo** |
| `npm install`                  | Instala todas las dependencias de `package.json` |
| `npm uninstall <paquete>`      | Elimina un paquete |
| `npm update`                   | Actualiza los paquetes |

---

## 4. Archivos importantes en un proyecto Node

### 4.1 package.json

Es el archivo principal del proyecto. Contiene información como:

- **name** → nombre del proyecto  
- **version** → versión actual  
- **scripts** → comandos personalizados (ej: `npm start`)  
- **dependencies** → librerías que tu proyecto necesita para funcionar  
- **devDependencies** → librerías que se usan solo para desarrollo  

Ejemplo:
```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "echo 'No hay tests todavía'"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
```

### 4.2 node_modules

Es la **carpeta** donde se instalan las librerías que descargas con NPM.  
- Puede ser muy grande.  
- **No se debe subir a GitHub** (se ignora en `.gitignore`).  
- Siempre se puede volver a generar ejecutando `npm install`.

### 4.3 package-lock.json

- Se genera automáticamente al instalar dependencias.  
- Guarda las versiones exactas de cada paquete y sus sub-dependencias.  
- Garantiza que cualquier persona que instale tu proyecto obtenga las mismas versiones.

---

## 5. Dependencias

### Dependencias normales (`dependencies`)
- Necesarias para que el programa funcione.  
- Ejemplo: Express, React, Vue.

Instalación:
```bash
npm install express
```

### Dependencias de desarrollo (`devDependencies`)
- Solo se usan en desarrollo, no en producción.  
- Ejemplo: nodemon, eslint, jest.

Instalación:
```bash
npm install -D nodemon
```

---

## 6. Versiones de paquetes en NPM

Cuando instalas una librería, NPM guarda su versión.  
Por ejemplo: `"express": "^4.18.0"`

### ¿Qué significa el símbolo `^`?
- `^` → Permite actualizaciones de **parche** y **minor**, pero no de **major**.  
  Ejemplo: `^4.18.0` puede actualizar hasta `4.19.5` pero no a `5.0.0`.

### Otros símbolos:
- `~` → Solo actualiza parches (ej: `~4.18.0` → `4.18.5`, pero no `4.19.0`).  
- Sin símbolo → Instala exactamente esa versión.  
- `*` → Cualquier versión.

---

## 7. Scripts de NPM

Dentro de `package.json` puedes definir **scripts** que ejecutas con `npm run`.

Ejemplo en `package.json`:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

Ejecutar:
```bash
npm start
npm run dev
```

---

## 8. Resumen rápido

- **Node.js** → ejecutar JavaScript fuera del navegador.  
- **NPM** → gestor de librerías y dependencias.  
- **package.json** → información del proyecto y dependencias.  
- **node_modules** → carpeta donde se instalan los paquetes.  
- **package-lock.json** → asegura versiones exactas.  
- Dependencias → normales (para producción) y de desarrollo (para programar).  
- Versionado → `^`, `~`, `*` indican cómo se actualizan los paquetes.

