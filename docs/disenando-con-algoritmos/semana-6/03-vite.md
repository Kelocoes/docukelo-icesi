---
sidebar_position: 3
---

# Vite

 Apuntes de clase: Introducción a Vite con Vanilla-TS

Vite es una herramienta moderna para crear proyectos de **JavaScript**. Su nombre viene del francés y significa **"rápido"**. Y justamente esa es la idea principal de Vite: ser **rápido** al momento de desarrollar.

Cuando uno programa en **JavaScript**, **CSS** y **HTML**, llega un momento en que los proyectos empiezan a crecer. Entonces necesitamos herramientas que nos ayuden a **organizar el código**, usar **archivos separados**, **importar cosas entre archivos**, y además poder **probar los cambios rápidamente** en el navegador. Ahí es donde entra **Vite**.

## ¿Qué problema busca solucionar?
Antes, cuando uno quería organizar su proyecto en varios archivos de **JavaScript** (y no en un solo archivo gigante), tocaba usar herramientas que juntaran todo en uno solo para que el navegador pudiera leerlo bien. Esas herramientas se llaman **"bundlers"**.

El problema es que esas herramientas eran **lentas**, y cada vez que uno hacía un cambio, había que esperar a que **reconstruyeran el proyecto completo**. Eso hacía que la experiencia de desarrollo fuera un poco **desesperante**.

**Vite** soluciona eso usando otra idea: en lugar de reconstruir todo, Vite aprovecha que los **navegadores modernos** ya entienden los módulos de **JavaScript** (**ES Modules**). Entonces, mientras uno está desarrollando, Vite no necesita **"empaquetar"** todo. Solo da los archivos directamente al navegador. Eso hace que los **cambios se vean casi al instante**.

## ¿Por qué usar Vite?
- **Es rápido**: los cambios que uno hace en el código aparecen casi de inmediato en el navegador.
- **Es sencillo de configurar**: con un solo comando se crea un proyecto con toda la estructura lista para empezar.
- **Funciona con TypeScript**: si queremos usar TypeScript (una versión mejorada de JavaScript que nos ayuda a evitar errores), Vite ya viene preparado.
- **Tiene soporte para muchos frameworks**: aunque aquí veremos Vanilla (JavaScript puro con TypeScript), Vite también sirve para React, Vue, Svelte y otros.

## Ventajas frente a Webpack
Webpack fue (y sigue siendo en muchos lugares) el estándar para organizar proyectos grandes de JavaScript. Pero tiene algunos problemas comparado con Vite:

- **Velocidad**: Webpack tiene que procesar todo el proyecto cada vez que hacemos un cambio. Vite solo procesa lo que se necesita.
- **Simplicidad**: Configurar Webpack puede ser complicado y toma tiempo. Vite es mucho más sencillo de configurar.
- **Experiencia de desarrollo**: con Vite los cambios aparecen en milisegundos, mientras que con Webpack a veces toca esperar varios segundos.

## Diferencias entre Vite y Webpack
- Webpack es un "bundler" (empaquetador). Vite es más como un "servidor de desarrollo" que solo hace bundling al final, cuando vamos a producción.
- Vite usa ES Modules directamente durante el desarrollo. Webpack no, él tiene que transformar todo siempre.
- Vite está diseñado para aprovechar las ventajas de los navegadores modernos.

## Crear un proyecto con Vite y Vanilla-TS
Para crear un proyecto nuevo con Vite, usamos este comando en la consola:

```bash
npm create vite@latest nombre-del-proyecto
```

Después de escribir eso, nos va a preguntar qué tipo de proyecto queremos. Elegimos **Vanilla** si queremos usar JavaScript puro, o **Vanilla-TS** si queremos usar TypeScript. En este curso usaremos **Vanilla-TS** porque es una buena forma de aprender TypeScript poco a poco.

Luego entramos a la carpeta del proyecto y ejecutamos:

```bash
cd nombre-del-proyecto
npm install
npm run dev
```

Con eso ya tenemos el proyecto funcionando. El comando `npm run dev` abre un servidor en nuestro navegador para ver los cambios en vivo.

## ¿Qué es `vite.config.ts`?
Dentro del proyecto, vamos a encontrar un archivo llamado `vite.config.ts`. Ese archivo es donde podemos configurar cómo funciona Vite. Algunas cosas que se pueden configurar son:

- Qué plugins usar (por ejemplo, para trabajar con React o Vue).
- Cómo queremos que se construya el proyecto para producción.
- Configuraciones especiales de rutas o alias (para importar archivos de forma más sencilla).

Por ahora, como estamos empezando, no necesitamos tocar mucho ese archivo. Pero es bueno saber que existe y que ahí podemos modificar cómo funciona Vite si lo necesitamos.

## Resumen
- Vite es una herramienta moderna que hace que programar con JavaScript (y TypeScript) sea más rápido y agradable.
- Nació para reemplazar herramientas como Webpack, que eran más lentas y difíciles de configurar.
- La gran ventaja de Vite es que usa ES Modules y no tiene que reconstruir todo el proyecto en cada cambio.
- Con Vite podemos crear un proyecto listo para empezar en segundos, y su configuración inicial es muy sencilla.
- El archivo `vite.config.ts` sirve para personalizar Vite según las necesidades del proyecto.

Con esto ya tenemos la base para empezar a trabajar con Vite en nuestros proyectos de programación.
