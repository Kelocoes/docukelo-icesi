---
sidebar_position: 2
description: "Identifica el antipatrón del componente monolítico en Next.js y aprende a separar capas aplicando principios SOLID en el frontend."
---

# El Antipatrón del Componente Monolítico

Al construir aplicaciones con **Next.js**, la inercia más común entre desarrolladores es colocar toda la lógica dentro de los propios componentes de React. Esta aproximación, conocida como arquitectura guiada exclusivamente por componentes, funciona en prototipos de juguete, pero se convierte rápidamente en una pesadilla de mantenimiento en proyectos de ingeniería reales.

En esta lección analizaremos por qué los componentes sobrecargados (*Fat Components*) degradan la mantenibilidad del código y cómo los principios de **Clean Architecture** aplicados al frontend resuelven este problema de raíz.

---

## 1. Radiografía del Componente Espagueti

Imaginemos una pantalla sencilla para gestionar ejercicios de entrenamiento físico (un módulo habitual conectado a un backend de NestJS). En un enfoque ingenuo de Next.js, el archivo `ExercisePage.tsx` suele lucir así:

```tsx title="src/app/exercises/page.tsx (Antipatrón: Fat Component)" showLineNumbers
'use client';

import { useState, useEffect } from 'react';

// Tipado acoplado directamente al JSON del backend
interface ExerciseFromApi {
  id: string;
  exercise_name: string;
  muscle_group: string | null;
  difficulty_lvl?: number;
}

export default function ExercisePage() {
  const [exercises, setExercises] = useState<ExerciseFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');

  // 1. Acceso a red directo en el componente
  useEffect(() => {
    fetch('http://localhost:3000/api/exercises')
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. Lógica de negocio e invariantes mezcladas con el evento de la vista
  const handleCreate = async () => {
    if (name.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (!['CHEST', 'BACK', 'LEGS', 'ARMS'].includes(muscle.toUpperCase())) {
      alert('Grupo muscular no válido');
      return;
    }

    // 3. Payload formateado a mano según exigencias del backend
    const payload = {
      exercise_name: name,
      muscle_group: muscle.toUpperCase(),
      difficulty_lvl: 2,
    };

    const res = await fetch('http://localhost:3000/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const created = await res.json();
    setExercises((prev) => [...prev, created]);
    setName('');
  };

  // 4. Renderizado visual con decenas de clases de Tailwind
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ejercicios</h1>
      <div className="flex gap-2 mb-6">
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nombre" 
          className="border p-2 rounded" 
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </div>

      {loading ? (
        <p>Cargando ejercicios...</p>
      ) : (
        <ul className="space-y-2">
          {exercises.map((item) => (
            <li key={item.id} className="p-3 border rounded shadow-sm">
              <span className="font-semibold">{item.exercise_name}</span> - {item.muscle_group ?? 'General'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### ¿Por qué este código es frágil y costoso de mantener?

Este archivo de apenas 80 líneas ya tiene **cinco responsabilidades distintas** totalmente entremezcladas:

1. **Protocolo de transporte HTTP**: Conoce la URL exacta (`http://localhost:3000/api/exercises`), los métodos HTTP (`GET`, `POST`) y las cabeceras (`Content-Type`).
2. **Formato crudo del backend**: Depende directamente de la nomenclatura del servidor (`exercise_name`, `muscle_group`, `difficulty_lvl`). Si el equipo de backend renombra una propiedad a `camelCase` o normaliza la base de datos, el archivo entero se rompe.
3. **Reglas de negocio e invariantes**: Valida que el nombre tenga al menos 3 caracteres y que el grupo muscular pertenezca a una lista blanca dentro de la función del botón.
4. **Estado reactivo local**: Coordina los estados `loading`, `exercises`, `name` y `muscle`.
5. **Renderizado visual**: Maneja los elementos JSX, etiquetas semánticas y estilos de Tailwind CSS.

:::danger[El problema de fondo: Violación del principio SRP]
El componente tiene demasiadas razones para cambiar. Cambiará si se actualiza la API REST, si cambian las reglas de validación del negocio, si se rediseña la interfaz de usuario, o si se desea migrar de `fetch` a `axios` o `react-query`.
:::

---

## 2. Contraste Visual: Monolito vs. Separación en Capas

A continuación se ilustra la diferencia estructural entre concentrar todas las responsabilidades en un solo archivo frente a distribuirlas en capas especializadas:

![Componente Monolítico vs. Separación en Capas](/img/computacion-3/clean-arch-spaghetti-vs-layers.svg)

---

## 3. Principios SOLID Aplicados al Frontend

Para superar este antipatrón en Next.js, nos apoyamos en dos principios fundamentales de diseño de software:

