---
sidebar_position: 4
---

# Astro Landing Demo (Islands + React)

- Julián Mendoza
- Sebastián Díaz
- Sara Díaz

Step-by-step guide for creating a simple landing page with **Astro**, using **Islands Architecture** with React for client-side interactivity.

Reference: [Official Astro Documentation](https://docs.astro.build/en/getting-started/)

## What is Astro and why use it for landings?

**Astro** is a web framework designed for speed by default. Its core philosophy is to produce optimized static HTML and ship **zero JavaScript to the client** unless explicitly requested. When interactivity is needed, you enable **Islands**: small UI components (React, Vue, Svelte, etc.) that hydrate independently without turning the entire site into a Single Page Application (SPA).

- **Performance by default**: Less JS payload, less client-side rendering, higher Core Web Vitals scores.
- **Modern DX**: Mix and match multiple UI frameworks and pick the best tool for each section.
- **Content scaling**: Ideal for landing pages, blogs, documentation sites, and marketing pages where 90% of content is static.

Compared to traditional SPAs (e.g. Next.js/React in full client mode):
- Astro avoids sending the full React runtime if you don't need it. A landing page built with Astro can weigh kilobytes instead of megabytes.
- React/Vue/Svelte are used as targeted "islands" for interactivity: buttons, forms, toggles, widgets, etc.

Learn more: [Astro Getting Started Guide](https://docs.astro.build/en/getting-started/)

## 1) Prerequisites

- Node.js 18+
- npm 9+

## 2) Create the Project

Inside your workspace folder:

```powershell
npm create astro@latest . -- --template minimal --yes
```

This generates the minimal starter project structure.

## 3) Install Dependencies and React Integration

```powershell
npm install
npm install @astrojs/react react react-dom
```

Edit `astro.config.mjs` to enable React integration:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## 4) Project Directory Structure

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

## 5) Core Application Code

### 5.1 Base Layout

```astro
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
<html lang="en" class="no-js">
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
          <a href="/#features">Features</a>
          <a href="/about" data-astro-prefetch>About</a>
          <ThemeToggle client:idle />
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>Built with Astro · <a href="https://docs.astro.build/en/getting-started/">Docs</a></p>
    </footer>
  </body>
</html>
```

### 5.2 Global CSS Styles

```css
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

### 5.3 React Islands: Interactivity Where Needed

In Astro, a React component becomes interactive when adding a `client:*` directive inside `.astro` templates.

- `client:load`: Hydrates immediately upon page load.
- `client:idle`: Hydrates when the main thread is idle.
- `client:visible`: Hydrates when the component enters the viewport.
- `client:media="(prefers-reduced-motion)"`: Hydrates under a CSS media query.

This gives fine-grained control over when to ship and hydrate client JS.

Interactive Counter:

```tsx
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

Theme Toggle:

```tsx
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

### 5.4 Hero Section (Combining Astro + React)

```astro
---
// src/components/Hero.astro
import Counter from "./Counter";
---
<section class="hero">
  <div>
    <h1>Build Faster with Astro</h1>
    <p>Interactive islands where needed, ultra-fast static HTML everywhere else.</p>
    <Counter client:load />
  </div>
</section>
```

### 5.5 Pages

Home Page (`src/pages/index.astro`):

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
---
<BaseLayout title="Astro Landing Demo">
  <Hero />
  <section id="features" class="section">
    <h2>Features</h2>
    <div class="grid">
      <div class="card"><h3>Islands</h3><p class="muted">On-demand interactivity.</p></div>
      <div class="card"><h3>Performance</h3><p class="muted">Zero JS by default.</p></div>
      <div class="card"><h3>Integrations</h3><p class="muted">React, Vue, Svelte…</p></div>
    </div>
  </section>
</BaseLayout>
```

About Page (`src/pages/about.astro`):

```astro
---
// src/pages/about.astro
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="About">
  <section class="section">
    <h1>About</h1>
    <p class="muted">Additional route for demo purposes.</p>
  </section>
</BaseLayout>
```

## 6) Run the Project

```powershell
npm run dev
```

The site will be served locally at `http://localhost:4321`.

## 7) Build for Production

```powershell
npm run build
npm run preview
```

## 8) Key Architectural Concepts Used

- **Islands Architecture**: React components hydrated on demand via `client:*` directives inside Astro pages.
- **Hybrid Static/SSR**: Astro prioritizes static HTML and adds JS only when explicitly requested.
- **Prefetching**: `data-astro-prefetch` for fast client-side navigation.

## 9) Why This Landing Page is Performant

- Main UI is pure HTML/CSS rendered at build time with no mandatory client JS.
- Islands (Counter, ThemeToggle) hydrate on demand, minimizing performance cost.
- Instant navigation via `data-astro-prefetch` without turning the page into an expensive SPA.

## 10) Quick Comparison with Alternatives

- **Pure SPAs (React/Vite, Vue)**: Full client-side interactivity, but higher JS payload and slower initial paint for simple landing pages.
- **Traditional SSR**: Good initial HTML, but can ship heavy JS bundles if the app operates as a full SPA. Astro keeps JS opt-in.
- **Classic SSGs**: Good static HTML, but adding interactive components requires manual DOM manipulation. Astro integrates UI islands natively.

## 11) Troubleshooting

- Error "Astro.resolve is not a function": Import CSS files directly in frontmatter scripts instead of using `Astro.resolve` in Astro v5.
- Random folder name (e.g. `stellar-saturn`): Appears if target folder wasn't empty when running `create astro`. Delete the unused generated folder.

---

Official documentation reference: [Astro Getting Started Guide](https://docs.astro.build/en/getting-started/).
