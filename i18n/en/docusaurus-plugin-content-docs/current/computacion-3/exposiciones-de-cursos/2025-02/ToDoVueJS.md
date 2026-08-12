---
sidebar_position: 6
---

# ToDo Vue.js Guide

### Key Vue.js Concepts:

- **Components:** Vue organizes code into reusable components. A component is a `.vue` file containing 3 sections: `<template>` (HTML structure), `<script>` (JS/TS logic), and `<style>` (CSS styles).
- **Interpolation:** `{{ }}` renders reactive expressions in HTML.
- **Directives:** Special `v-` HTML attributes that attach dynamic behavior to DOM elements.
- **Computed Properties:** Derived values that automatically recalculate when their dependent reactive sources change.
- **Reactive State:** In the Composition API, `ref()` declares reactive state wrapped inside a `.value` property.

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm (bundled with Node)
- VS Code & Volar extension (plus optional Tailwind CSS IntelliSense)

**Project Structure:**

```
project-root/
└── frontend/
    ├── index.html
    ├── package.json
    ├── postcss.config.cjs
    ├── tailwind.config.cjs
    └── src/
        ├── main.js
        ├── index.css
        ├── App.vue
        ├── stores/
        │   └── todoStore.ts
        ├── composables/
        │   └── useDarkMode.ts
        └── components/
            ├── TodoList.vue
            └── AISidebar.vue
```

## 1) Create the Project (Vite + Vue)

Open a terminal in your workspace root:

```bash
# Scaffold frontend with Vite
npm create vite@latest frontend -- --template vue

cd frontend
npm install
```

`--template vue` generates a pre-configured Vue 3 project structure.

## 2) Install Additional Dependencies

```bash
# Inside frontend/
npm install pinia

# Tailwind v4 + PostCSS plugin
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

To generate configuration files automatically:

```bash
npx tailwindcss init -p
```

## 3) PostCSS / Tailwind Configuration (Tailwind v4)

Create `postcss.config.cjs` inside `frontend/`:

```js
// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
```

Create `tailwind.config.cjs`:

```js
// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

> **Note:** If `package.json` specifies `"type": "module"`, use `.cjs` configuration files for PostCSS and Tailwind to avoid ESM/CJS loader conflicts.

### `package.json` Reference Checklist

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.11.0",
    "pinia": "^3.0.3",
    "vue": "^3.5.18"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.13",
    "@vitejs/plugin-vue": "^6.0.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.13",
    "vite": "^7.1.2"
  }
}
```

## 4) Global Styles: `src/index.css`

Create `src/index.css`:

```css
/* src/index.css - Tailwind v4 import */
@import "tailwindcss";

html {
  color-scheme: light dark;
}

/* Enable dark mode class selector in Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

/* List transitions */
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(4px); }
.list-enter-active, .list-leave-active { transition: all 200ms ease; }
.list-move { transition: transform 200ms ease; }
```

## 5) Enable Pinia in `src/main.js`

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## 6) State Management: `src/stores/todoStore.ts`

Create `src/stores/todoStore.ts` (TypeScript):

```ts
// src/stores/todoStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Priority = 'low' | 'medium' | 'high'
type Task = { id: number; text: string; done: boolean; priority: Priority; dueDate: string | null }