### 3.1. Principio de Responsabilidad Única (SRP)
Cada módulo, clase o función debe tener **una sola responsabilidad y una única razón para cambiar**:
- La **Vista (JSX)** solo debe preocuparse por cómo se presentan los datos al usuario.
- El **Caso de Uso** solo debe encargarse de orquestar la acción requerida por el usuario y ejecutar las reglas de negocio.
- El **Repositorio** solo debe encargarse de la persistencia y recuperación de datos.
- El **Mapper** solo debe encargarse de transformar datos entre formatos incompatibles.

### 3.2. Principio de Inversión de Dependencias (DIP) y la Regla de Dependencia
El creador de Clean Architecture, Robert C. Martin, formula la regla de oro:
> *Las dependencias en el código fuente solo pueden apuntar hacia adentro, en dirección a las políticas de más alto nivel (el Dominio).*

En el contexto de Next.js, esto significa:
- **El Dominio no conoce a React**: Ningún archivo dentro de la capa de dominio puede importar `useState`, `useEffect`, `next/navigation` ni dependencias de interfaz.
- **La UI depende de abstracciones**: La vista consume casos de uso e interfaces abstractas, no clientes HTTP concretos ni URLs fijas.

---

## 4. Estructura de Proyecto Propuesta para Next.js

Adaptando las convenciones de Clean Architecture al ecosistema de Next.js y TypeScript, organizamos el código mediante **Vertical Slices (Features)**:

![Estructura por Features en Next.js](/img/computacion-3/clean-arch-nextjs-feature-structure.svg)

### Correspondencia de Directorios

```plaintext
src/
├── core/                                     # Recursos transversales de la aplicación
│   ├── errors/                               # Clases de error estandarizadas
│   ├── http/                                 # Cliente HTTP base configurado
│   └── components/ui/                        # Componentes genéricos de UI (Button, Modal, Input)
│
└── features/                                 # Módulos del negocio (Vertical Slices)
    └── exercises/                            # Feature específica de Ejercicios
        ├── domain/                           # Reglas de negocio puras (TypeScript)
        │   ├── entities/                     # Entidades inmutables (exercise.ts)
        │   ├── repositories/                 # Interfaces abstractas (exercise.repository.ts)
        │   └── usecases/                     # Casos de uso / Interactors (get-exercises.usecase.ts)
        │
        ├── infrastructure/                   # Adaptadores de comunicación externa
        │   ├── dtos/                         # Contratos crudos de la API (exercise.dto.ts)
        │   ├── mappers/                      # Conversores DTO <-> Entidad (exercise.mapper.ts)
        │   ├── datasources/                  # Conexión HTTP o Mock en memoria
        │   └── repositories/                 # Implementación concreta del repositorio
        │
        ├── di/                               # Inyección de dependencias / Composition Root
        │   └── exercise.container.ts         # Ensamblador de dependencias
        │
        └── presentation/                     # Capa de presentación visual (React / Next.js)
            ├── hooks/                        # Custom Hook Presenter (use-exercises.ts)
            └── components/                   # Componentes visuales puros (ExerciseCard, ExerciseForm)
```

:::tip[¿Por qué organizar por Features en lugar de carpetas globales?]
Organizar por carpetas técnicas globales (`src/entities`, `src/usecases`, `src/components`) dispersa el código de una misma funcionalidad a lo largo de todo el árbol. Agrupar por feature (`features/exercises`) mantiene la alta cohesión del módulo y permite aislar cambios sin afectar otras áreas del proyecto.
:::

---

## 5. Resumen de la Lección

