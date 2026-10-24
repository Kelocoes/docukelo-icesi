---
sidebar_position: 1
description: "Entiende qué es el estado en una interfaz, por qué compartirlo entre componentes se complica y qué problema resuelve un store global antes de usar Zustand."
---

# Estado compartido: el problema que resuelve un store

En la semana 12 construimos un login con `useState`, guardamos el token en `localStorage` y protegimos las rutas con un `AuthGuard`. Funciona, pero cada pantalla que necesita saber **quién es el usuario** tiene que leer `localStorage` por su cuenta, y ningún componente se entera cuando la sesión cambia.

Antes de instalar cualquier librería conviene entender el problema con precisión. Una herramienta de estado se elige bien solo cuando sabes qué dolor te quita. En esta lección vamos de lo más simple (`useState`) hasta el punto donde un **store global** deja de ser un lujo.

---

## 1. Qué es el estado

El **estado** (*state*) es la información que cambia con el tiempo y de la que depende lo que ves en pantalla. Cuando el estado cambia, React vuelve a dibujar la interfaz.

No todo el estado es del mismo tipo, y mezclarlos es la fuente de la mayoría de los enredos:

| Tipo | Ejemplo en nuestra app | Dónde conviene vivir |
| :--- | :--- | :--- |
| **Local de un componente** | Texto escrito en el input del login, si un menú está abierto | `useState` dentro del componente |
| **Compartido entre componentes** | Usuario autenticado, notificaciones, carrito, tema visual | Un store (lo que veremos esta semana) |
| **Del servidor** (*server state*) | Lista de usuarios que devuelve `GET /users` | Una capa de datos (fetch, caché); no es lo mismo que el estado de UI |
| **De la URL** | Filtros de búsqueda, página actual, `id` de la ruta | La propia URL (`searchParams`, `params`) |

:::tip[Regla práctica]
Empieza siempre con el estado **más local posible**. Súbelo solo cuando dos componentes que no son padre e hijo necesiten el mismo dato.
:::

---

## 2. Cómo viaja el estado en React

Recorre el árbol de componentes de una página. Verás dónde vive el estado, cómo se sube al ancestro común (*lifting state up*), por qué aparece el *prop drilling* y qué logra (y qué no) `Context`.

<InteractiveFrame
  src="/interactive/computacion-3/semana-12/arbol-estado/index.html"
  title="Cómo viaja el estado por el árbol de componentes"
  height={700}
/>

Lo esencial de ese recorrido:

1. **Los datos solo bajan** por el árbol (de padre a hijo, como `props`). No hay un camino lateral entre ramas.
2. **Subir el estado** al ancestro común resuelve el primer problema, pero obliga a pasar `props` por componentes que no las usan (*prop drilling*).
3. **Context** da un salto directo, pero cuando cambia su `value` se vuelven a renderizar **todos** los consumidores, aunque solo les interese una parte.

---

## 3. Un problema concreto: la sesión del usuario

Piensa en la aplicación del caso de estudio de la semana 12. Necesitan la sesión:

- El `AuthGuard`, para decidir si deja entrar.
- La barra de navegación, para mostrar el nombre y el botón "Cerrar sesión".
- El dashboard, para pedir `GET /users` con el token.
- Cualquier formulario que firme una petición.

Con lo que sabemos hasta ahora hay tres salidas, todas con costo:

```tsx title="Tres formas de compartir la sesión" showLineNumbers
// 1. Props: el dato baja por todos los intermedios (prop drilling)
<AppLayout user={user}>
  <Navbar user={user} />        {/* Navbar solo lo reenvía */}
</AppLayout>

// 2. Context: un Provider y useContext, pero todo consumidor se re-renderiza
<AuthContext.Provider value={{ user, token, login, logout }}>
  <App />
</AuthContext.Provider>

// 3. localStorage directo (lo que hicimos en la semana 12): nadie se entera del cambio
const token = session.getToken();
```

Ninguna es incorrecta. Lo que pasa es que a medida que la app crece, cada una acumula deuda: `props` repetidas, re-renders que no se ven, o pantallas que no se actualizan cuando cierras sesión en otra parte de la app.

---

## 4. Qué es un store global

Un **store** es un objeto que vive **fuera** del árbol de componentes y que guarda dos cosas juntas:

