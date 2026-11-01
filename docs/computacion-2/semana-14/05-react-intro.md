---
sidebar_position: 5
description: "Introducción a React: el DOM, el Client Side Rendering, el Virtual DOM, los componentes, cómo crear un proyecto con Vite y cómo organizar sus carpetas."
---

# Introducción a React

Este capítulo sigue el recorrido de aprendizaje oficial de React ([react.dev/learn](https://react.dev/learn)). Antes de escribir un solo componente conviene entender el problema que React viene a resolver, así que empezamos por cómo funcionaba la web antes de él.

## Antes de React: la web y el DOM

Cuando abres una página, el navegador no guarda el HTML como texto: lo convierte en un **árbol de nodos** llamado **DOM** (Document Object Model). Cada etiqueta es un nodo, y JavaScript puede buscar cualquiera de ellos y modificarlo para que la pantalla cambie.

Explora el árbol de una tienda pequeña: pasa el mouse por la página o por el árbol y mira qué nodo es cada cosa. Luego avanza a la segunda fase para ver qué cuesta mantener la pantalla al día con JavaScript.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/dom-arbol-pagina/index.html"
  title="Una página de tienda y su árbol DOM, y cómo se actualiza a mano con JavaScript"
  height={780}
/>

### Qué nos dio el DOM y qué nos costó

| | Ventajas | Desventajas |
| --- | --- | --- |
| **Estándar** | Funciona en todos los navegadores, sin herramientas ni instalación. | Cada navegador y cada versión tienen sus detalles. |
| **Control** | Puedes tocar cualquier nodo de la página. | Tú decides cómo y dónde actualizar (estilo **imperativo**). |
| **Dependencias** | Solo HTML y JavaScript. | Mantener el dato y la pantalla sincronizados es trabajo manual. |
| **Crecimiento** | Funciona bien en páginas pequeñas. | Con cientos de elementos el código se enreda y es fácil olvidar un lugar. |

## Client Side Rendering

Con el DOM, las páginas dejaron de ser documentos y se volvieron aplicaciones. React propone una forma distinta de construirlas: el servidor entrega una página casi vacía y el navegador la arma. Eso se llama **Client Side Rendering** (CSR), y es el modo por defecto de una aplicación React hecha con Vite.

```html title="index.html (lo que entrega el servidor en CSR)"
<body>
  <div id="root"></div>
  <script type="module" src="/assets/app.js"></script>
</body>
```

Piénsalo como un **BBQ coreano**. En un restaurante clásico el cocinero prepara el plato y el mayordomo lo trae listo. En el BBQ, el cocinero entrega los ingredientes crudos y tú los cocinas en la parrilla de tu mesa. En la web:

- **El cocinero es el servidor:** prepara lo que entrega.
- **El mayordomo es el medio** por el que viaja la información: lleva el pedido y trae la respuesta.
- **La mesa con parrilla es tu navegador**, y los ingredientes son el HTML casi vacío y el JavaScript.

Recorre el pedido y, en la última fase, mira cómo cambia todo si el cocinero entrega el plato terminado.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/csr-bbq/index.html"
  title="Analogía del restaurante: Client Side Rendering frente a Server Side Rendering"
  height={560}
/>

:::note[Hoy se combinan los dos enfoques]
CSR no es mejor ni peor que **Server Side Rendering** (SSR): cada uno resuelve un problema distinto. Los frameworks modernos, como Next.js, que verás en Computación 3, permiten elegir cuál usar en cada página.
:::

## Virtual DOM y React como librería

**React** es una librería de JavaScript para construir interfaces de usuario. Su idea central es que **describes cómo debe verse la pantalla para un estado dado** y React se encarga de actualizar el DOM cuando ese estado cambia. Para hacerlo guarda en memoria una copia ligera del árbol, el **Virtual DOM**, y sigue cuatro fases cada vez que algo cambia:

1. **Disparo (trigger):** cambia el estado de la aplicación.
2. **Render:** React construye un Virtual DOM nuevo con los datos actuales.
3. **Diff:** lo compara con el anterior para saber qué cambió (reconciliación).
4. **Commit:** aplica al DOM real solo las diferencias.

Es la misma tienda de antes, pero ahora solo cambia el estado. Mira cómo se van iluminando las fases y cuántos nodos del DOM real se tocan; compáralo activando "Sin Virtual DOM".

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/virtual-dom-diff/index.html"
  title="Cómo React actualiza una página con el Virtual DOM: disparo, render, diff y commit"
  height={800}
/>

### Qué ganas al trabajar con React

- **Código declarativo:** describes qué se muestra para cada estado, no los pasos para llegar a él.
- **Pantalla siempre consistente:** como la interfaz se calcula a partir de los datos, no puedes olvidar actualizar un lugar.
- **Cambios mínimos en el DOM:** React toca solo lo que cambió.
- **Componentes reutilizables:** divides la interfaz en piezas independientes (lo veremos en la siguiente sección).
- **Es una librería, no un framework:** se enfoca en la interfaz; el enrutamiento, la obtención de datos y otras decisiones las eliges tú.

:::tip[¿El Virtual DOM hace a React más rápido?]
No necesariamente. Modificar el DOM a mano, con mucho cuidado, puede ser igual de rápido. Lo valioso es que **no tienes que decidir tú qué tocar**: React lo calcula de forma razonablemente eficiente y tu código se mantiene simple.
:::

## Componentes y composición

Hasta ahora vimos la página como un solo árbol de nodos. React la divide en **componentes**: cada uno es una función que devuelve su parte de la interfaz, escrita con una sintaxis parecida a HTML llamada **JSX** (la veremos en detalle más adelante). Se usan como si fueran etiquetas propias: `<Header />`, `<CartItem />`.

Cortamos la misma tienda en componentes. Pasa el mouse por la página, por los árboles o por los chips de colores, y mira cuántos nodos del DOM produce cada componente. Activa «Editar CartItem» para comprobar qué pasa cuando cambias una sola función.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/componentes-composicion/index.html"
  title="Una página de tienda cortada en componentes: árbol DOM, árbol de componentes, reutilización y composición"
  height={780}
/>

### Qué debes llevarte

- **Un componente produce nodos del DOM, pero no es un nodo.** `Header` produce tres (`header`, `h1` y `span`); por eso el árbol de componentes es distinto al árbol DOM.
- **Reutilizar:** `CartItem` se escribe una vez y se usa tantas veces como haga falta. Lo que cambia en cada copia son los datos que recibe, las **props**, que veremos más adelante.
- **Componer:** una pantalla se arma colocando componentes dentro de otros (`App` usa a `CartList`, que usa a `CartItem`). Quien usa un componente no necesita saber cómo se dibuja por dentro.
- **Cambios localizados:** editas una función y todas sus copias se actualizan.

## Instalar React con Vite

React es una librería: para usarla en un proyecto necesitamos una herramienta que prepare el código para el navegador. Usaremos **Vite**. Necesitas tener **Node.js** instalado; compruébalo con:

```bash
node -v
npm -v
```

Crea el proyecto con el asistente de Vite:

```bash
npm create vite@latest mi-app
```

El asistente te hace estas preguntas (muévete con las flechas y confirma con Enter):

```text
Project name: mi-app
Select a framework: React
Select a variant: JavaScript
Which linter to use?: Oxlint
Install with npm and start now?: No
```

| Pregunta | Qué elegimos | Por qué |
| --- | --- | --- |
| **Select a framework** | `React` | Es la plantilla de React. |
| **Select a variant** | `JavaScript` | Sin TypeScript, para concentrarnos en React. |
| **Which linter to use?** | `Oxlint` | Es el que viene por defecto. |
| **Install with npm and start now?** | `No` | Instalamos y arrancamos a mano para ver cada paso. |

Si prefieres saltarte las preguntas, el mismo resultado se consigue con `npm create vite@latest mi-app -- --template react`.

Entra a la carpeta, instala las dependencias y arranca el servidor de desarrollo:

```bash
cd mi-app
npm install
npm run dev
```

La terminal imprime la dirección donde quedó la aplicación, normalmente `http://localhost:5173/`:

```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Ábrela en el navegador y verás la página de ejemplo de la plantilla. Estos son los scripts que usarás durante el curso:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo con recarga instantánea. |
| `npm run build` | Genera la carpeta `dist/` lista para publicar. |
| `npm run preview` | Sirve `dist/` en local para probar el resultado del build. |
| `npm run lint` | Revisa el código con el linter. |

:::note[¿Y Create React App?]
Create React App ya no se mantiene: el equipo de React lo dio de baja en 2025. La documentación de React recomienda partir de un framework o de una herramienta de build como Vite.
:::

### Para qué sirve Vite

El navegador solo entiende HTML, CSS y JavaScript, y un proyecto React está escrito con JSX e importa paquetes de npm. Vite se coloca en medio y hace tres trabajos: **transformar** tu código, **resolver** los imports y, al publicar, **empaquetar**. Recorre cada uno:

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/vite-por-que/index.html"
  title="Para qué sirve Vite: transformar el código, resolver imports, HMR y build"
  height={640}
/>

## Estructura del proyecto

Esto es lo que entrega la plantilla de React con JavaScript. Explora cada archivo con el mouse (o tócalo en el celular) y luego mira cómo se puede organizar la carpeta `src/` cuando la aplicación crece.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/estructura-proyecto/index.html"
  title="Estructura de carpetas de un proyecto de Vite con React y una propuesta para organizar src"
  height={780}
/>

### Qué debes llevarte

- **De la página a React:** `index.html` carga `src/main.jsx`, que conecta React con el `div#root` y dibuja `App`. Todo lo demás cuelga de ahí.
- **`src/` es tuyo:** casi todo tu trabajo ocurre aquí. Vite solo trae `main.jsx` y `App.jsx`.
- **`public/` frente a `src/assets/`:** lo de `public/` se sirve tal cual; lo que importas desde `src/` lo procesa Vite.
- **Organizar `src/` es una convención,** no una regla de Vite. La propuesta separa por responsabilidad:

| Carpeta | Qué va | Ejemplo |
| --- | --- | --- |
| `components/` | Piezas de interfaz reutilizables. | `Button.jsx` |
| `pages/` | Una por pantalla. | `HomePage.jsx` |
| `hooks/` | Lógica reutilizable con estado. | `useFetch.js` |
| `services/` | Comunicación con el backend o APIs. | `productService.js` |
| `utils/` | Funciones puras sin React. | `formatPrice.js` |
| `routes/` | Qué pantalla se muestra en cada URL. | `AppRoutes.jsx` |

## Tu primer componente

Ya viste que un componente es una función que devuelve una parte de la interfaz. Así se ve uno completo, guardado en un archivo `ProductCard.jsx`:

```jsx title="ProductCard.jsx"
function ProductCard({ name, price }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>Precio: ${price}</p>
    </article>
  );
}

export default ProductCard;
```

Tiene cinco partes que vale la pena reconocer:

- **El archivo `.jsx`:** la extensión indica que contiene **JSX**, JavaScript con etiquetas parecidas a HTML. En un proyecto de Vite, el JSX debe ir en archivos `.jsx`. El archivo se llama igual que el componente y empieza con mayúscula.
- **La función:** su nombre empieza con **mayúscula**, así React distingue `<ProductCard />` (un componente) de `<article>` (una etiqueta HTML).
- **Los parámetros:** React la llama con un objeto, las **props**, que llegan desde quien la usa.
- **El `return`:** lo que devuelve es lo que React dibuja. Debe tener un solo elemento raíz.
- **El `export`:** permite que otros archivos lo importen y lo usen como etiqueta.

### Las llaves en JSX

Las llaves abren una ventana de JavaScript dentro del JSX: lo que escribes entre ellas se calcula y se dibuja.

| Dónde | Ejemplo | Qué hace |
| --- | --- | --- |
| En el contenido | `<h3>{name}</h3>` | Dibuja el valor de la variable. |
| Con cálculos | `<p>{price * 2}</p>` | Dibuja el resultado de una operación. |
| Con funciones | `<p>{formatPrice(price)}</p>` | Dibuja lo que devuelve la función. |
| Con condiciones | `<p>{stock > 0 ? "Disponible" : "Agotado"}</p>` | Elige qué dibujar con un operador ternario. |
| En un atributo | `<ProductCard price={20} />` | Pasa un valor que no es texto: un número, un objeto, una función. |

Dentro de las llaves caben **expresiones** (algo que produce un valor), no sentencias como `if` o `for`. Y fuera de las llaves, el texto es solo texto: `Precio: $` se dibuja tal cual, y lo dinámico es lo que está entre llaves.

Pasa el mouse por el código o por la pantalla y mira qué produce cada parte.

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/anatomia-componente/index.html"
  title="Anatomía de un componente: el archivo .jsx, la función, las props, el return, las llaves y el export, enlazados con lo que se ve en pantalla"
  height={760}
/>

## Props: pasar datos a un componente

Las **props** (de _properties_) son los datos que un componente recibe de quien lo usa. Se escriben como atributos y llegan a la función como un único objeto:

```jsx title="Usar un componente con props"
<ProductCard name="Teclado" price={20} />
```

Esto permite que **un mismo componente dibuje resultados distintos**: el componente describe cómo se ve una tarjeta, y las props dicen qué tarjeta es. Para una lista, el padre recorre sus datos y crea un componente por cada elemento:

```jsx title="ProductList.jsx"
function ProductList() {
  const products = [
    { id: 1, name: "Teclado", price: 20 },
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

`map` recorre la lista y devuelve un `ProductCard` por producto (las listas las veremos con más calma después); `key` ayuda a React a identificar cada elemento.

### Qué implica pasar props

- **Los datos viajan en un solo sentido:** del padre al hijo. El hijo **solo lee** sus props: no las modifica.
- **Cuando el padre cambia un dato**, React vuelve a ejecutar al padre y, con sus props actuales, a sus hijos. Después compara el resultado con el anterior y actualiza el DOM únicamente donde algo cambió.
- **Los hijos con las mismas props** producen el mismo resultado, así que su parte del DOM no se toca.
- **Para avisar hacia arriba** (por ejemplo, por un clic), el padre le pasa al hijo una función como prop. Lo veremos cuando hablemos de eventos y estado.

Recorre cómo viajan las props por el árbol de componentes y qué pasa en el árbol DOM cuando un dato cambia:

<InteractiveFrame
  src="/interactive/computacion-2/semana-14/props-arbol/index.html"
  title="Props: ProductList pasa sus datos a cada ProductCard y qué cambia en el árbol cuando un dato cambia"
  height={780}
/>

## Further Reading

- [Aprende React (react.dev/learn)](https://react.dev/learn)
- [Getting Started con Vite](https://vite.dev/guide/)
- [Your First Component](https://react.dev/learn/your-first-component)
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Render and Commit](https://react.dev/learn/render-and-commit)
- [Introducción al DOM (MDN)](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction)

---

## Cuestionario de Autoevaluación

<Quiz id="compunet2-s14-react-intro-quiz">
  <Question title="¿Qué es el DOM?">
    <Option>Un archivo HTML que el servidor guarda en disco.</Option>
    <Option>Una librería de JavaScript que dibuja interfaces.</Option>
    <Option correct>Un árbol de nodos que el navegador construye a partir del HTML y que JavaScript puede leer y modificar.</Option>
    <Option>Una copia del código fuente que React guarda en memoria.</Option>
  </Question>
  <Question title="¿Qué desventaja tiene actualizar el DOM a mano con JavaScript, como en el ejemplo de la tienda?">
    <Option>El navegador no permite cambiar el texto de un nodo.</Option>
    <Option>Solo funciona en algunos navegadores.</Option>
    <Option>Obliga a usar siempre un servidor de desarrollo.</Option>
    <Option correct>Debes recordar y actualizar uno por uno todos los lugares que dependen del dato; si olvidas uno, la pantalla queda inconsistente.</Option>
  </Question>
  <Question title="En Client Side Rendering (CSR), ¿qué entrega el servidor al navegador?">
    <Option>La página completa y terminada, lista para mostrarse.</Option>
    <Option correct>Un HTML casi vacío y el JavaScript con el que el navegador arma la página.</Option>
    <Option>Solo imágenes y hojas de estilo.</Option>
    <Option>Un árbol de componentes ya renderizado.</Option>
  </Question>
  <Question title="En la analogía del restaurante, ¿qué representa el mayordomo?">
    <Option>El servidor, que prepara lo que entrega.</Option>
    <Option>El navegador, que cocina en la parrilla de la mesa.</Option>
    <Option correct>El medio por el que viaja la información: lleva el pedido y trae la respuesta.</Option>
    <Option>El Virtual DOM, que guarda una copia de la página.</Option>
  </Question>
  <Question title="¿Cuál es el orden de las fases cuando cambia el estado en React?">
    <Option>Commit, Diff, Render, Disparo.</Option>
    <Option>Render, Disparo, Commit, Diff.</Option>
    <Option correct>Disparo, Render, Diff, Commit.</Option>
    <Option>Disparo, Diff, Commit, Render.</Option>
  </Question>
  <Question title="¿Qué es el Virtual DOM?">
    <Option correct>Una copia ligera del árbol, hecha de objetos de JavaScript en memoria, que React compara con la anterior para saber qué cambió.</Option>
    <Option>El DOM real del navegador, pero más rápido.</Option>
    <Option>Un archivo que Vite genera al hacer el build.</Option>
    <Option>Un servidor que dibuja la página por el navegador.</Option>
  </Question>
  <Question title="¿Qué es un componente en React?">
    <Option>Un archivo HTML con estilos propios.</Option>
    <Option>Una etiqueta del DOM como article o h3.</Option>
    <Option>Un paquete de npm que se instala con Vite.</Option>
    <Option correct>Una función cuyo nombre empieza con mayúscula y que devuelve JSX, la parte de la interfaz que React dibuja.</Option>
  </Question>
  <Question title="¿Para qué sirve Vite en un proyecto de React?">
    <Option>Reemplaza a React y se encarga de dibujar la interfaz.</Option>
    <Option correct>Transforma el JSX, resuelve los imports, sirve el proyecto en desarrollo con HMR y lo empaqueta al hacer el build.</Option>
    <Option>Guarda el estado de la aplicación entre una página y otra.</Option>
    <Option>Conecta la aplicación con el backend.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia entre public/ y src/assets/?">
    <Option>No hay ninguna: son carpetas equivalentes.</Option>
    <Option>public/ guarda el código y src/assets/ guarda las pruebas.</Option>
    <Option correct>Lo de public/ se sirve tal cual y se pide por URL; lo que se importa desde src/ lo procesa Vite.</Option>
    <Option>Lo de public/ se procesa con hash y lo de src/assets/ se sirve tal cual.</Option>
  </Question>
  <Question title="¿Qué extensión deben tener los archivos que contienen JSX en un proyecto de Vite, y qué indica?">
    <Option>.js, porque JSX es solo JavaScript normal.</Option>
    <Option>.html, porque JSX se parece a HTML.</Option>
    <Option correct>.jsx, que indica que el archivo mezcla JavaScript con etiquetas parecidas a HTML.</Option>
    <Option>.css, porque el JSX define estilos.</Option>
  </Question>
  <Question title="¿Qué permiten las llaves dentro del JSX, por ejemplo en &lt;h3&gt;&#123;name&#125;&lt;/h3&gt;?">
    <Option>Declarar una nueva función dentro de la etiqueta.</Option>
    <Option>Comentar el código para que React lo ignore.</Option>
    <Option correct>Abrir una ventana de JavaScript: se evalúa una expresión y React dibuja su resultado.</Option>
    <Option>Escribir sentencias como if o for.</Option>
  </Question>
  <Question title="¿Qué son las props y qué implica pasarlas?">
    <Option>Datos que el hijo envía al padre para modificarlo.</Option>
    <Option correct>Los datos que un componente recibe de su padre; viajan en un solo sentido y el hijo solo las lee.</Option>
    <Option>Funciones internas que React ejecuta antes del render.</Option>
    <Option>Variables globales que comparten todos los componentes.</Option>
  </Question>
</Quiz>