1. **El componente espagueti** viola el principio SRP al mezclar red, lógica de negocio, formato JSON y JSX en un solo archivo.
2. **Cualquier cambio en el backend** rompe la vista si los componentes consumen directamente los DTOs crudos de la API.
3. **Clean Architecture en Next.js** garantiza que el núcleo de negocio permanezca puro, inmune a actualizaciones del framework o cambios de endpoints.
4. En la siguiente lección profundizaremos en la **Capa de Dominio**, construyendo las entidades inmutables y los casos de uso en TypeScript puro.

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s11-problemas-arquitectura-componentes-quiz">
  <Question title="¿Cuál es la característica principal de un 'Fat Component' o componente espagueti en Next.js?">
    <Option>Utiliza exclusivamente Server Actions para todas las operaciones de lectura.</Option>
    <Option correct>Concentra en un solo archivo llamadas fetch, formateo de payloads, reglas de negocio, estado reactivo y renderizado visual.</Option>
    <Option>Delega toda la interacción a hooks externos y componentes atómicos reutilizables.</Option>
    <Option>Está escrito en TypeScript estricto sin permitir el uso de tipos implícitos.</Option>
  </Question>
  <Question title="¿Qué principio fundamental de SOLID se viola directamente cuando un componente mezcla red, reglas de negocio y JSX?">
    <Option>Principio de Sustitución de Liskov (LSP).</Option>
    <Option>Principio de Abierto/Cerrado (OCP).</Option>
    <Option correct>Principio de Responsabilidad Única (SRP).</Option>
    <Option>Principio de Segregación de Interfaces (ISP).</Option>
  </Question>
  <Question title="¿Qué consecuencia técnica ocurre si la vista depende directamente de los tipos crudos del JSON de la API?">
    <Option>La aplicación incrementa drásticamente el tamaño del bundle generado por Webpack.</Option>
    <Option correct>Cualquier cambio de nomenclatura o estructura en el backend (ej. renombrar campos) romperá de inmediato la interfaz de usuario.</Option>
    <Option>Next.js desactiva el renderizado del lado del servidor (SSR) de manera automática.</Option>
    <Option>El navegador bloquea las peticiones HTTP por políticas de CORS estricto.</Option>
  </Question>
  <Question title="¿Por qué es difícil realizar pruebas unitarias sobre un componente monolítico en Next.js?">
    <Option>Porque Jest no es compatible con archivos que contienen sintaxis JSX o TSX.</Option>
    <Option>Porque las reglas de TypeScript impiden mockear funciones declaradas con la palabra reservada function.</Option>
    <Option correct>Porque no se puede testear la lógica de validación o cálculo sin montar y renderizar todo el árbol DOM del componente.</Option>
    <Option>Porque los componentes de React solo pueden evaluarse en entornos de producción desplegados.</Option>
  </Question>
  <Question title="En el contexto de Clean Architecture en frontend, ¿qué restricción tiene la Capa de Dominio respecto a React?">
    <Option>Debe utilizar únicamente React Server Components para asegurar alto rendimiento.</Option>
    <Option correct>El Dominio no debe importar useState, useEffect, next/navigation ni ninguna dependencia de interfaz.</Option>
    <Option>Debe extender obligatoriamente de React.Component para manejar el ciclo de vida.</Option>
    <Option>Debe encapsular los estilos CSS mediante styled-components o módulos Tailwind.</Option>
  </Question>
  <Question title="¿Qué propone la organización de código por Vertical Slices (Features) frente a carpetas técnicas globales?">
    <Option>Crear un único archivo index.ts donde se exporte todo el código fuente del proyecto.</Option>
    <Option correct>Agrupar el dominio, la infraestructura y la presentación dentro de carpetas por funcionalidad (ej. features/exercises).</Option>
    <Option>Separar estrictamente los archivos según su extensión: .ts en la raíz y .tsx en subcarpetas públicas.</Option>
    <Option>Alojar todos los componentes de la aplicación en una carpeta compartida src/components.</Option>
  </Question>
  <Question title="¿Cuál es la función del directorio src/core/ dentro de la arquitectura por features propuesta?">
    <Option>Contener los controladores de autenticación y lógica privada de bases de datos.</Option>
    <Option>Reemplazar la configuración nativa de package.json y tsconfig.json.</Option>
    <Option correct>Albergar recursos y utilidades transversales como errores estandarizados, clientes HTTP base y componentes UI genéricos.</Option>
    <Option>Guardar los archivos binarios compilados y bundles estáticos de la aplicación.</Option>
  </Question>
  <Question title="Dentro de una feature organizada con Clean Architecture, ¿dónde se ubican los Custom Hooks como useExercises?">
    <Option>features/&lt;feature&gt;/domain/entities/</Option>
    <Option>features/&lt;feature&gt;/infrastructure/datasources/</Option>
    <Option correct>features/&lt;feature&gt;/presentation/hooks/</Option>
    <Option>features/&lt;feature&gt;/core/extensions/</Option>
  </Question>
  <Question title="¿Qué rol cumplen las interfaces ubicadas en features/&lt;feature&gt;/domain/repositories/?">
    <Option>Configurar los parámetros de conexión a bases de datos relacionales o NoSQL.</Option>
    <Option correct>Definir contratos abstractos de persistencia que la infraestructura debe implementar, cumpliendo el principio DIP.</Option>
    <Option>Generar automáticamente los endpoints REST correspondientes en el servidor NestJS.</Option>
    <Option>Manejar el almacenamiento de variables de sesión en LocalStorage o Cookies.</Option>
  </Question>
  <Question title="¿Cuál es la principal ventaja de aislar el núcleo de negocio frente a la evolución del framework?">
    <Option>Permite que Next.js compile a código binario nativo de WebAssembly.</Option>
    <Option>Garantiza que la aplicación nunca necesite mantenimiento preventivo ni parches de seguridad.</Option>
    <Option correct>Permite actualizar versiones de Next.js, cambiar librerías de estado o migrar a otro framework sin alterar la lógica de negocio.</Option>
    <Option>Elimina la necesidad de escribir tipos en TypeScript al transferir datos entre componentes.</Option>
  </Question>
</Quiz>

