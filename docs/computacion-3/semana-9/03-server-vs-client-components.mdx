---
sidebar_position: 3
---

# Server Components vs. Client Components

Uno de los pilares arquitectónicos más potentes introducidos por Next.js en el App Router es la integración nativa de **React Server Components (RSC)**. Este paradigma transforma la forma en que pensamos sobre el ciclo de vida de nuestros componentes, estableciendo una división clara entre el cómputo que debe ocurrir en el servidor y la interactividad que requiere ejecutarse en el navegador del cliente.

En esta guía desmitificaremos el funcionamiento de los Server y Client Components, aprenderemos a utilizar estratégicamente la directiva `'use client'` y dominaremos los patrones de composición e intercalado (*interleaving*) recomendados en la industria.

---

## 1. El Nuevo Paradigma: Servidor por Defecto

En versiones anteriores de React y en frameworks tradicionales de frontend, todos los componentes se compilaban y enviaban al cliente para ser evaluados en el navegador. En el **App Router**, la premisa se invierte:

:::important[Regla de Oro en App Router]
**Todos los componentes dentro del directorio `app/` son Server Components por defecto**, a menos que se declare explícitamente lo contrario mediante la directiva `'use client'`.
:::

Esto significa que cuando creas un archivo como `page.tsx` o `CourseList.tsx`, su código fuente se ejecuta exclusivamente dentro del entorno de Node.js en el servidor. Nunca forma parte del paquete (*bundle*) de JavaScript que el navegador del usuario debe descargar.

<img src="/img/computacion-3/nextjs-server-client-components.svg" alt="Arquitectura y frontera entre Server Components y Client Components" width="100%" />

### Desglose del Diagrama y la Frontera de Red

1. **Bloque Izquierdo (Server Components - Predeterminado)**:
   - Los componentes residen y se ejecutan en el servidor (representado por el rack de servidores y la base de datos).
   - Tienen acceso directo al sistema de archivos, variables de entorno secretas (`process.env.DB_PASSWORD`), bases de datos (TypeORM, Prisma) y servicios internos.
   - Soportan la sintaxis nativa `async/await` en el propio cuerpo del componente.
   - **Cero kilobytes de JavaScript** viajan al cliente para estos componentes; únicamente se transmite el HTML resultante y un formato ligero denominado **RSC Payload**.
2. **La Frontera (`'use client'`)**:
   - Representada por la línea discontinua en el centro. La directiva `'use client'` actúa como un marcador para el compilador (Turbopack), indicándole que a partir de ese punto en el árbol de dependencias, el código debe empaquetarse para el navegador.
3. **Bloque Derecho (Client Components - Bajo Demanda)**:
   - Se ejecutan en el navegador (representado por la ventana del cliente).
   - Gestionan estados dinámicos en memoria (`useState`), efectos secundarios (`useEffect`) y eventos del usuario (`onClick`).
4. **Árbol de Componentes (Parte Inferior)**:
   - Muestra la estrategia recomendada: los componentes estructurales (`layout.tsx`, `page.tsx`, `Header`, `CourseList`) permanecen como Server Components, mientras que la interactividad se aísla en las hojas del árbol (`SearchBar`, `LikeButton`).

---

## 2. ¿Qué es realmente la directiva `'use client'`?

Existe una confusión común entre desarrolladores que asumen que `'use client'` significa *"este componente solo se ejecuta en el cliente"*. Esto es falso:

> **`'use client'` define un punto de corte (*boundary*) entre el código exclusivo de servidor y el código que debe ser hidratado en el navegador.**

Los Client Components **también se pre-renderizan en el servidor** durante la carga inicial para emitir el HTML estático correspondiente. La diferencia radica en que su código fuente sí se empaqueta en el bundle de JavaScript y viaja al navegador para que React conecte los escuchadores de eventos mediante el proceso de hidratación.

### Ejemplo de un Client Component

```tsx title="app/components/LikeButton.tsx" showLineNumbers
'use client'; // Directiva obligatoria en la primera línea

import { useState } from 'react';

interface LikeButtonProps {
  initialLikes: number;
}

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button
      type="button"
      onClick={() => setLikes(likes + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Me gusta ({likes})
    </button>
  );
}
```

---

## 3. Matriz de Decisión: ¿Cuándo usar cada tipo de componente?

Para diseñar arquitecturas limpias y eficientes, consulta esta guía rápida antes de escribir un componente:

| Necesidad del Componente | ¿Server Component? | ¿Client Component? |
| :--- | :---: | :---: |
| Obtener datos directamente de bases de datos o servicios backend | Sí | No |
| Usar claves de API secretas o tokens de autenticación privados | Sí | No |
| Reducir el tamaño del bundle de JavaScript enviado al usuario | Sí | No |
| Utilizar hooks de estado (`useState`, `useReducer`) | No | Sí (`'use client'`) |
| Escuchar eventos del DOM (`onClick`, `onChange`, `onSubmit`) | No | Sí (`'use client'`) |
| Usar hooks de ciclo de vida (`useEffect`, `useLayoutEffect`) | No | Sí (`'use client'`) |
| Acceder a APIs exclusivas del navegador (`window`, `localStorage`, `geolocation`) | No | Sí (`'use client'`) |
| Emplear hooks de navegación interactivos (`useRouter`, `usePathname`) | No | Sí (`'use client'`) |