1. El **estado** compartido (`user`, `token`, `notifications`).
2. Las **acciones** que lo modifican (`login()`, `logout()`, `addNotification()`).

Cualquier componente se **suscribe** a la parte que le interesa y React lo vuelve a dibujar solo cuando esa parte cambia.

> **Analogía:** el tablero de anuncios de la facultad. Cualquiera puede ir a leer el aviso que le importa, y cuando coordinación cambia un aviso, solo se entera quien estaba mirando ese aviso. Nadie le lleva el papel de mano en mano a cada salón.

Lo que cambia frente a lo anterior:

| Antes | Con un store |
| :--- | :--- |
| El dato baja por `props` | El componente lo lee **directo** del store |
| El cambio sube por callbacks | El componente llama la **acción** del store |
| Context re-renderiza a todos | Cada componente se suscribe solo a lo que usa (selectores) |
| El estado vive en el árbol | El estado vive **afuera**, sobrevive a que un componente se desmonte |

### Cuándo NO hace falta

Un store global no es la respuesta a todo. No lo uses para:

- El valor de un input mientras el usuario escribe (es estado local).
- Datos que vienen del servidor y se vuelven a pedir en cada pantalla (eso es *server state*; un store puede guardarlos, pero no sustituye una estrategia de caché).
- Algo que solo usan un componente y sus hijos directos.

---

## 5. Mapa de la semana

Esta semana recorremos el camino en este orden:

<StepByStep>
  <Step number="1" title="Concepto: el store y su flujo">
    Qué es Zustand, cómo se ve un store, qué es `set`, qué es un selector y cómo se compara con Redux y Context. Ver [Conceptos de Zustand](./02-zustand-conceptos.md).
  </Step>
  <Step number="2" title="Configuración en Next.js">
    Instalación, tipado con TypeScript, ubicación del store por feature, `'use client'` y el cuidado con el servidor. Ver [Configuración de Zustand](./03-configuracion-zustand-nextjs.md).
  </Step>
  <Step number="3" title="Capacidades">
    Selectores, `useShallow`, acciones asíncronas, middleware (`devtools`, `persist`, `immer`) y uso fuera de React. Ver [Capacidades de Zustand](./04-capacidades-de-zustand.md).
  </Step>
  <Step number="4" title="Caso práctico">
    Migramos la sesión de la semana 12 a un store con persistencia y construimos un sistema de notificaciones. Ver [Caso práctico](./05-caso-practico-sesion-y-notificaciones.md).
  </Step>
</StepByStep>

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s13-01-estado-compartido-y-store-quiz">
  <Question title="¿Qué tipo de estado debería seguir viviendo dentro del propio componente con useState?">
    <Option>La sesión del usuario que consultan la barra de navegación y el dashboard.</Option>
    <Option correct>El texto que el usuario está escribiendo en un input del formulario de login.</Option>
    <Option>La lista de notificaciones que se muestra en varias pantallas.</Option>
    <Option>El token que debe adjuntarse a cada petición HTTP.</Option>
  </Question>
  <Question title="¿Qué problema tiene Context cuando cambia el value de su Provider?">
    <Option>Impide que los componentes hijos usen useState.</Option>
    <Option>Obliga a convertir el componente en un Server Component.</Option>
    <Option correct>Todos los componentes que consumen ese contexto se vuelven a renderizar, aunque solo usen una parte del valor.</Option>
    <Option>Elimina el estado de los componentes que no lo consumen.</Option>
  </Question>
  <Question title="¿Qué guarda un store global?">
    <Option>Solo los datos, porque las funciones deben vivir en los componentes.</Option>
    <Option correct>El estado compartido y las acciones que lo modifican, fuera del árbol de componentes.</Option>
    <Option>Únicamente los datos que llegan desde el servidor.</Option>
    <Option>Una copia del DOM para evitar renderizar de nuevo.</Option>
  </Question>
  <Question title="¿Cuál de estos casos NO justifica un store global?">
    <Option>El usuario autenticado, que lo usan el guard, la navbar y el dashboard.</Option>
    <Option>El carrito de compras, visible en la cabecera y en la página de pago.</Option>
    <Option correct>Si un menú desplegable está abierto o cerrado, cuando solo lo usa ese componente.</Option>
    <Option>Las notificaciones, que se emiten en una pantalla y se leen en otra.</Option>
  </Question>
</Quiz>
