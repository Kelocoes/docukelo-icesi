---
sidebar_position: 2
---

# Estructura de Archivos para Proyectos con React y Tailwind CSS

Organizar correctamente los archivos de tu proyecto es clave para facilitar el **mantenimiento** y la **escalabilidad**. A continuación, se destacan los puntos más importantes para estructurar proyectos con React y Tailwind CSS.

## Estructura Básica Recomendada

La siguiente estructura es un buen punto de partida:

```plaintext
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Aspectos Clave para Proyectos Más Grandes

- **components**: Guarda componentes **reutilizables** como botones, cards y modales. Facilita la reutilización y el mantenimiento.
- **pages**: Organiza las **páginas principales** de la aplicación (Home, About, Contact, etc.), separando la lógica y la vista de cada sección.
- **Subcarpetas en pages**: Si una página tiene componentes exclusivos, crea una carpeta para esa página y almacena ahí sus componentes específicos.
- **styles**: Centraliza los **estilos** personalizados, ya sean archivos CSS o configuraciones de Tailwind, para mantener el orden visual.
- **services**: Encapsula la **lógica de negocio** (llamadas a APIs, manejo de datos). Puedes incluir archivos para datos simulados (mock) y métodos de acceso.
- **routes**: Define todas las **rutas** de la aplicación en un solo lugar, facilitando la navegación y el mantenimiento.
- **assets**: Almacena **recursos estáticos** como imágenes, fuentes, íconos y logos, asegurando que estén fácilmente accesibles.
- **utils/helpers**: Guarda **funciones reutilizables** de lógica JavaScript/TypeScript que se usan en varios componentes.
- **context**: Organiza los **contextos** para el manejo del estado global, mejorando la gestión de datos compartidos.
- **hooks**: Centraliza los **hooks personalizados**, facilitando su reutilización y mantenimiento.
- **config**: Almacena **constantes** y configuraciones específicas, manteniendo la flexibilidad y claridad en la configuración del proyecto.

> **Consejo:** Mantén una organización lógica y coherente. Adapta la estructura según las necesidades de tu proyecto para asegurar un desarrollo eficiente y sostenible.

## Propuesta de Estructura para Proyectos Más Complejos

Aquí te dejo una propuesta más detallada que podría recomendarte:

```plaintext
my-react-app/
├── node_modules/
├── public/
│   ├── data/
│   │   ├── post.json
│   │   └── user.json
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   └── components/
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── components/
│   │   └── Contact/
│   ├── routes/
│   ├── services/
│   │   ├── userServices.ts
│   │   ├── postServices.ts
│   │   └── mock/
│   │       ├── userMock.ts
│   │       └── postMock.ts
│   ├── types/
│   │   ├── userTypes.ts
│   │   └── postTypes.ts
│   ├── config/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Aquí te explico la motivación de cada uno de los directorios adicionales:

- **data**: Almacena archivos JSON u otros datos estáticos que la aplicación pueda necesitar.
- **types**: Centraliza las definiciones de tipos TypeScript para mantener la consistencia y facilitar el mantenimiento.
- **config**: Guarda configuraciones específicas del proyecto, como URLs de APIs, claves, etc.
- **utils**: Contiene funciones utilitarias que pueden ser usadas en diferentes partes de la aplicación.
- **hooks**: Almacena hooks personalizados que encapsulan lógica reutilizable.
- **context**: Maneja el estado global de la aplicación utilizando el Context API de React.