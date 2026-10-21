---
sidebar_position: 4
description: "Crea una landing page con Astro usando arquitectura de islas y componentes React para agregar interactividad solo donde hace falta."
---

# Demo Landing con Astro (Islas + React)

- Julián Mendoza
- Sebastián Díaz
- Sara Díaz

Guía paso a paso para crear una landing page sencilla con **Astro**, usando **arquitectura de islas** con React para interactividad.

Referencias: [Documentación oficial de Astro](https://docs.astro.build/en/getting-started/)

## ¿Qué es Astro y por qué usarlo para landings?

**Astro** es un framework para sitios rápidos por defecto. Su enfoque es producir HTML estático optimizado y enviar **cero JavaScript al cliente** a menos que lo solicites. Cuando necesitas interactividad, habilitas **islas**: pequeños componentes de UI (React, Vue, Svelte, etc.) que se hidratan de forma independiente sin convertir toda la página en una SPA.

- **Rendimiento por defecto**: menos JS, menos rendering en el cliente, mejores métricas Core Web Vitals.
- **DX moderna**: soporta múltiples frameworks UI y elige el mejor para cada parte.
- **Escala de contenido**: ideal para landings, blogs, docs y marketing, donde el 90% es contenido estático.

Comparado con SPA tradicionales (ej. Next.js/React en modo full client):
- Astro evita enviar el runtime completo de React si no lo necesitas. Una landing con Astro puede pesar kilobytes en lugar de cientos.
- React/Vue/Svelte se usan como “islas” puntuales para interactividad: botones, formularios, toggles, etc.

Más info: [Guía de inicio de Astro](https://docs.astro.build/en/getting-started/)

## 1) Requisitos

- Node.js 18+
- npm 9+

## 2) Crear el proyecto

Dentro de tu carpeta de trabajo:

```powershell
npm create astro@latest . -- --template minimal --yes
```

Esto genera la estructura base.

## 3) Instalar dependencias e integración de React

```powershell
npm install
npm install @astrojs/react react react-dom
```

Edita `astro.config.mjs` para activar React:

```js title="astro.config.mjs"
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## 4) Estructura del proyecto

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Counter.tsx
│   │   ├── Hero.astro
│   │   └── ThemeToggle.tsx
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── about.astro
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 5) Código principal

### 5.1 Layout base

```astro title="Layout base"
---
// src/layouts/BaseLayout.astro
import ThemeToggle from "../components/ThemeToggle";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const { title = "Demo Astro Landing", description = "A simple landing page built with Astro and islands architecture." } = Astro.props as Props;
---
<!DOCTYPE html>
<html lang="es" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <script is:inline>
      (function () {
        try {
          var stored = localStorage.getItem("theme");
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          var useDark = stored ? stored === 'dark' : prefersDark;
          if (useDark) document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('no-js');
        } catch (_) {}
      })();
    </script>
  </head>
  <body>
    <header>
      <nav>
        <a class="brand" href="/" data-astro-prefetch>Astro Demo</a>
        <div class="nav-links">
          <a href="/#features">Características</a>
          <a href="/about" data-astro-prefetch>Acerca de</a>
          <ThemeToggle client:idle />
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>Hecho con Astro · <a href="https://docs.astro.build/en/getting-started/">Docs</a></p>
    </footer>
  </body>
</html>
```

### 5.2 Estilos globales (CSS sin complicaciones)

```css title="src/styles/global.css"
/* src/styles/global.css */

:root {
	--bg: #0b1020;
	--bg-soft: #0f1730;
	--text: #e7ecff;
	--muted: #b5c0ff;
	--primary: #7c9bff;
	--primary-strong: #5d7df5;
	--accent: #6be3ff;
	--border: #243055;
}

.dark {
	--bg: #070a14;
	--bg-soft: #0b1226;
	--text: #e7ecff;
	--muted: #a7b2e6;
	--primary: #9bb2ff;
	--primary-strong: #7e97ff;
	--accent: #6be3ff;
	--border: #1b2747;
}

* {
	box-sizing: border-box;
}

html, body {
	margin: 0;
	padding: 0;
	background: var(--bg);
	color: var(--text);
	font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
	line-height: 1.6;
}

a {
	color: var(--primary);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

header {
	border-bottom: 1px solid var(--border);
	background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
}

nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1100px;
	margin: 0 auto;
	padding: 16px 24px;
}

.brand {
	display: flex;
	gap: 10px;
	align-items: center;
	font-weight: 700;
	letter-spacing: 0.3px;
}

.nav-links {
	display: flex;
	gap: 16px;
}

main {
	max-width: 1100px;
	margin: 0 auto;
	padding: 32px 24px;
}

footer {
	border-top: 1px solid var(--border);
	padding: 24px;
	text-align: center;
	color: var(--muted);
}

.button {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 18px;
	border-radius: 10px;
	background: var(--primary);
	color: #0b1020;
	font-weight: 700;
	border: 1px solid var(--border);
}

.button.alt {
	background: transparent;
	color: var(--text);
	border-color: var(--border);
}

.hero {
	display: grid;
	grid-template-columns: 1.1fr 0.9fr;
	gap: 28px;
	align-items: center;
	padding: 42px 0;
}

.hero h1 {
	font-size: 44px;
	line-height: 1.1;
	margin: 0 0 12px;
}

.hero p {
	margin: 0 0 20px;
	color: var(--muted);
}

.hero-card {
	border: 1px solid var(--border);
	border-radius: 14px;
	background: linear-gradient(180deg, var(--bg-soft), var(--bg));
	padding: 18px;
}

.pill {
	display: inline-block;
	padding: 6px 10px;
	border: 1px solid var(--border);
	border-radius: 999px;
	color: var(--muted);
	font-size: 12px;
}

.grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 18px;
}

.card {
	border: 1px solid var(--border);
	border-radius: 12px;
	padding: 16px;
	background: var(--bg-soft);
}

.muted {
	color: var(--muted);
}

.section {
	margin: 56px 0;
}

.center {
	text-align: center;
}

.stack {
	display: grid;
	gap: 12px;
}

.row {
	display: flex;
	gap: 12px;
}

.spacer {
	height: 16px;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
```

### 5.3 Islas React: interactividad donde hace falta

En Astro, un componente React se vuelve interactivo agregando una directiva `client:*` al usarlo dentro de un `.astro`.

- `client:load`: hidrata apenas carga la página.
- `client:idle`: hidrata cuando el hilo principal está libre.
- `client:visible`: hidrata cuando el componente entra en el viewport.
- `client:media="(prefers-reduced-motion)"`: hidrata bajo una media query.

Esto te permite controlar “cuándo” enviar e hidratar JS, para mantener la página ligera.

Counter interactivo:

```tsx title="src/components/Counter.tsx"
// src/components/Counter.tsx
import React, { useState } from "react";
export default function Counter(){
  const [count, setCount] = useState(0);
  return (
    <div className="row">
      <button className="button alt" onClick={() => setCount(Math.max(0, count-1))}>-1</button>
      <span>{count}</span>
      <button className="button" onClick={() => setCount(count+1)}>+1</button>
    </div>
  );
}
```

Toggle de tema:

```tsx title="src/components/ThemeToggle.tsx"
// src/components/ThemeToggle.tsx
import React, { useCallback, useEffect, useState } from "react";
export default function ThemeToggle(){
  const [theme, setTheme] = useState<'light'|'dark'>(()=> 'light');
  const applyTheme = useCallback((t:'light'|'dark')=>{
    const root = document.documentElement;
    t === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', t);
  },[]);
  useEffect(()=>{ applyTheme(theme); },[theme,applyTheme]);
  return <button className="button alt" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme==='dark'?'🌙':'☀️'}</button>;
}
```

### 5.4 Sección Hero (mezcla Astro + React)

```astro title="Sección Hero (mezcla Astro + React)"
---
// src/components/Hero.astro
import Counter from "./Counter";
---
<section class="hero">
  <div>
    <h1>Construye más rápido con Astro</h1>
    <p>Islas interactivas donde importan, HTML estático veloz en todo lo demás.</p>
    <Counter client:load />
  </div>
</section>
```

### 5.5 Páginas

Home:

```astro title="Páginas"
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
---
<BaseLayout title="Astro Landing Demo">
  <Hero />
  <section id="features" class="section">
    <h2>Características</h2>
    <div class="grid">
      <div class="card"><h3>Islas</h3><p class="muted">Interactividad bajo demanda.</p></div>
      <div class="card"><h3>Rendimiento</h3><p class="muted">Cero JS por defecto.</p></div>
      <div class="card"><h3>Integraciones</h3><p class="muted">React, Vue, Svelte…</p></div>
    </div>
  </section>
</BaseLayout>
```

About:

```astro title="Páginas (2)"
---
// src/pages/about.astro
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Acerca de">
  <section class="section">
    <h1>Acerca de</h1>
    <p class="muted">Ruta adicional para el demo.</p>
  </section>
</BaseLayout>
```

## 6) Ejecutar el proyecto

```powershell
npm run dev
```

El sitio se sirve en `http://localhost:4321`.

## 7) Construir para producción

```powershell
npm run build
npm run preview
```

## 8) Conceptos clave usados

- **Arquitectura de islas**: componentes React hidratados con `client:*` dentro de páginas Astro.
- **SSR/estático híbrido**: Astro prioriza HTML estático, añade JS solo cuando lo pides.
- **Prefetch**: `data-astro-prefetch` para navegación más rápida.

## 9) ¿Por qué esta landing es eficiente?

- La UI principal es HTML/CSS renderizado en el servidor, sin JS cliente obligatorio.
- Las islas (Counter, ThemeToggle) se hidratan bajo demanda, minimizando el coste.
- Navegación rápida con `data-astro-prefetch` sin convertir todo en SPA.

## 10) Comparativa rápida con alternativas

- **SPA puras (React/Vite, Vue, etc.)**: interactividad total pero coste de JS y tiempo de hidratación más alto para landings simples.
- **SSR tradicional**: buen HTML inicial, pero puede terminar enviando demasiado JS si la app es SPA. Astro mantiene el JS “opt-in”.
- **Static Site Generators clásicos**: buen HTML estático, pero la interactividad suele requerir hacks. Astro integra “islas” de forma nativa.

## 11) Troubleshooting

- Error “Astro.resolve is not a function”: importa CSS en el frontmatter del layout en vez de usar `Astro.resolve` en v5.
- Carpeta aleatoria (ej. `stellar-saturn`): aparece si el directorio no está vacío al crear el proyecto. Borra la carpeta duplicada si no la usas.

---

Más en la documentación oficial: [Guía de inicio Astro](https://docs.astro.build/en/getting-started/).
