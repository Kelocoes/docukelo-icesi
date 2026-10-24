---
sidebar_position: 3
description: "Construye con Tailwind y daisyUI las pantallas de inicio de sesión y registro, el header y la barra de navegación de la aplicación de rutinas."
---

# Trabajo en clase

Construye, **solo a nivel de componente visual**, las pantallas de inicio de sesión y registro, el header y la barra de navegación de la aplicación de rutinas, usando **Tailwind CSS v4** y **daisyUI 5**. No hay backend ni autenticación real: los formularios usan estado local y validación visual.

<CardGrid cols={2}>
  <Card
    title="Punto de partida: week-12/next-redux"
    description="Rama del curso con Next.js 16, Tailwind CSS v4 y daisyUI 5 ya configurados en app/globals.css. También puedes usar tu propio proyecto."
    link="https://github.com/Kelocoes/compunet3-202602/tree/week-12/next-redux"
  />
  <Card
    title="Componentes de daisyUI"
    description="Catálogo oficial: navbar, menu, dropdown, card, input, btn."
    link="https://daisyui.com/components/"
  />
</CardGrid>

Esta es una referencia de cómo puede verse, hecha con los componentes reales de daisyUI 5. Cambia entre las pantallas y prueba la vista móvil:

<InteractiveFrame
  src="/interactive/computacion-3/semana-13/mockup-auth/index.html"
  title="Mockup de referencia: login, registro, header y navbar con daisyUI"
  height={620}
/>

---

## Qué debes construir

1. **Login (`/login`)**: correo, contraseña, botón "Iniciar sesión" y enlace a registro con `<Link>`. Al enviar, si los campos no están vacíos, navega con `router.replace('/routines')` (repasa el documento de navegación por eventos).
2. **Registro (`/register`)**: nombre, correo, contraseña y confirmación. Si las contraseñas no coinciden, muestra el error con `input-error` y un mensaje. Enlace de vuelta al login.
3. **Header**: nombre de la aplicación y una acción de usuario (avatar o botón de perfil).
4. **Navbar**: enlaces a las secciones de la aplicación, con el enlace activo resaltado mediante `usePathname()` (componente con `'use client'`). En escritorio, menú horizontal (`menu menu-horizontal`); en móvil, botón hamburguesa con `dropdown` o `drawer`.

## Reglas

- Combina clases de daisyUI (`btn`, `input`, `card`, `navbar`, `menu`) con utilidades de Tailwind (`flex`, `gap-4`, `max-w-md`, `mx-auto`). Nada de CSS propio salvo que lo justifiques.
- *Mobile-first*: debe verse bien a 360 px y escalar con `md:` y `lg:`.
- `<Link>` para enlazar pantallas; `router.replace` solo para la redirección después del login.

## Entrega y evaluación

Sube tu proyecto a un **repositorio privado dentro de la organización del curso** en GitHub y entrega el enlace en la plataforma del curso. El tiempo lo indica el profesor en la sesión.

| Criterio | Peso |
|:---|:---:|
| Login y registro completos, con validación visual | 30% |
| Responsive: menú colapsable en móvil y horizontal en escritorio | 25% |
| Uso correcto de daisyUI y Tailwind | 20% |
| Navegación: `<Link>`, enlace activo con `usePathname` y `router.replace` tras el login | 15% |
| Organización del código: componentes reutilizables y carpetas ordenadas | 10% |