export const useTodoStore = defineStore('todo', () => {
  const loaded = JSON.parse(localStorage.getItem('todos') || '[]') as any[]
  const todos = ref<Task[]>(
    Array.isArray(loaded)
      ? loaded.map((t: any) => ({
          id: Number(t?.id) || Date.now(),
          text: String(t?.text ?? ''),
          done: Boolean(t?.done),
          priority: (t?.priority === 'low' || t?.priority === 'medium' || t?.priority === 'high') ? t.priority : 'medium',
          dueDate: typeof t?.dueDate === 'string' ? t.dueDate : null,
        }))
      : []
  )

  function add(text: string, priority: Priority = 'medium', dueDate: string | null = null) {
    todos.value.push({ id: Date.now(), text, done: false, priority, dueDate })
    persist()
  }

  function remove(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
    persist()
  }

  function toggle(id: number) {
    const t = todos.value.find(x => x.id === id)
    if (t) t.done = !t.done
    persist()
  }

  function setDone(id: number, done: boolean) {
    const t = todos.value.find(x => x.id === id)
    if (t) t.done = done
    persist()
  }

  function updateText(id: number, text: string) {
    const t = todos.value.find(x => x.id === id)
    if (t) t.text = text
    persist()
  }

  function updatePriority(id: number, priority: Priority) {
    const t = todos.value.find(x => x.id === id)
    if (t) t.priority = priority
    persist()
  }

  function updateDueDate(id: number, dueDate: string | null) {
    const t = todos.value.find(x => x.id === id)
    if (t) t.dueDate = dueDate && dueDate.length > 0 ? dueDate : null
    persist()
  }

  function clearDone() {
    todos.value = todos.value.filter(t => !t.done)
    persist()
  }

  function persist() {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  return { todos, add, remove, toggle, setDone, updateText, updatePriority, updateDueDate, clearDone }
})
```

## 7) Core Component: `src/components/TodoList.vue`

```vue
<template>
  <div class="max-w-xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
    <h1 class="text-2xl font-bold mb-4">To-Do List</h1>

    <form @submit.prevent="onAdd" class="flex gap-2 mb-4">
      <input v-model="text" placeholder="Add a task..." class="flex-1 rounded-md p-2 border" />
      <select v-model="priority" class="rounded-md p-2 border">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" v-model="dueDate" class="rounded-md p-2 border" />
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-md">Add</button>
    </form>

    <h2 class="mt-2 font-semibold">Pending</h2>
    <TransitionGroup name="list" tag="ul" class="space-y-2">
      <li v-for="t in pendingTodos" :key="t.id" class="flex items-center gap-3">
        <input type="checkbox" :checked="t.done" @change="(e:any) => store.setDone(t.id, e.target.checked)" />
        <input v-model="t.text" @blur="() => store.updateText(t.id, t.text)" class="flex-1 bg-transparent" />
        <select :value="t.priority" @change="(e:any) => store.updatePriority(t.id, e.target.value)" class="rounded-md p-1 border">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" :value="t.dueDate || ''" @input="(e:any) => store.updateDueDate(t.id, e.target.value)" class="rounded-md p-1 border" />
        <button @click="store.remove(t.id)" class="text-red-500">✖</button>
      </li>
    </TransitionGroup>

    <h2 class="mt-6 font-semibold">Completed</h2>
    <TransitionGroup name="list" tag="ul" class="space-y-2">
      <li v-for="t in doneTodos" :key="t.id" class="flex items-center gap-3 opacity-70">
        <input type="checkbox" :checked="t.done" @change="(e:any) => store.setDone(t.id, e.target.checked)" />
        <input v-model="t.text" @blur="() => store.updateText(t.id, t.text)" class="flex-1 bg-transparent line-through" />
        <select :value="t.priority" @change="(e:any) => store.updatePriority(t.id, e.target.value)" class="rounded-md p-1 border">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" :value="t.dueDate || ''" @input="(e:any) => store.updateDueDate(t.id, e.target.value)" class="rounded-md p-1 border" />
        <button @click="store.remove(t.id)" class="text-red-500">✖</button>
      </li>
    </TransitionGroup>

    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-slate-500">{{ remaining }} tasks pending</div>
      <div class="flex gap-2">
        <button @click="store.clearDone" class="text-sm px-3 py-1 border rounded">Clear Completed</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const text = ref('')
const priority = ref<'low'|'medium'|'high'>('medium')
const dueDate = ref('')

function onAdd() {
  if (!text.value.trim()) return
  store.add(text.value.trim(), priority.value, dueDate.value || null)
  text.value = ''
  priority.value = 'medium'
  dueDate.value = ''
}

const remaining = computed(() => store.todos.filter(t => !t.done).length)
const pendingTodos = computed(() => store.todos.filter(t => !t.done))
const doneTodos = computed(() => store.todos.filter(t => t.done))
</script>
```

## 8) Dark Mode Composable: `src/composables/useDarkMode.ts`

```ts
import { ref, onMounted, watchEffect } from 'vue'

const STORAGE_KEY = 'color-scheme'

export function useDarkMode() {
  const isDark = ref(false)

  function applyClass(value: boolean) {
    const root = document.documentElement
    if (value) root.classList.add('dark')
    else root.classList.remove('dark')
  }

  function loadInitial() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyClass(isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  onMounted(loadInitial)

  watchEffect(() => {
    applyClass(isDark.value)
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  })

  return { isDark, toggle }
}
```

## 9) Main Application Layout: `src/App.vue`

```vue
<template>
  <div class="min-h-screen p-8 flex gap-6 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <button @click="toggle()" class="px-3 py-1 text-sm border rounded">
        {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
    </div>
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoList from './components/TodoList.vue';
import { useDarkMode } from './composables/useDarkMode';

const { isDark, toggle } = useDarkMode()
</script>
```

## 10) Running the Application

```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

For production builds:

```bash
npm run build
npm run preview
```
