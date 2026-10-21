---
sidebar_position: 1
description: "Aprende qué es una skill, cómo se estructura el archivo SKILL.md y cómo instalarla e invocarla para extender a tus agentes."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Skills: Extensión de Agentes

En las sesiones anteriores aprendiste que la ventana de contexto de un modelo de inteligencia artificial es un recurso finito y costoso. Si intentamos colocar todas las instrucciones, manuales de estilo, guías de librerías y scripts de automatización dentro de un solo archivo `AGENTS.md` o `CLAUDE.md`, generamos **Context Bloat** (sobrecarga de contexto), lo que dispara la latencia y produce el fenómeno de *Lost in the Middle* (degradación de atención).

Para solucionar este desafío de ingeniería, las herramientas de terminal modernas (`agy`, `opencode`, Claude Code) incorporan el concepto de **Skills**: paquetes de conocimiento procedimental y herramientas especializadas que el agente carga bajo demanda únicamente cuando la tarea lo requiere.

---

## 1. ¿Qué es una Skill?

Una **Skill** es un módulo autocontenido de capacidades que extiende la inteligencia operativa de un agente de IA. A diferencia de las reglas globales y permanentes del repositorio:

* **No satura la memoria inicial:** Permanece dormida en el disco local y solo se inyecta en la ventana de contexto cuando el usuario la invoca explícitamente o cuando el agente determina que la tarea coincide con la descripción de la skill.
* **Aporta memoria procedimental:** Contiene flujos paso a paso ("cómo hacer X"), heurísticas de depuración y buenas prácticas específicas de un dominio (por ejemplo, Flutter con Material Design 3).
* **Incluye herramientas ejecutables:** Puede empaquetar scripts de terminal (Python, Bash, Dart) y plantillas de código para que el agente ejecute diagnósticos y validaciones automatizadas.

![Anatomía de una Skill y Carga Quirúrgica en Memoria](/img/seminario-de-i-d-i/skills-anatomia-invocacion.svg)

---

## 2. Anatomía de una Skill

Físicamente, una skill es un directorio estructurado ubicado en las carpetas de configuración del agente (a nivel de proyecto en `.agents/skills/<nombre-skill>/` o a nivel de usuario en `~/.gemini/antigravity-cli/skills/`).

Su anatomía se compone de los siguientes elementos obligatorios y opcionales:

```bash title="Estructura de una skill"
.agents/skills/flutter-helper/
├── SKILL.md            # [OBLIGATORIO] Manifiesto, metadata YAML e instrucciones
├── scripts/            # [OPCIONAL] Scripts de automatización ejecutables
│   ├── check_lints.py
│   └── audit_dispose.sh
└── references/         # [OPCIONAL] Plantillas, tokens de diseño y esquemas
    ├── m3_colors.json
    └── state_blueprint.dart
```

### El archivo `SKILL.md` y su Frontmatter YAML

El archivo `SKILL.md` es el punto de entrada obligatorio. Comienza con un bloque de metadatos en formato YAML delimitado por tres guiones (`---`):

```markdown title=".agents/skills/flutter-helper/SKILL.md" showLineNumbers
---
name: flutter-helper
description: "Especialista en desarrollo frontend con Flutter, Material 3, ciclo de vida de State y prevención de memory leaks."
---

# Flutter Helper Skill

Esta skill guía la construcción, auditoría y refactorización de interfaces en Flutter.

## Reglas de Implementación
1. Separar estrictamente Screen (Scaffold anfitrión) de Page (lienzo interno).
2. Todo recurso con listeners (TextEditingController) debe destruirse en dispose().
3. Usar constructores const en todos los widgets inmutables.
```

* **`name`**: Identificador único en kebab-case utilizado para invocar la skill desde la línea de comandos (ej. `/skill flutter-helper`).
* **`description`**: Resumen conciso de cuándo y para qué debe activarse. Los agentes utilizan esta descripción para seleccionar automáticamente la skill adecuada mediante similitud semántica cuando el usuario formula una petición.

---

## 3. Instalación e Invocación de Skills

Las skills pueden instalarse en dos niveles de alcance según la necesidad del equipo:

### 1. Nivel de Proyecto (Compartido con el Equipo)
Se guardan dentro del repositorio en `.agents/skills/<skill-name>/` y se incluyen en el control de versiones con Git. De este modo, cualquier integrante del equipo o agente que clone el repositorio dispondrá exactamente de las mismas habilidades operativas.

