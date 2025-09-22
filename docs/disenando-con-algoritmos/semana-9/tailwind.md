---
sidebar_position: 3
---

# Guía sobre las funcionalidades de Tailwind CSS

Tailwind CSS es un framework de CSS "utility-first", lo que significa que aplicas clases predefinidas directamente en tu HTML para construir diseños complejos sin escribir CSS personalizado.



## 1. Clases de utilidad y filosofía "utility-first"

Las clases de utilidad de Tailwind son atómicas y no están ligadas a componentes específicos, a diferencia de frameworks como Bootstrap.

**Ejemplo:**

```html
<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
    Haz clic
</button>
```

- `bg-blue-500`: color de fondo
- `text-white`: color del texto
- `font-bold`: grosor del texto
- `py-2`: padding vertical
- `px-4`: padding horizontal
- `rounded`: bordes redondeados



## 2. Diseño adaptable (Responsive Design)

Tailwind facilita el diseño adaptable con prefijos como `sm:`, `md:`, `lg:`, `xl:`.

**Ejemplo:**

```html
<div class="flex flex-col md:flex-row items-center">
    <div class="w-full md:w-1/2">
        <img src="imagen.jpg" alt="Descripción de la imagen">
    </div>
    <div class="w-full md:w-1/2 p-4">
        <h2 class="text-xl font-bold">Título de la tarjeta</h2>
        <p>Descripción del contenido.</p>
    </div>
</div>
```

- `flex-col`: columna por defecto (móvil primero)
- `md:flex-row`: fila en pantallas medianas



## 3. Personalización y configuración

Tailwind es altamente personalizable mediante `tailwind.config.js`.

**Ejemplo:**

```js
module.exports = {
    theme: {
        extend: {
            colors: {
                'brand-primary': '#4a90e2',
                'brand-secondary': '#f5a623',
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
        }
    }
}
```

Luego puedes usar clases como `bg-brand-primary` o `h-128`.



## 4. Pseudoclases y estados

Tailwind soporta modificadores para estados como `hover`, `focus`, `active`, `disabled`.

**Ejemplo:**

```html
<a href="#" class="text-blue-500 hover:text-blue-700 hover:font-bold transition-all duration-300">
    Enlace
</a>
```

- `hover:text-blue-700`: color al pasar el ratón
- `hover:font-bold`: negrita al pasar el ratón
- `transition-all duration-300`: transición suave



## 5. Flexbox y Grid

Tailwind incluye utilidades para Flexbox y Grid.

**Flexbox:**

```html
<nav class="flex justify-between items-center bg-gray-100 p-4">
    <div class="text-lg font-bold">Logo</div>
    <ul class="flex space-x-4">
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Servicios</a></li>
        <li><a href="#">Contacto</a></li>
    </ul>
</nav>
```

- `flex`: contenedor flexible
- `justify-between`: espacio entre elementos
- `items-center`: alineación vertical
- `space-x-4`: espacio horizontal entre elementos

**Grid:**

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="bg-gray-200 h-32"></div>
    <div class="bg-gray-200 h-32"></div>
    <div class="bg-gray-200 h-32"></div>
    <div class="bg-gray-200 h-32"></div>
    <div class="bg-gray-200 h-32"></div>
    <div class="bg-gray-200 h-32"></div>
</div>
```

- `grid-cols-1`: una columna por defecto
- `md:grid-cols-2`: dos columnas en pantallas medianas
- `lg:grid-cols-3`: tres columnas en pantallas grandes
- `gap-4`: espacio entre elementos



## 6. Componentes y la directiva `@apply`

Puedes crear componentes reutilizables con la directiva `@apply` en CSS.

**Ejemplo:**

```css
.btn-primary {
    @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-all duration-300;
}
```

En HTML:

```html
<button class="btn-primary">
    Haz clic
</button>
```



## 7. JIT (Just-in-Time) Engine

El motor JIT genera clases CSS sobre la marcha, lo que mejora el rendimiento y permite usar valores arbitrarios.

**Ejemplo:**

```html
<div class="w-[375px] h-[calc(100vh-60px)] grid-cols-[1fr_2fr]">
</div>
```



## 8. Otros recursos y consejos

- **Complementos oficiales:** Ejemplo: `@tailwindcss/forms`, `@tailwindcss/typography`
- **Editor de código:** Extensión de VS Code para Tailwind CSS
- **Comunidad y ejemplos:** Sitio oficial, videos y Tailwind UI

## Further Reading

- [Documentación oficial de Tailwind CSS](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)