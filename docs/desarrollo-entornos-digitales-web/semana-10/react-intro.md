---
sidebar_position: 2
---

# React introduction

## Qué es React

React es una biblioteca de JavaScript desarrollada por Facebook para construir interfaces de usuario interactivas y eficientes. Su principal objetivo es facilitar la creación de aplicaciones web donde la información cambia constantemente, como redes sociales, paneles de administración o tiendas en línea.

React permite dividir la interfaz en componentes reutilizables, lo que hace que el desarrollo sea más organizado y mantenible. Cada componente puede gestionar su propio estado y lógica, y React se encarga de actualizar la vista de manera eficiente cuando los datos cambian.

React usualmente se utiliza para desarrollar aplicaciones web modernas, rápidas y escalables, enfocándose en la experiencia del usuario y la facilidad de mantenimiento del código.

## Creación de un proyecto de React con Vite 

Para empezar a trabajar con React, una de las formas más modernas y rápidas es utilizando **Vite**.  
Vite es un empaquetador (bundler) y servidor de desarrollo que permite crear proyectos de manera ligera y eficiente.

### Comandos de inicialización

1. Primero, asegúrate de tener **Node.js** instalado. Puedes verificarlo con:
```bash
node -v
npm -v
```

2. Crear un nuevo proyecto con Vite:
```bash
npm create vite@latest my-react-app
```

3. Durante el proceso de creación, Vite te pedirá seleccionar un framework. Escoge:
```
? Select a framework: › - Use arrow-keys. 
  Vanilla
  Vue
❯ React
  Preact
  Svelte
```

4. Luego, selecciona si quieres trabajar con **JavaScript** o **TypeScript**:
```
? Select a variant: › - Use arrow-keys.
   JavaScript
❯  TypeScript
```

5. Instala las dependencias:
```bash
cd my-react-app
npm install
```

6. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Esto abrirá un servidor en `http://localhost:5173/` donde podrás ver tu aplicación en funcionamiento.

---

## React Virtual DOM

React no trabaja directamente con el **DOM real** (Document Object Model), sino que utiliza una representación intermedia llamada **Virtual DOM**.

### Qué es el Virtual DOM

El **Virtual DOM** es una copia ligera del DOM real que React mantiene en memoria.  
Cada vez que un componente cambia, React actualiza esta copia y luego determina las diferencias con el DOM real.

Este enfoque surgió porque manipular el DOM directamente es muy costoso en términos de rendimiento.

### Diferencias: DOM vs Virtual DOM

| Aspecto              | DOM Real                                | Virtual DOM                          |
|-----------------------|------------------------------------------|---------------------------------------|
| Rendimiento           | Lento al modificar elementos frecuentes | Mucho más rápido                     |
| Memoria               | Puede consumir más recursos             | Más eficiente                        |
| Actualizaciones       | Se actualiza de inmediato               | Calcula diferencias y luego actualiza |
| Uso en React          | No se recomienda manipularlo directamente | React lo maneja automáticamente    |

### Cómo funciona el Virtual DOM

El proceso se basa en un algoritmo llamado **Diffing Algorithm**:

1. Cada vez que el estado de un componente cambia, React genera un nuevo Virtual DOM.  
2. Se compara la versión nueva del Virtual DOM con la anterior (**Reconciliation**).  
3. React identifica solo los cambios necesarios (diferencias o *diff*).  
4. Aplica esos cambios en el DOM real de manera eficiente.

### Visualización del Virtual DOM en React

Aunque no podemos ver directamente el Virtual DOM, podemos hacer pruebas para comprenderlo.

Ejemplo de un componente simple:

```jsx
function App() {
  return <h1>Hola, React!</h1>;
}

export default App;
```

Si hacemos:

```jsx
console.log(<App />);
```

Veremos en la consola un objeto JavaScript (una representación del Virtual DOM) en lugar de un elemento real del navegador.


## React Components

### Qué es un componente en React

Un **componente** en React es una función o clase que devuelve elementos JSX.  
Son la unidad básica para construir interfaces en React.  
En lugar de trabajar con HTML repetitivo, React permite crear bloques reutilizables.

### Tipos de componentes

1. **Componentes de clase** (menos usados hoy en día):
```jsx
import React, { Component } from "react";

class Welcome extends Component {
  render() {
    return <h1>Hola, {this.props.name}</h1>;
  }
}

export default Welcome;
```

2. **Componentes funcionales** (la forma moderna y recomendada):
```jsx
function Welcome({ name }) {
  return <h1>Hola, {name}</h1>;
}

export default Welcome;
```

### Ciclo de vida de un componente

En los componentes de clase se habla de tres fases principales:

1. **Montaje** → cuando el componente aparece en pantalla.  
2. **Actualización** → cuando cambian sus props o estado.  
3. **Desmontaje** → cuando desaparece del DOM.

En componentes funcionales, estos ciclos se manejan con **hooks** como `useEffect`.

### Props

Las **props** (propiedades) son valores que se pasan de un componente padre a un componente hijo.  
Son equivalentes a los atributos en HTML.

Ejemplo:
```jsx
function Saludo({ nombre }) {
  return <h1>Hola, {nombre}</h1>;
}

function App() {
  return <Saludo nombre="Kevin" />;
}
```

Aquí, el componente `App` pasa la prop `nombre` al componente `Saludo`.

Además, podemos usar **destructuring** para hacer el código más limpio:
```jsx
function Saludo({ nombre, edad }) {
  return <h1>Hola, {nombre}. Tienes {edad} años.</h1>;
}
```

## Hooks

### Qué son los hooks

Los **hooks** son funciones especiales de React que permiten usar características como estado y ciclo de vida en componentes funcionales.

Antes de los hooks, solo los **componentes de clase** podían manejar estado y ciclo de vida.  
Con hooks, ahora los **componentes funcionales** pueden hacerlo de manera más simple.

### useState

El hook más básico y más utilizado es **useState**, que permite manejar estados dentro de un componente funcional.

Ejemplo:

```jsx
import { useState } from "react";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>Incrementar</button>
    </div>
  );
}

export default Contador;
```

#### Explicación:

1. `useState(0)` → inicializa el estado `contador` con valor `0`.  
2. `contador` → variable que guarda el valor actual.  
3. `setContador` → función para actualizar el valor de `contador`.  
4. Cuando llamamos a `setContador`, React **vuelve a renderizar el componente** con el nuevo valor.

Este es el primer paso para entender cómo React maneja interfaces dinámicas.

## Further Reading

- [Documentación oficial de React](https://reactjs.org/docs/getting-started.html)