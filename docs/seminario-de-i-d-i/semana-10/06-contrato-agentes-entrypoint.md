---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Contrato AGENTS.md

En el desarrollo de software profesional con agentes en consola, el archivo de instrucciones no es un manual de usuario para personas; es un **contrato formal de arquitectura y comportamiento para la máquina**.

Este estándar ha convergido en la industria en torno a dos nombres canónicos: **`AGENTS.md`** (estándar agnóstico adoptado por la comunidad abierta) y **`CLAUDE.md`** (utilizado por el ecosistema de Anthropic). Si el agente encuentra uno de estos archivos en la raíz del repositorio al iniciar sesión, lo carga inmediatamente como su directiva prioritaria.

---

## 1. Arquitectura Modular: `AGENTS.md` como Entrypoint

A medida que una aplicación crece, incluir todas las directrices en un único archivo produce desorden y satura el contexto. La buena práctica consiste en utilizar `AGENTS.md` en la raíz como un **punto de entrada ligero (*Entrypoint*)** que indexa y enlaza subdirectorios especializados dentro de la carpeta `.agents/`:

![Estructura Modular de AGENTS.md y Documento Vivo](/img/seminario-de-i-d-i/estructura-agents-entrypoint.svg)

### Distribución de Responsabilidades en `.agents/`

```text
mi_proyecto_flutter/
├── AGENTS.md                      # Entrypoint principal en la raíz
└── .agents/
    ├── memory/                    # Reglas duras de arquitectura y decisiones técnicas
    │   ├── arquitectura-flutter.md # Convención Screen vs Page, inmutabilidad de datos
    │   └── ui-tokens-material3.md # Semillas de color, tipografía y estilo visual
    ├── conventions/               # Estándares de calidad y estilo de código
    │   ├── estilo-dart.md         # Reglas de linteo, uso obligatorio de const
    │   └── git-workflow.md        # Convención de commits (feat:, fix:, refactor:)
    └── workflows/                 # Checklists y procesos de validación
        └── checklist-ui.md        # Lista de comprobación antes de aprobar una vista
```

:::note[¿Por qué no incluimos "skills" todavía?]
Las *skills* son paquetes ejecutables con scripts y esquemas de invocación dinámica que estudiaremos a profundidad en la **Semana 11**. En esta etapa nos enfocamos exclusivamente en la **memoria, convenciones y directrices contractuales**.
:::

---

## 2. Generación del Contrato: El Comando `/init` y su Meta-Prompt

### ¿Qué hace el comando nativo `/init`?
En herramientas con soporte integrado (como Claude Code o Antigravity), escribir `/init` en la terminal ejecuta un analizador estático sobre el repositorio:
1. Inspecciona los manifiestos (`pubspec.yaml`, `package.json`, `analysis_options.yaml`).
2. Detecta el lenguaje (Dart 3.x), el framework (Flutter) y los comandos habituales de construcción.
3. Genera un borrador inicial de `AGENTS.md` o `CLAUDE.md` adaptado a la estructura detectada.

### El Meta-Prompt Universal de Inicialización
Si tu CLI no cuenta con el comando `/init` de forma nativa o si estás configurando un repositorio desde cero con OpenCode, ejecuta este **Meta-Prompt** directamente en la terminal:

```markdown title="Meta-Prompt para generar el primer AGENTS.md"
Actúa como un Arquitecto de Software Senior en Flutter. Inspecciona este repositorio 
(revisa pubspec.yaml, analysis_options.yaml y la carpeta lib/).

Genera un archivo AGENTS.md conciso y modular para la raíz del proyecto que sirva 
de contrato operativo para futuros agentes de IA. Debe cumplir con:
1. Comandos de terminal esenciales (flutter analyze, dart format, flutter test).
2. Regla innegociable de arquitectura: Separación Screen (con Scaffold) vs Page (sin Scaffold).
3. Restricción de estado: 100% StatelessWidget, inmutabilidad y paso de parámetros por constructor.
4. Diseño: Material Design 3 estricto, utilizando Theme.of(context).colorScheme.
5. Índice de enlaces hacia la carpeta .agents/ (memory, conventions, workflows).
6. Lista concisa de anti-patrones prohibidos (ej. Scaffolds anidados, colores quemados en hex, StatefulWidget).

Sé sintético y directo. No agregues explicaciones redundantes que consuman tokens innecesarios.
```

---

## 3. El Archivo de Contexto como un Documento Vivo

Un error recurrente al iniciar en programación agéntica es concebir el `AGENTS.md` como una configuración estática que se escribe una sola vez y se archiva.

En la práctica profesional con enfoque **Human-in-the-Lead**, el archivo de contexto es un **organismo vivo que evoluciona con el ciclo de vida del software**, capturando los aprendizajes y resoluciones del equipo:

* **Paso 1: Detección del patrón:** El agente comete un error o una desviación recurrente (por ejemplo, utilizar propiedades obsoletas en un widget).
* **Paso 2: Diagnóstico de la causa raíz:** Como líder del desarrollo, identificas que la convención o restricción técnica no estaba explícitamente formulada en el contrato.
* **Paso 3: Redacción sintética:** Se redacta una regla concisa y directa dentro de `AGENTS.md` o en el archivo temático de `.agents/memory/`.
* **Paso 4: Recarga inmediata:** En la siguiente interacción o sesión, el agente lee el contrato actualizado y adopta el estándar sin necesidad de supervisión manual continua.

### Protocolo de Actualización
* **Regla de las dos advertencias:** Si tienes que corregir al agente dos veces sobre la misma mala práctica (por ejemplo, omitir constructores `const`), no lo corrijas una tercera vez a mano. **Abre `AGENTS.md` y añade la restricción.**
* **Concisión y claridad:** Sé directo y taxativo. Es más efectivo escribir:
  ```markdown
  - PROHIBIDO: Usar Scaffold dentro de archivos ubicados en lib/pages/.
  ```
  que escribir un párrafo justificativo de tres párrafos sobre la historia del diseño en Flutter.
* **Control de versiones:** El archivo `AGENTS.md` y la carpeta `.agents/` **deben incluirse en los commits de Git**. De esta forma, cualquier miembro del equipo de desarrollo (o evaluador) que clone el repositorio compartirá exactamente el mismo estándar de asistencia agéntica.

En la siguiente lección llevaremos todo esto a la práctica en nuestro **Taller de Laboratorio en Clase**, implementando el agente sobre la aplicación móvil inicial.
