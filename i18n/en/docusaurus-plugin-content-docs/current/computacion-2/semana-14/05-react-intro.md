---
sidebar_position: 5
description: "Introduction to React: the DOM, Client Side Rendering, the Virtual DOM, components, how to create a project with Vite, and how to organize its folders."
---

# Introduction to React

This chapter follows the official React learning path ([react.dev/learn](https://react.dev/learn)). Before writing a single component, it helps to understand the problem React came to solve, so we start with how the web worked before it.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## Before React: the web and the DOM

When you open a page, the browser does not store the HTML as text: it converts it into a **tree of nodes** called the **DOM** (Document Object Model). Every tag is a node, and JavaScript can find any of them and modify it so that the screen changes.

Explore the tree of a small store: hover over the page or the tree and see which node each thing is. Then move on to the second phase to see what it costs to keep the screen up to date with JavaScript.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/dom-arbol-pagina/index.html"
  title="A store page and its DOM tree, and how it is updated by hand with JavaScript"
  height={780}
/>

### What the DOM gave us and what it cost us

| | Advantages | Disadvantages |
| --- | --- | --- |
| **Standard** | Works in every browser, with no tools or installation. | Each browser and each version has its own quirks. |
| **Control** | You can touch any node on the page. | You decide how and where to update (**imperative** style). |
| **Dependencies** | Only HTML and JavaScript. | Keeping the data and the screen in sync is manual work. |
| **Growth** | Works well on small pages. | With hundreds of elements the code gets tangled and it is easy to forget a spot. |

## Client Side Rendering

With the DOM, pages stopped being documents and became applications. React proposes a different way to build them: the server delivers an almost empty page and the browser assembles it. This is called **Client Side Rendering** (CSR), and it is the default mode of a React application made with Vite.

```html title="index.html (what the server delivers in CSR)"
<body>
  <div id="root"></div>
  <script type="module" src="/assets/app.js"></script>
</body>
```

Think of it as a **Korean BBQ**. In a classic restaurant the cook prepares the dish and the butler brings it to you ready to eat. At a BBQ, the cook hands over the raw ingredients and you cook them on the grill at your table. On the web:

- **The cook is the server:** it prepares what it delivers.
- **The butler is the medium** the information travels through: it carries the order and brings back the response.
- **The table with a grill is your browser**, and the ingredients are the almost empty HTML and the JavaScript.

Follow the order and, in the last phase, see how everything changes if the cook delivers the finished dish.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/csr-bbq/index.html"
  title="Restaurant analogy: Client Side Rendering versus Server Side Rendering"
  height={560}
/>

:::note[Today both approaches are combined]
CSR is neither better nor worse than **Server Side Rendering** (SSR): each one solves a different problem. Modern frameworks, such as Next.js, which you will see in Internet Computing 3, let you choose which one to use on each page.
:::

## Virtual DOM and React as a library

**React** is a JavaScript library for building user interfaces. Its central idea is that you **describe how the screen should look for a given state** and React takes care of updating the DOM when that state changes. To do so, it keeps a lightweight copy of the tree in memory, the **Virtual DOM**, and goes through four phases every time something changes:

1. **Trigger:** the application state changes.
2. **Render:** React builds a new Virtual DOM with the current data.
3. **Diff:** it compares it with the previous one to find out what changed (reconciliation).
4. **Commit:** it applies only the differences to the real DOM.

It is the same store as before, but now only the state changes. Watch how the phases light up one by one and how many nodes of the real DOM are touched; compare it by turning on "Sin Virtual DOM" (Without Virtual DOM).

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/virtual-dom-diff/index.html"
  title="How React updates a page with the Virtual DOM: trigger, render, diff and commit"
  height={800}
/>

### What you gain by working with React

- **Declarative code:** you describe what is shown for each state, not the steps to get there.
- **A screen that is always consistent:** since the interface is computed from the data, you cannot forget to update a spot.
- **Minimal changes to the DOM:** React touches only what changed.
- **Reusable components:** you split the interface into independent pieces (we will see this in the next section).
- **It is a library, not a framework:** it focuses on the interface; routing, data fetching, and other decisions are up to you.

:::tip[Does the Virtual DOM make React faster?]
Not necessarily. Modifying the DOM by hand, with great care, can be just as fast. What is valuable is that **you do not have to decide what to touch**: React works it out reasonably efficiently and your code stays simple.
:::

## Components and composition

So far we have seen the page as a single tree of nodes. React splits it into **components**: each one is a function that returns its part of the interface, written with an HTML-like syntax called **JSX** (we will cover it in detail later). They are used as if they were your own tags: `<Header />`, `<CartItem />`.

We cut the same store into components. Hover over the page, the trees, or the colored chips, and see how many DOM nodes each component produces. Turn on «Editar CartItem» (Edit CartItem) to check what happens when you change a single function.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/componentes-composicion/index.html"
  title="A store page cut into components: DOM tree, component tree, reuse and composition"
  height={780}
/>

### Key takeaways

- **A component produces DOM nodes, but it is not a node.** `Header` produces three (`header`, `h1` and `span`); that is why the component tree is different from the DOM tree.
- **Reuse:** `CartItem` is written once and used as many times as needed. What changes in each copy is the data it receives, the **props**, which we will see later.
- **Compose:** a screen is built by placing components inside other components (`App` uses `CartList`, which uses `CartItem`). Whoever uses a component does not need to know how it is drawn inside.
- **Localized changes:** you edit one function and all its copies are updated.

## Installing React with Vite

React is a library: to use it in a project we need a tool that prepares the code for the browser. We will use **Vite**. You need to have **Node.js** installed; check it with:

```bash
node -v
npm -v
```

Create the project with the Vite wizard:

```bash
npm create vite@latest mi-app
```

The wizard asks you these questions (move with the arrow keys and confirm with Enter):

```text
Project name: mi-app
Select a framework: React
Select a variant: JavaScript
Which linter to use?: Oxlint
Install with npm and start now?: No
```

| Question | What we choose | Why |
| --- | --- | --- |
| **Select a framework** | `React` | It is the React template. |
| **Select a variant** | `JavaScript` | No TypeScript, so we can focus on React. |
| **Which linter to use?** | `Oxlint` | It is the default one. |
| **Install with npm and start now?** | `No` | We install and start by hand to see each step. |

If you prefer to skip the questions, the same result is achieved with `npm create vite@latest mi-app -- --template react`.

Go into the folder, install the dependencies, and start the development server:

```bash
cd mi-app
npm install
npm run dev
```

The terminal prints the address where the application is running, usually `http://localhost:5173/`:

```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open it in the browser and you will see the template's sample page. These are the scripts you will use during the course:

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with instant reload. |
| `npm run build` | Generates the `dist/` folder, ready to publish. |
| `npm run preview` | Serves `dist/` locally to test the result of the build. |
| `npm run lint` | Checks the code with the linter. |

:::note[What about Create React App?]
Create React App is no longer maintained: the React team deprecated it in 2025. The React documentation recommends starting from a framework or from a build tool such as Vite.
:::

### What Vite is for

The browser only understands HTML, CSS, and JavaScript, and a React project is written with JSX and imports npm packages. Vite sits in the middle and does three jobs: it **transforms** your code, **resolves** the imports and, when publishing, **bundles**. Go through each one:

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/vite-por-que/index.html"
  title="What Vite is for: transforming code, resolving imports, HMR and build"
  height={640}
/>

## Project structure

This is what the React with JavaScript template gives you. Explore each file with the mouse (or tap it on your phone) and then see how the `src/` folder can be organized as the application grows.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/estructura-proyecto/index.html"
  title="Folder structure of a Vite project with React and a proposal to organize src"
  height={780}
/>

### Key takeaways

- **From the page to React:** `index.html` loads `src/main.jsx`, which connects React to the `div#root` and draws `App`. Everything else hangs from there.
- **`src/` is yours:** almost all of your work happens here. Vite only brings `main.jsx` and `App.jsx`.
- **`public/` versus `src/assets/`:** what is in `public/` is served as is; what you import from `src/` is processed by Vite.
- **Organizing `src/` is a convention,** not a Vite rule. The proposal separates by responsibility:

| Folder | What goes in it | Example |
| --- | --- | --- |
| `components/` | Reusable interface pieces. | `Button.jsx` |
| `pages/` | One per screen. | `HomePage.jsx` |
| `hooks/` | Reusable logic with state. | `useFetch.js` |
| `services/` | Communication with the backend or APIs. | `productService.js` |
| `utils/` | Pure functions without React. | `formatPrice.js` |
| `routes/` | Which screen is shown at each URL. | `AppRoutes.jsx` |

## Your first component

You have already seen that a component is a function that returns a part of the interface. This is what a complete one looks like, saved in a file `ProductCard.jsx`:

```jsx title="ProductCard.jsx"
function ProductCard({ name, price }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>Price: ${price}</p>
    </article>
  );
}

export default ProductCard;
```

It has five parts worth recognizing:

- **The `.jsx` file:** the extension indicates that it contains **JSX**, JavaScript with HTML-like tags. In a Vite project, JSX must go in `.jsx` files. The file is named the same as the component and starts with an uppercase letter.
- **The function:** its name starts with an **uppercase letter**, which is how React tells `<ProductCard />` (a component) apart from `<article>` (an HTML tag).
- **The parameters:** React calls it with an object, the **props**, which come from whoever uses it.
- **The `return`:** what it returns is what React draws. It must have a single root element.
- **The `export`:** it lets other files import it and use it as a tag.

### Curly braces in JSX

Curly braces open a JavaScript window inside the JSX: what you write between them is computed and drawn.

| Where | Example | What it does |
| --- | --- | --- |
| In the content | `<h3>{name}</h3>` | Draws the value of the variable. |
| With calculations | `<p>{price * 2}</p>` | Draws the result of an operation. |
| With functions | `<p>{formatPrice(price)}</p>` | Draws what the function returns. |
| With conditions | `<p>{stock > 0 ? "In stock" : "Out of stock"}</p>` | Chooses what to draw with a ternary operator. |
| In an attribute | `<ProductCard price={20} />` | Passes a value that is not text: a number, an object, a function. |

Inside the curly braces you can put **expressions** (something that produces a value), not statements such as `if` or `for`. And outside the curly braces, text is just text: `Price: $` is drawn as is, and what is dynamic is what sits between curly braces.

Hover over the code or the screen and see what each part produces.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/anatomia-componente/index.html"
  title="Anatomy of a component: the .jsx file, the function, the props, the return, the curly braces and the export, linked to what is seen on screen"
  height={760}
/>

## Props: passing data to a component

**Props** (short for _properties_) are the data a component receives from whoever uses it. They are written as attributes and arrive at the function as a single object:

```jsx title="Using a component with props"
<ProductCard name="Keyboard" price={20} />
```

This lets **the same component draw different results**: the component describes what a card looks like, and the props say which card it is. For a list, the parent goes through its data and creates one component for each element:

```jsx title="ProductList.jsx"
function ProductList() {
  const products = [
    { id: 1, name: "Keyboard", price: 20 },
    { id: 2, name: "Mouse", price: 10 },
    { id: 3, name: "Monitor", price: 15 },
  ];

  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} />
      ))}
    </div>
  );
}
```

`map` goes through the list and returns one `ProductCard` per product (we will cover lists more calmly later); `key` helps React identify each element.

### What passing props implies

- **Data travels in one direction only:** from the parent to the child. The child **only reads** its props: it does not modify them.
- **When the parent changes a piece of data**, React runs the parent again and, with its current props, its children. It then compares the result with the previous one and updates the DOM only where something changed.
- **Children with the same props** produce the same result, so their part of the DOM is not touched.
- **To notify upward** (for example, on a click), the parent passes the child a function as a prop. We will see this when we talk about events and state.

Follow how props travel through the component tree and what happens in the DOM tree when a piece of data changes:

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/props-arbol/index.html"
  title="Props: ProductList passes its data to each ProductCard and what changes in the tree when a piece of data changes"
  height={780}
/>

## Further Reading

- [Learn React (react.dev/learn)](https://react.dev/learn)
- [Getting Started with Vite](https://vite.dev/guide/)
- [Your First Component](https://react.dev/learn/your-first-component)
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Render and Commit](https://react.dev/learn/render-and-commit)
- [Introduction to the DOM (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

---

## Self-Assessment Quiz

<Quiz id="compunet2-s14-react-intro-quiz">
  <Question title="What is the DOM?">
    <Option>An HTML file that the server stores on disk.</Option>
    <Option>A JavaScript library that draws interfaces.</Option>
    <Option correct>A tree of nodes that the browser builds from the HTML and that JavaScript can read and modify.</Option>
    <Option>A copy of the source code that React keeps in memory.</Option>
  </Question>
  <Question title="What is the drawback of updating the DOM by hand with JavaScript, as in the store example?">
    <Option>The browser does not allow changing the text of a node.</Option>
    <Option>It only works in some browsers.</Option>
    <Option>It always forces you to use a development server.</Option>
    <Option correct>You must remember and update, one by one, every place that depends on the data; if you forget one, the screen ends up inconsistent.</Option>
  </Question>
  <Question title="In Client Side Rendering (CSR), what does the server deliver to the browser?">
    <Option>The complete, finished page, ready to be displayed.</Option>
    <Option correct>An almost empty HTML and the JavaScript with which the browser assembles the page.</Option>
    <Option>Only images and stylesheets.</Option>
    <Option>An already rendered component tree.</Option>
  </Question>
  <Question title="In the restaurant analogy, what does the butler represent?">
    <Option>The server, which prepares what it delivers.</Option>
    <Option>The browser, which cooks on the grill at the table.</Option>
    <Option correct>The medium the information travels through: it carries the order and brings back the response.</Option>
    <Option>The Virtual DOM, which keeps a copy of the page.</Option>
  </Question>
  <Question title="What is the order of the phases when the state changes in React?">
    <Option>Commit, Diff, Render, Trigger.</Option>
    <Option>Render, Trigger, Commit, Diff.</Option>
    <Option correct>Trigger, Render, Diff, Commit.</Option>
    <Option>Trigger, Diff, Commit, Render.</Option>
  </Question>
  <Question title="What is the Virtual DOM?">
    <Option correct>A lightweight copy of the tree, made of JavaScript objects in memory, which React compares with the previous one to find out what changed.</Option>
    <Option>The browser's real DOM, but faster.</Option>
    <Option>A file that Vite generates when building.</Option>
    <Option>A server that draws the page on behalf of the browser.</Option>
  </Question>
  <Question title="What is a component in React?">
    <Option>An HTML file with its own styles.</Option>
    <Option>A DOM tag such as article or h3.</Option>
    <Option>An npm package installed with Vite.</Option>
    <Option correct>A function whose name starts with an uppercase letter and that returns JSX, the part of the interface that React draws.</Option>
  </Question>
  <Question title="What is Vite for in a React project?">
    <Option>It replaces React and takes care of drawing the interface.</Option>
    <Option correct>It transforms the JSX, resolves the imports, serves the project in development with HMR, and bundles it when building.</Option>
    <Option>It stores the application state between one page and another.</Option>
    <Option>It connects the application to the backend.</Option>
  </Question>
  <Question title="What is the difference between public/ and src/assets/?">
    <Option>There is none: they are equivalent folders.</Option>
    <Option>public/ stores the code and src/assets/ stores the tests.</Option>
    <Option correct>What is in public/ is served as is and requested by URL; what is imported from src/ is processed by Vite.</Option>
    <Option>What is in public/ is processed with a hash and what is in src/assets/ is served as is.</Option>
  </Question>
  <Question title="What extension must files containing JSX have in a Vite project, and what does it indicate?">
    <Option>.js, because JSX is just regular JavaScript.</Option>
    <Option>.html, because JSX looks like HTML.</Option>
    <Option correct>.jsx, which indicates that the file mixes JavaScript with HTML-like tags.</Option>
    <Option>.css, because JSX defines styles.</Option>
  </Question>
  <Question title="What do curly braces allow inside JSX, for example in &lt;h3&gt;&#123;name&#125;&lt;/h3&gt;?">
    <Option>Declaring a new function inside the tag.</Option>
    <Option>Commenting out the code so React ignores it.</Option>
    <Option correct>Opening a JavaScript window: an expression is evaluated and React draws its result.</Option>
    <Option>Writing statements such as if or for.</Option>
  </Question>
  <Question title="What are props and what does passing them imply?">
    <Option>Data that the child sends to the parent to modify it.</Option>
    <Option correct>The data a component receives from its parent; they travel in one direction only and the child just reads them.</Option>
    <Option>Internal functions that React runs before the render.</Option>
    <Option>Global variables shared by all components.</Option>
  </Question>
</Quiz>