---

## 4. Patrones de Composición e Intercalado (*Interleaving*)

Uno de los desafíos más habituales al adoptar React Server Components consiste en aprender a mezclar componentes de servidor y de cliente sin degradar el rendimiento.

### Regla 1: Las Props hacia un Client Component deben ser Serializables

Cuando un Server Component renderiza a un Client Component, las propiedades (*props*) cruzan la frontera de red entre Node.js y el navegador. Por tanto, los valores transmitidos deben poder serializarse en formato JSON o RSC Payload:

```tsx title="app/cursos/page.tsx (Server Component)" showLineNumbers
import LikeButton from '@/app/components/LikeButton';

export default async function CursosPage() {
  const curso = await obtenerCursoDesdeBD();

  return (
    <main>
      <h1>{curso.titulo}</h1>
      {/* Válido: initialLikes es un número primitivo serializable */}
      <LikeButton initialLikes={curso.likes} />
      
      {/* INVÁLIDO: No puedes pasar funciones no serializables como props */}
      {/* <LikeButton onAction={() => console.log('Acción')} /> */}
    </main>
  );
}
```

### Regla 2: Pasar Server Components como `children` a Client Components (Patrón de Ranura)

Una inquietud muy frecuente entre estudiantes es: *¿Si convierto un contenedor interactivo (como un modal o acordeón) en Client Component (`'use client'`), todos sus componentes hijos se convierten automáticamente en componentes de cliente?*

**No necesariamente.** La clave arquitectónica radica en cómo se estructuran las dependencias:

<img src="/img/computacion-3/nextjs-interleaving-pattern.svg" alt="Patrón de Intercalado: Inyección de Server Components dentro de Client Components" width="100%" />

### Desglose del Patrón de Ranura (*Slot Pattern*)

1. **La Composición en el Servidor (Panel Izquierdo)**:
   - Una página o componente de servidor (`page.tsx`) importa ambos elementos: el contenedor cliente (`Modal`) y el contenido de servidor (`ServerCard`).
   - Al declarar `<Modal><ServerCard /></Modal>`, el servidor Node.js ejecuta primero `<ServerCard />`, realiza las consultas a la base de datos y genera el HTML y el formato ligero RSC Payload.
2. **La Proyección en el Navegador (Panel Derecho)**:
   - El código fuente JavaScript de `<ServerCard />` **nunca se descarga en el navegador** (0 KB de bundle).
   - En el cliente, `<Modal>` gestiona su estado local (`useState(open)`) y sus animaciones, pero simplemente proyecta el contenido que ya vino resuelto en su propiedad especial `props.children`.
3. **El Antipatrón a Evitar (Parte Inferior)**:
   - Si dentro del archivo `Modal.tsx` (marcado con `'use client'`) haces un `import ServerCard from './ServerCard'`, el compilador asume que `ServerCard` es una dependencia directa de cliente, forzándolo a convertirse en Client Component e inflando el bundle innecesariamente.

```tsx title="app/components/Modal.tsx (Client Component)" showLineNumbers
'use client';

import { useState } from 'react';

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Cerrar' : 'Abrir Modal'}
      </button>

      {isOpen && (
        <div className="border p-4 rounded shadow-lg">
          {/* Los hijos se renderizaron en el servidor y aquí solo se proyectan */}
          {children}
        </div>
      )}
    </div>
  );
}
```

Luego, en una página de servidor, compones ambos elementos:

```tsx title="app/page.tsx (Server Component)" showLineNumbers
import Modal from '@/app/components/Modal';
import ServerProfileData from '@/app/components/ServerProfileData';

export default function HomePage() {
  return (
    <main>
      <h1>Bienvenido al Portal</h1>
      <Modal>
        {/* ServerProfileData se ejecuta en el servidor y su resultado viaja dentro del Modal */}
        <ServerProfileData />
      </Modal>
    </main>
  );
}
```

:::tip[Principio de Responsabilidad Única]
Ubica la directiva `'use client'` lo más abajo posible en el árbol de componentes (en las *hojas*). Esto garantiza que el 80% o 90% de tu interfaz se beneficie de la velocidad y seguridad de los Server Components, limitando la hidratación exclusivamente a los pequeños botones, campos o modales interactivos.
:::

---

## Cuestionario de Autoevaluación