### 2. Nivel Global (Entorno del Desarrollador)
Se guardan en el directorio de usuario del CLI (por ejemplo, en Windows `C:\Users\<Usuario>\.gemini\config\skills\` o en Linux/macOS `~/.config/agy/skills/`). Están disponibles para cualquier proyecto que abras en tu terminal.

### Invocación en la Consola

En el CLI agéntico, puedes cargar e interactuar con una skill de dos formas:

<Tabs>
<TabItem value="manual" label="Invocación Explícita (/skill)" default>

```yaml title="Invocación explícita"
# Carga directa de la skill en la sesión activa
> /skill flutter-helper

[System] Skill 'flutter-helper' loaded into active context.
Tokens added: 920 tokens (0.7% of context limit).

> "Genera una vista para registrar un nuevo contacto con validación de teléfono"
```

</TabItem>
<TabItem value="automatica" label="Activación Semántica Automática">

```yaml title="Activación automática"
# El agente detecta la necesidad a partir del prompt y carga la skill
> "Revisa lib/pages/contact_page.dart y verifica si hay fugas de memoria en los controladores"

[Agent Decision] Task matches skill 'flutter-helper'. Activating procedural guide...
[Agent] Inspeccionando dispose() en los controladores de lib/pages/contact_page.dart.
```

</TabItem>
</Tabs>

---

## 4. Instalación de la Skill de Flutter para el Curso

Para este curso, utilizaremos una skill especializada en Flutter que provee:
1. Verificación automática de la regla **Screen vs. Page** (evitar `Scaffold` anidados).
2. Detección de controladores huérfanos que omiten la llamada a `dispose()`.
3. Comprobación del uso de componentes oficiales de **Google Material Design 3**.

Para verificar las skills disponibles en tu entorno de consola, ejecuta:

```bash title="Terminal" showLineNumbers
agy skill list
```

O dentro de la sesión interactiva del agente:

```yaml title="Listar skills"
> /skills
```

---

## 5. Auditoría del Código Generado y el Contrato Vivo

Cuando el agente genera o modifica código asistido por la skill, tu responsabilidad como **Human-in-the-Lead** es auditar el resultado antes de integrarlo al proyecto.

![Bucle de Auditoría y Decisión Human-in-the-Lead](/img/seminario-de-i-d-i/bucle-feedback-contrato.svg)

### ¿Qué se corrige a mano y qué se corrige en el contrato?

Uno de los errores más comunes al trabajar con agentes de IA es caer en dos extremos improductivos: corregir todo a mano repitiendo el trabajo una y otra vez, o sobrecargar el archivo `AGENTS.md` con reglas diminutas e irrelevantes.

| Situación | Diagnóstico | Acción Correcta | Justificación |
| :--- | :--- | :--- | :--- |
| **Error Puntual o Cosmético** | Un margen de `16.0` en vez de `20.0`, o un texto de un botón que requiere un ajuste de redacción específico. | **Corregir a mano** directamente en el archivo `.dart`. | No vale la pena gastar tokens ni ensuciar el contrato global para una regla que solo aplica a una vista particular. |
| **Violación Arquitectónica Sistémica** | El agente anidó un `Scaffold` dentro de una `Page`, usó `StatefulWidget` para datos estáticos, o inventó componentes de Flutter 1 (`FlatButton`). | **Ajustar el contrato** (`AGENTS.md` o `.agents/memory/`). | Si no corriges el contrato, el agente cometerá exactamente el mismo error en la siguiente pantalla que le pidas maquetar. |

:::tip[El Principio del Contrato Vivo]
Cada vez que el agente cometa un error arquitectónico recurrente, no te limites a arreglar el código: **agrega la regla negativa o positiva en `.agents/memory/`**. Al hacer esto, capitalizas el aprendizaje para todo el semestre y para todos tus compañeros de equipo mediante Git.
:::

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s11-skills-extension-quiz">
  <Question title="¿Cuál es la principal ventaja de utilizar una Skill en lugar de colocar todas las instrucciones en AGENTS.md?">
    <Option>Permite que el agente compile aplicaciones Flutter sin tener el SDK instalado.</Option>
    <Option correct>Evita la sobrecarga de la ventana de contexto (Context Bloat), cargando el conocimiento procedimental bajo demanda únicamente cuando la tarea lo requiere.</Option>
    <Option>Las skills sustituyen por completo el código fuente de la aplicación móvil.</Option>
    <Option>Hace que el modelo de lenguaje funcione sin conexión a Internet en cualquier computadora.</Option>
  </Question>

  <Question title="¿Qué archivo es obligatorio dentro de la carpeta de cualquier Skill y qué sección debe incluir al inicio?">
    <Option>README.txt con una lista de comandos de Flutter.</Option>
    <Option>config.json con las contraseñas de la base de datos Supabase.</Option>
    <Option correct>SKILL.md con un bloque de metadatos YAML frontmatter delimitado por tres guiones (---) que define su nombre y descripción.</Option>
    <Option>main.dart con una clase StatelessWidget básica.</Option>
  </Question>

  <Question title="Si el agente genera una vista y coloca un padding de 12px en vez de 16px en una tarjeta específica, ¿cuál es la acción recomendada según el principio Human-in-the-Lead?">
    <Option>Borrar todo el repositorio y volver a empezar desde cero.</Option>
    <Option correct>Corregir el valor a mano en el archivo Dart, ya que es un ajuste cosmético puntual que no justifica contaminar el contrato global de contexto.</Option>
    <Option>Crear una nueva regla en AGENTS.md exigiendo que ningún padding pueda ser de 12px en toda la aplicación.</Option>
    <Option>Desinstalar la CLI agéntica y escribir el proyecto en Java Swing.</Option>
  </Question>

  <Question title="Si el agente genera reiteradamente Scaffolds anidados dentro de las Pages violando la arquitectura limpia, ¿cuál es la acción requerida?">
    <Option>Aceptar el código porque Flutter lo compila sin advertencias sintácticas.</Option>
    <Option>Corregirlo a mano en silencio cada vez que ocurra durante todo el semestre.</Option>
    <Option correct>Actualizar el contrato agéntico (AGENTS.md o la memoria de convenciones) para prohibir explícitamente el antipatrón de Scaffolds anidados en Pages.</Option>
    <Option>Reiniciar la computadora para limpiar la memoria caché de Dart.</Option>
  </Question>

  <Question title="¿Cómo se invoca manualmente una skill en la consola de un agente interactivo?">
    <Option>git push --skill flutter</Option>
    <Option correct>Mediante el comando /skill &lt;nombre-de-la-skill&gt; en la sesión de terminal activa.</Option>
    <Option>flutter pub add skill</Option>
    <Option>npm run build</Option>
  </Question>
</Quiz>
