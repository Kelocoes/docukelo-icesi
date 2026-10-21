---
sidebar_position: 6
description: "Build a to-do app with Vue, Vite and Tailwind while learning about components and the basic structure of a Vue project."
---

# ToDoVueJS

### Key Vue.js concepts:

**Components:** Vue organizes code into reusable components. A component is a .vue file with 3 sections: `<template> → HTML structure` , `<script> → logic (JS)`, `<style> → styles (CSS)`

**Interpolation:** use `{{ }}`  to display values in the HTML

**Directives:** Vue directives are special HTML attributes with the `v-` prefix that give an HTML tag additional functionality

**Computed properties (computed):** These are values derived from other data. They are recalculated automatically when the data they depend on changes.

**Reactive state:** In the Composition API, the recommended way to declare reactive state is the `ref()` function, which takes an argument and returns it wrapped inside a ref object with a `.value` property

### Requirements

- Node.js 18+ (20+ recommended).

- npm (comes with Node).

- VS Code (recommended) and the Tailwind CSS IntelliSense extension (optional but useful).

**Project structure:**

```text title="Project structure"
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


## 1) Create the project (Vite + Vue)

Open a terminal and run the following in the project root:

```bash title="Create the project (Vite + Vue)"
# scaffold the frontend with Vite (choose "vue" if prompted)
npm create vite@latest frontend -- --template vue

cd frontend

npm install

```

`--template vue`  tells Vite we want a Vue 3 template ready to start.

## 2) Install additional dependencies

```bash title="Install additional dependencies"
# inside frontend/

npm install pinia

# Tailwind v4 + PostCSS plugin recommended by the v4 guide

npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

If you prefer to create the configuration files automatically:

`npx tailwindcss init -p`
(This may generate  `tailwind.config.js` and `postcss.config.js` — in some setups with `"type": "module"`  it is better to rename them to `.cjs`. This guide uses `.cjs` to avoid ESM/CJS conflicts.)


## 3) Minimal PostCSS / Tailwind configuration (Tailwind v4)

Create `postcss.config.cjs` in the `frontend/` root with:

```js title="postcss.config.cjs"

// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
```

Create `tailwind.config.cjs`:

```js title="tailwind.config.cjs"

// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**Note:** if your `package.json` has `"type": "module"`, use `.cjs` files for the PostCSS/Tailwind config to avoid ESM/CJS errors.

- PostCSS acts as an intermediate processor that applies plugins (Tailwind and Autoprefixer).

- The `tailwind.config.cjs` file tells Tailwind where to look for CSS classes in the code.


### Note: check that your package.json matches

```json title="package.json"
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
    "@tailwindcss/postcss7-compat": "^2.2.17",
    "@vitejs/plugin-vue": "^6.0.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.13",
    "vite": "^7.1.2"
  }
}
```


## 4) src/index.css (Tailwind v4 minimal)

Create `src/index.css` with:

```css title="src/index.css"
/* src/index.css - Tailwind v4 import */
@import "tailwindcss";

html {
  color-scheme: light dark;
}

/* Tailwind v4: enable dark mode by class */
@custom-variant dark (&:where(.dark, .dark *));

/* List transitions */
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(4px); }
.list-enter-active, .list-leave-active { transition: all 200ms ease; }
.list-move { transition: transform 200ms ease; }

```

`@import "tailwindcss"` loads the utilities.

`dark` is defined as a variant, which lets you apply dark mode by class `(.dark)`.

Smooth transitions are added for list animations, improving the UX.

**Important:** in Tailwind v4 you use `@import "tailwindcss"`; (not `@tailwind base;` and so on).


## 5) Enable Pinia in src/main.js
Your main.js should look like this:

```js title="src/main.js"
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

```

`createApp` creates the root instance.

`app.use(createPinia())` injects the global store so any component can access the centralized state.

`app.mount` mounts the app in the DOM (#app in index.html).

## 6) Store (Pinia) — src/stores/todoStore.ts


Create src/stores/todoStore.ts (TypeScript):

```ts title="src/stores/todoStore.ts"
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
We define a `useTodoStore` store with:

Reactive state (todos).

Actions: add, remove, toggle, updateText, etc.