<Quiz id="compu3-s9-03-server-client-quiz">
  <Question title="¿Cuál es el tipo de componente predeterminado para cualquier archivo nuevo creado dentro del directorio app/?">
    <Option>Client Component puro.</Option>
    <Option correct>React Server Component (Server Component).</Option>
    <Option>Web Component estándar de HTML5.</Option>
    <Option>Microfrontend aislado en un iframe.</Option>
  </Question>

  <Question title="¿Qué sucede con el código fuente de un Server Component en relación al paquete de JavaScript enviado al navegador?">
    <Option>Se comprime mediante WebAssembly y se almacena en el caché del navegador.</Option>
    <Option correct>Aporta cero kilobytes al bundle de JavaScript del cliente, pues solo se transmite el HTML y el RSC Payload resultante.</Option>
    <Option>Se transfiere en texto plano para que el navegador lo ejecute en un Service Worker.</Option>
    <Option>Se descarga como un script adicional con el atributo defer.</Option>
  </Question>

  <Question title="¿Cuál es la función exacta de la directiva 'use client' en la cabecera de un archivo?">
    <Option>Forzar a que el servidor ignore completamente el archivo y no genere HTML estático inicial.</Option>
    <Option correct>Marcar una frontera entre el código de servidor y el de cliente, indicando que el componente y sus dependencias deben ser empaquetados e hidratados en el navegador.</Option>
    <Option>Habilitar el protocolo HTTP/3 exclusivo para peticiones hacia APIs externas.</Option>
    <Option>Convertir el componente en una función sin estado para acelerar el renderizado.</Option>
  </Question>

  <Question title="¿Cuál de los siguientes escenarios REQUIERE obligatoriamente transformar un componente a Client Component con 'use client'?">
    <Option>Ejecutar una consulta a una base de datos PostgreSQL mediante un ORM.</Option>
    <Option>Leer una variable de entorno secreta definida en el archivo .env.</Option>
    <Option correct>Manejar un evento onClick en un botón o utilizar el hook useState para gestionar el estado local.</Option>
    <Option>Generar etiquetas meta estáticas para el título de la página web.</Option>
  </Question>

  <Question title="¿Qué tipo de propiedades (props) NO se pueden pasar directamente desde un Server Component hacia un Client Component?">
    <Option>Cadenas de texto primitivas (strings).</Option>
    <Option>Objetos JSON planos con números y booleanos.</Option>
    <Option correct>Funciones o métodos del servidor (salvo Server Actions debidamente declaradas), ya que no son serializables.</Option>
    <Option>Arreglos de identificadores numéricos.</Option>
  </Question>

  <Question title="¿Cómo se puede renderizar un Server Component dentro de un Client Component interactivo sin que el hijo pierda su condición de Server Component?">
    <Option>Importando el Server Component directamente con la función require().</Option>
    <Option correct>Pasando el Server Component como propiedad 'children' o a través de slots JSX desde un componente padre en el servidor.</Option>
    <Option>Utilizando una etiqueta &lt;iframe&gt; con la URL interna del componente.</Option>
    <Option>No es posible bajo ninguna circunstancia según las especificaciones de React.</Option>
  </Question>

  <Question title="¿Por qué se recomienda colocar la directiva 'use client' en las hojas (leaves) del árbol de componentes en lugar de en la raíz?">
    <Option>Porque los navegadores antiguos no soportan directivas de más de 10 caracteres.</Option>
    <Option correct>Para maximizar la cantidad de componentes renderizados en el servidor y minimizar el peso del código JavaScript descargado por el cliente.</Option>
    <Option>Porque de lo contrario el archivo layout.tsx arroja una excepción fatal de memoria.</Option>
    <Option>Para obligar al servidor a reiniciar automáticamente en cada compilación.</Option>
  </Question>

  <Question title="Si un componente requiere leer el valor 'window.innerWidth' o consultar 'localStorage', ¿dónde debe ejecutarse?">
    <Option>Exclusivamente en un Server Component mediante una llamada a eval().</Option>
    <Option correct>En un Client Component ('use client') dentro de un hook useEffect o manejador de eventos, donde el objeto window esté disponible.</Option>
    <Option>En el archivo middleware.ts del servidor.</Option>
    <Option>En el archivo de configuración next.config.ts.</Option>
  </Question>

  <Question title="¿Qué es el 'RSC Payload' emitido por Next.js durante el renderizado de Server Components?">
    <Option>Un archivo binario que reemplaza los estilos CSS de Tailwind.</Option>
    <Option correct>Una representación compacta de datos que contiene el árbol de componentes del servidor y marcadores para hidratar los Client Components.</Option>
    <Option>Una cookie cifrada que almacena la sesión del usuario.</Option>
    <Option>Un volcado del registro de errores del servidor Node.js.</Option>
  </Question>

  <Question title="¿Un Client Component participa en el pre-renderizado en el servidor durante la primera solicitud de una página?">
    <Option>No, los Client Components se descargan totalmente en blanco y se dibujan únicamente en el navegador.</Option>
    <Option correct>Sí, Next.js genera su HTML inicial en el servidor para que el contenido sea visible de inmediato, y luego lo hidrata en el cliente.</Option>
    <Option>Solo si el usuario navega desde una conexión cableada de alta velocidad.</Option>
    <Option>Únicamente si se deshabilita la directiva 'use client' en producción.</Option>
  </Question>
</Quiz>