Persistence in `localStorage` to keep tasks between reloads.


- `type Priority = 'low' | 'medium' | 'high'` and `type Task = {id: number ...}` Types for robustness (TypeScript).

- `export const useTodoStore = defineStore('todo', () => { ...`: Initial load from localStorage with sanitization. It converts/validates each field to avoid data corruption (for example, if someone modified localStorage).

Store actions (controlled mutations):

Each action modifies `todos` and then calls `persist()`. This guarantees that the app state and the persisted state are always aligned after any change.

`add` uses `Date.now()` as a quick id.

`clearDone` removes all completed tasks at once.

Store exposure: state + public API:

```ts title="Store exposure: state and public API"
return { todos, add, remove, toggle, setDone, updateText, updatePriority, updateDueDate, clearDone }
})
```


## 7) Components: main UI

Here we include: 

- A form to add tasks with text, priority and date.

- A list of pending and done tasks, with inline editing.

- Animations with TransitionGroup.

- A button to clear completed tasks.


**We create src/components/TodoList.vue**

```vue title="src/components/TodoList.vue"
<template>
  <div class="max-w-xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
    <h1 class="text-2xl font-bold mb-4">To-Do</h1>

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

    <h2 class="mt-6 font-semibold">Done</h2>
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
      <div class="text-sm text-slate-500">{{ remaining }} pending tasks</div>
      <div class="flex gap-2">
        <button @click="store.clearDone" class="text-sm px-3 py-1 border rounded">Clear done</button>
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

**template:** 
- `@submit.prevent="onAdd"` prevents the browser refresh and calls the onAdd function.

- `v-model` on inputs two-way binds the form values (text, priority, dueDate).

- `TransitionGroup name="list"` enables animations for items entering, leaving and moving.

- `v-for="t in pendingTodos" :key="t.id"` renders each task and uses the id for Vue's diffing.

- Checkbox with `:checked` + `@change:` uses a "controlled model": you read `t.done` and, when it changes, you trigger `store.setDone(...)`

- `<input v-model="t.text" @blur="store.updateText(...)">`:
  - `v-model` immediately updates the reactive object t (you see the text as you type).

  - `@blur` persists to localStorage by calling the store action.

- `<select :value ... @change ...>` and `<input type="date" :value ... @input ...>` do not use v-model here; they read with `(:value)` and write through the store.

**Script:**
- `<script setup>` simplified composition syntax.

- **Local refs (text, priority, dueDate):** form state.

- `onAdd()` validates, delegates to the store and clears the form.

- `const remaining = computed(() => store.todos.filter(t => !t.done).length)`: `computed` derives lists and counters from `store.todos`


## 8) Add dark mode

We create a composable that encapsulates the dark mode logic:

- Detects the system setting.

-  Saves the preference in localStorage.

- Toggles the .dark class on `<html>`.

Create src/composables/useDarkMode.ts as follows:

```ts title="src/composables/useDarkMode.ts"
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


- `const isDark = ref(false)` : `isDark` is the mode "switch"; `ref` lets it react in real time so the UI re-renders.

- `applyClass(value: boolean)` adds or removes `.dark` on `<html>.`

- `loadInitial()`: Respects your previous preference (localStorage). If there is no preference, it uses the system one with `matchMedia('(prefers-color-scheme: dark)')`

- `onMounted` ensures the DOM exists before touching `documentElement`

- `watchEffect` reacts to changes in `isDark`:

  - Applies/removes the class.

  - Persists the preference.

- `return { isDark, toggle }` Returns the composable's API so any component can use it.

## 9) src/App.vue

We define the global layout.

We integrate the dark mode button with the composable.

We centralize the main UI.

```vue title="src/App.vue"
<template>
  <div class="min-h-screen p-8 flex gap-6 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <button @click="toggle()" class="px-3 py-1 text-sm border rounded">
        {{ isDark ? 'Light' : 'Dark' }}
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

## 10) Run the app in development

Inside **frontend/**:

```bash title="Run the app in development"
npm run dev
```

Open the URL that Vite shows you (by default http://localhost:5173).

For a production build:
```bash title="Production build"
npm run build
npm run preview
```
