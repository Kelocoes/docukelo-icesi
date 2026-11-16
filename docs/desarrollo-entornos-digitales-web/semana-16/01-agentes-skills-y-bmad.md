---
sidebar_position: 1
description: "De las bases al desarrollo guiado por especificaciones: qué es un agente frente a un asistente, qué es una skill y cómo se organiza (SKILL.md, AGENTS.md, .agents/), qué problemas ataca el spec-driven development y cómo aplicar BMAD, fase por fase, a un frontend nuevo con un backend que ya existe."
---

# Agentes, skills y desarrollo guiado por especificaciones con BMAD

Programar con IA ya no es solo pedirle código a un chat. Hoy el trabajo se parece más a **dirigir a un agente**: darle contexto, enseñarle procedimientos y decirle con precisión qué construir. Esta guía recorre ese camino **de abajo hacia arriba**, porque cada herramienta avanzada se apoya en las anteriores: no tiene sentido usar BMAD sin saber qué es una skill, ni escribir especificaciones sin entender qué contexto tiene el agente.

En esta guía cubriremos:

| Parte | Pregunta que responde | Secciones |
| :--- | :--- | :--- |
| **A · Las bases** | ¿Qué es un agente y qué diferencia hay con un asistente? ¿Qué es el contexto, una skill, `AGENTS.md`, un subagente? | 1 a 5 |
| **B · Spec-driven development** | ¿Qué falla al pedirle código a un chat y qué propone el desarrollo guiado por especificaciones? ¿Qué herramientas existen? | 6 a 8 |
| **C · BMAD** | ¿Cómo se usa un equipo de agentes, fase por fase, para construir el frontend de una app cuyo backend ya existe? | 9 a 13 |

```text
Modelo → Asistente → Agente → Contexto → Skills → AGENTS.md → Subagentes → Especificaciones → BMAD
```

:::tip[Cómo leerla]
Si ya trabajas con agentes, puedes saltar a la parte B. Pero la sección 3 (skills) y la 4 (`AGENTS.md` y `.agents/`) son la base de BMAD: si no las tienes claras, vuelve a ellas cuando llegues a la sección 9.
:::

:::note[Las herramientas cambian cada semana]
Los **conceptos** de esta guía son estables; los **nombres de comandos, campos y versiones** no. Cuando algo no se pudo confirmar en una fuente oficial, la guía lo dice. Antes de seguir un comando, verifica la versión de tu herramienta y su documentación.
:::

---
## Parte A · Las bases: de chatear a trabajar con agentes

### 1. De un chat a un agente

#### 1.1. El modelo y el chat

Un **modelo de lenguaje** recibe texto y devuelve texto. Un **chat** es ese modelo dentro de una conversación: tú escribes, él responde. Lo importante es lo que **no** puede hacer por sí solo. La documentación de Claude Code lo resume así: sin herramientas, el modelo «solo puede responder con texto»; con herramientas, «puede actuar: leer tu código, editar archivos, ejecutar comandos, buscar en la web e interactuar con servicios externos».

Eso explica una experiencia que ya conoces: le pides código a un chat, **tú** lo copias, **tú** lo pegas, **tú** lo ejecutas y, si falla, **tú** vuelves a pegar el error.

#### 1.2. Asistente y agente

Estas dos palabras se usan con mucha imprecisión. Anthropic **no publica una definición formal de «asistente»**; lo que sí hace es contraponer el *agentic coding* con «los asistentes de chat, que solo responden con texto que debes aplicar tú mismo». Para esta guía usaremos estas definiciones de trabajo:

- **Asistente:** una IA que **responde y sugiere**. Tú ejecutas y decides cada paso.
- **Agente:** una IA que, con **herramientas**, **decide los pasos, actúa, mira el resultado y repite**, con tu supervisión.

Anthropic, en su guía *Building effective agents*, distingue dos cosas que conviene no mezclar:

- Un **workflow** es un sistema donde modelos y herramientas se orquestan «mediante rutas de código predefinidas»: el programador fija el camino.
- Un **agente** es un sistema donde el modelo «dirige dinámicamente sus propios procesos y el uso de herramientas»: el modelo decide el camino.

Y en Claude Code ese camino tiene tres fases que se repiten: **reunir contexto, actuar y verificar los resultados**. Recorre el mismo encargo («arregla las pruebas que fallan») con un asistente y con un agente:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/asistente-vs-agente/index.html"
  title="El mismo encargo, arreglar las pruebas que fallan, con un asistente de chat y con un agente: quién decide cada paso y el bucle de reunir contexto, actuar y verificar"
  height={660}
/>

| | **Chat / asistente** | **Agente** |
| :--- | :--- | :--- |
| Qué produce | Texto que tú aplicas | Acciones sobre tu proyecto (editar, ejecutar) |
| Quién decide el siguiente paso | Tú | El modelo, con tu supervisión |
| ¿Verifica su trabajo? | No, salvo que tú pegues el resultado | Sí: puede correr las pruebas y leer los errores |
| Riesgo principal | Copiar código incorrecto a ciegas | Cambios reales que no querías |

:::warning[Un agente actúa de verdad]
Como un agente edita archivos y ejecuta comandos, existen **controles**: modos de permiso (preguntar antes de cada acción, aceptar ediciones, planificar primero), la tecla <kbd>Esc</kbd> para interrumpirlo y *checkpoints* para deshacer ediciones de archivos. Los *checkpoints* **no** deshacen acciones fuera de tu computador, como cambios en una base de datos o un despliegue. Además, Anthropic recomienda poner **condiciones de parada** y probar en entornos aislados. Que un agente sea más capaz no quita la necesidad de que **tú revises**.
:::

#### 1.3. Herramientas y arnés

Una **herramienta** es una acción que el modelo puede pedir: leer un archivo, editar código, ejecutar un comando, buscar en la web, lanzar un subagente. Las herramientas son lo que vuelve «agéntico» a un asistente de código. Además existe **MCP** (*Model Context Protocol*), un estándar abierto para conectar la IA con datos y servicios externos.

Claude Code es la capa que rodea al modelo y le da las herramientas y la gestión del contexto; a esa capa se le llama **arnés** (*harness*). Dicho de otra forma: **Claude es el modelo; Claude Code es el arnés** que lo convierte en un agente de código.

### 2. El contexto: lo que el agente sabe ahora mismo

La **ventana de contexto** es la memoria de trabajo de una sesión: guarda el historial de la conversación, el contenido de los archivos que el agente leyó, las salidas de los comandos, tus archivos de instrucciones, las skills cargadas y las instrucciones del sistema. Dos consecuencias que condicionan todo lo que sigue:

1. **Cada sesión nueva empieza con el contexto vacío.** El agente no recuerda la conversación anterior; solo vuelve a tener lo que se carga al iniciar.
2. **El contexto es limitado y todo compite por él.** Un log enorme, diez archivos leídos «por si acaso» o un prompt larguísimo desplazan lo que sí importa.

La idea de fondo: **lo que escribes en un archivo de instrucciones se carga en cada sesión; lo que dejas en una skill se carga solo cuando hace falta.** Esa diferencia es la razón de ser de las skills.

### 3. Skills: conocimiento que se carga cuando hace falta

#### 3.1. Qué es una skill y por qué existe

Según la documentación de Claude Code, las skills «extienden lo que Claude puede hacer»: creas un archivo `SKILL.md` con instrucciones y Claude lo añade a su caja de herramientas; lo usa cuando es relevante o tú lo invocas con `/nombre-de-la-skill`. En la plataforma de Anthropic lo explican por contraste: a diferencia de un *prompt* (instrucciones de una conversación para una tarea puntual), una skill **se carga bajo demanda**, así que no repites la misma guía en cada conversación.

Anthropic da una regla práctica para saber cuándo crear una: cuando pegas **por tercera vez** el mismo procedimiento de varios pasos en el chat, es momento de convertirlo en una skill.

#### 3.2. Anatomía de una skill

Una skill es **una carpeta**. Solo hay un archivo obligatorio, `SKILL.md`; el resto es opcional y sirve para que el agente lea (o ejecute) cosas **solo si las necesita**. Haz clic en cada archivo:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/anatomia-de-una-skill/index.html"
  title="Árbol de archivos de una skill de ejemplo: SKILL.md obligatorio, y las carpetas opcionales scripts, references y assets, con qué se carga en cada nivel"
  height={980}
/>

El `SKILL.md` más pequeño que funciona:

```markdown title="revisando-informes/SKILL.md" showLineNumbers
---
name: revisando-informes
description: Revisa informes académicos en Markdown contra la rúbrica del curso y lista correcciones de estructura y citas. Úsala cuando el usuario pida revisar, corregir o evaluar un informe o documento de entrega.
---

# Revisión de informes

1. Lee el documento completo.
2. Compáralo con los criterios de [references/rubrica.md](references/rubrica.md).
3. Devuelve una lista de problemas ordenada por gravedad, con la línea de cada uno.
4. No reescribas el texto; solo señala y propón.
```

Las partes del encabezado (el *frontmatter*), según el estándar abierto de skills:

| Campo | ¿Obligatorio? | Qué debe cumplir |
| :--- | :--- | :--- |
| `name` | Sí | De 1 a 64 caracteres: minúsculas, dígitos y guiones; igual al nombre de la carpeta. |
| `description` | Sí | De 1 a 1024 caracteres: **qué hace y cuándo usarla**. Es lo que el agente lee para decidir. |
| `license`, `compatibility`, `metadata` | No | Licencia, requisitos del entorno y datos extra. |
| `allowed-tools` | No (experimental) | Herramientas **preaprobadas** mientras la skill está activa. |

Claude Code añade campos propios (por ejemplo `disable-model-invocation`, `user-invocable`, `argument-hint`, `context`, `paths`). Tres detalles que conviene saber:

- En Claude Code **todos los campos son opcionales** (solo se recomienda la `description`), y **un campo mal escrito se ignora sin avisar**.
- `allowed-tools` **no restringe**: todas las herramientas siguen disponibles y tus permisos siguen mandando; solo evita que te pregunten por las que listas.
- `disable-model-invocation: true` impide que el agente cargue la skill por su cuenta (y saca su descripción del contexto): útil para skills con efectos, como un `deploy`.

:::tip[Buenas prácticas de Anthropic para escribirlas]
Mantén `SKILL.md` **bajo 500 líneas**; deja las referencias **a un solo nivel** de profundidad (un archivo enlazado desde `SKILL.md`, no uno enlazado desde otro enlazado); escribe la descripción en **tercera persona**, diciendo qué hace y cuándo usarla; y evita nombres vagos como `helper` o `utils`.
:::

#### 3.3. Cómo se carga: divulgación progresiva

Si el agente leyera todas tus skills completas al iniciar, el contexto se llenaría antes de empezar. Por eso se cargan **por niveles**:

| Nivel | Cuándo se carga | Costo aproximado | Qué contiene |
| :--- | :--- | :--- | :--- |
| 1. Metadatos | **Siempre**, al iniciar | ~100 tokens por skill | `name` y `description` |
| 2. Instrucciones | Cuando la skill **se activa** | menos de 5 000 tokens | El cuerpo de `SKILL.md` |
| 3. Recursos | **Según se necesiten** | 0 hasta que se leen | Los archivos de apoyo; un script **se ejecuta** y solo su salida entra al contexto |

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/carga-progresiva-skills/index.html"
  title="Carga progresiva de una skill en tres niveles: nombre y descripción siempre, el cuerpo de SKILL.md al activarse y los archivos de apoyo solo si hacen falta, con un contador de contexto aproximado"
  height={680}
/>

Una vez invocada, el contenido de la skill **se queda en el contexto** en los turnos siguientes; por eso el cuerpo debe estar escrito como instrucciones permanentes y concisas.

#### 3.4. Dónde viven y cómo se usan

| Ubicación | Ruta | Alcance |
| :--- | :--- | :--- |
| Personal | `~/.claude/skills/<nombre>/SKILL.md` | Todos tus proyectos |
| Proyecto | `.claude/skills/<nombre>/SKILL.md` | Ese repositorio; se versiona con Git y la recibe el equipo |
| Plugin | `<plugin>/skills/<nombre>/SKILL.md` | Donde el plugin esté activo (`/plugin:skill`) |

Hay **dos formas de usarlas**, y por defecto valen las dos:

1. **Automática:** el agente compara tu tarea con las descripciones y decide cargar una skill.
2. **Manual:** la invocas tú con `/nombre`. Es lo más seguro cuando importa que se use *esa* skill.

Un detalle práctico: las skills de claude.ai, las de la API y las de Claude Code son **independientes**; no se sincronizan entre sí. Y los antiguos comandos personalizados (`.claude/commands/`) siguen funcionando, pero Anthropic recomienda skills como su reemplazo.

#### 3.5. Chatear frente a usar una skill

El mismo encargo, con y sin skill. Cambia la descripción de la skill a «vaga» y observa qué pasa:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/chat-vs-skill/index.html"
  title="El mismo pedido con y sin skill en dos sesiones, y qué pasa cuando la descripción de la skill es clara o vaga"
  height={660}
/>

#### 3.6. Ventajas y desventajas

**Ventajas**

- **Reutilización:** se escribe una vez y se usa en todas las conversaciones.
- **Contexto bajo demanda:** solo cuesta ~100 tokens por skill hasta que se activa; los archivos de apoyo no cuestan nada hasta que se leen.
- **Más fiabilidad con scripts:** un script ejecutado da el mismo resultado cada vez, y gasta menos que pedirle al modelo que genere el código.
- **Versionado y trabajo en equipo:** una skill de proyecto vive en el repositorio; «súbela y tu equipo la recibe».
- **Consistencia:** un procedimiento fijo en lugar de reexplicarlo y obtener resultados distintos.

**Desventajas y riesgos**

- **Una mala descripción arruina la skill:** si es vaga o se solapa con otra, el agente puede cargar la equivocada o no cargar la correcta.
- **Costo de contexto:** todas las descripciones se cargan en cada petición; con muchas skills, crece. Una skill ya cargada compite con el historial.
- **No es determinista:** el modelo **interpreta** las instrucciones; el resultado puede variar.
- **Mantenimiento:** el contenido envejece, hay referencias que se rompen y conviene probarla con casos reales.
- **Seguridad:** una skill puede traer scripts y órdenes que el agente ejecuta con tus permisos.

:::danger[Usa skills solo de fuentes de confianza]
Anthropic lo dice sin rodeos: usa skills **que tú creaste u obtuviste de Anthropic**. Una skill maliciosa puede indicarle al agente que llame herramientas o ejecute código de formas que no corresponden a su propósito, con riesgo de sacar datos. Antes de usar una de terceros, **lee** su `SKILL.md`, sus scripts y cualquier llamada de red.
:::

#### 3.7. Skills frente a otras piezas

Las skills no son la única forma de darle contexto o capacidades a un agente. Una guía rápida de cuándo usar cada una:

| Mecanismo | Qué es | Cuándo se carga | Úsalo para |
| :--- | :--- | :--- | :--- |
| `CLAUDE.md` / `AGENTS.md` | Instrucciones persistentes | En **cada** sesión, completo | Convenciones y comandos: «siempre haz X» |
| **Skill** | Conocimiento y procedimientos | La descripción siempre; el cuerpo al usarla | Material de referencia y tareas repetibles |
| **Subagente** | Trabajador con contexto aislado | Al lanzarse | Aislar contexto, paralelizar, especializar |
| **Hook** | Acción automática en un evento | Al ocurrir el evento | Lo que **debe** pasar siempre (lint, bloquear un comando) |
| **MCP** | Conexión a servicios externos | Las herramientas, al iniciar | Datos y acciones de afuera (base de datos, navegador) |
| **Plugin** | Paquete de skills, hooks, subagentes y MCP | Según sus partes | Compartir una configuración completa |

:::note[Una instrucción es una petición, no una garantía]
Una línea como «nunca edites `.env`» en `CLAUDE.md` o en una skill es una **petición**, no una garantía: el modelo la trata como contexto. Si una regla debe cumplirse **siempre**, no la dejes en una instrucción: conviértela en un **hook** o en un permiso.
:::

### 4. AGENTS.md y la carpeta `.agents/`

#### 4.1. AGENTS.md: un README para agentes

`README.md` está escrito **para personas**: qué es el proyecto y cómo instalarlo. **`AGENTS.md`** está escrito **para agentes de código**: comandos de compilación y prueba, convenciones y trampas del repositorio. Es un **formato abierto**, hoy bajo la Agentic AI Foundation (Linux Foundation), sin campos obligatorios: es Markdown corriente.

```markdown title="AGENTS.md" showLineNumbers
# AGENTS.md

## Comandos
- Instalar: `npm install`
- Servidor local: `npm start`
- Pruebas: `npm test`

## Convenciones
- Documentos en español, código y nombres de archivo en inglés.
- No editar la carpeta `build/`.

## Antes de terminar
- Ejecuta `npm test` y confirma que pasa.
```

Claude Code tiene su propio archivo, **`CLAUDE.md`**. La regla vigente: Claude Code lee `AGENTS.md` **si no existe `CLAUDE.md`**; si existen los dos, lee solo `CLAUDE.md`. Para tener una sola fuente se escribe un `CLAUDE.md` que **importa** el otro:

```markdown title="CLAUDE.md" showLineNumbers
@AGENTS.md

## Claude Code
Usa el modo plan para cambios en `src/billing/`.
```

#### 4.2. La carpeta `.agents/`: ¿estándar o convención?

Aquí hay una trampa frecuente. `AGENTS.md` (el **archivo**) es un estándar. La **carpeta** `.agents/` **no forma parte de ese estándar**: es una **convención** que se está difundiendo para guardar skills y memoria del proyecto. Y la documentación de Claude Code es explícita: **no lee nada que esté dentro de `.agents/`**, ni descubre skills en `.agents/skills/` (las suyas son `.claude/skills/` y `~/.claude/skills/`).

¿Entonces para qué sirve? Una skill guardada en `.agents/skills/` le sirve a Claude Code solo si **(a)** `AGENTS.md` o `CLAUDE.md` la **enlaza** y el agente decide abrirla, o **(b)** la copias o enlazas a `.claude/skills/`. Explora las tres combinaciones de archivos y mira qué lee cada herramienta:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/agents-md-y-agents/index.html"
  title="Árbol de un proyecto con AGENTS.md, CLAUDE.md, .claude y .agents, y qué archivos lee Claude Code según las combinaciones de archivos de instrucciones"
  height={720}
/>

Este mismo proyecto de documentación usa justamente esa estrategia: su `AGENTS.md` es un **índice** con enlaces a la memoria del proyecto (`.agents/memory/`) y a cada skill (`.agents/skills/`), con una línea de «cuándo usarla». No hay `CLAUDE.md`, así que Claude Code lee `AGENTS.md` directamente y **sigue los enlaces cuando hace falta**.

| Elemento | Estatus |
| :--- | :--- |
| `AGENTS.md` en la raíz | Formato abierto |
| `SKILL.md` con `name` y `description`, y las subcarpetas `scripts/`, `references/`, `assets/` | Especificación abierta de skills |
| `.agents/skills/` | Convención emergente (no la lee Claude Code por sí sola) |
| `.agents/memory/`, `.agents/spec/` | Convención propia de este proyecto |
| `AGENTS.md` como índice con enlaces | Patrón del proyecto: funciona porque el agente sigue los enlaces |

:::note[Otras herramientas]
Otras herramientas de programación con IA también leen `AGENTS.md`, pero **cada una decide los detalles** (qué archivo gana, si lee carpetas anidadas). Verifica en la documentación de la herramienta que uses antes de asumir el mismo comportamiento.
:::

### 5. Subagentes: repartir el trabajo sin llenar el contexto

Un **subagente** es un asistente especializado que corre en **su propia ventana de contexto**, con sus instrucciones y permisos, hace una tarea que se le delega y **devuelve solo un resumen** a la conversación principal. Anthropic recomienda usarlo cuando una tarea lateral inundaría la conversación con resultados de búsqueda, registros o archivos que no volverás a mirar.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/orquestador-y-subagentes/index.html"
  title="Un orquestador reparte tareas a tres subagentes con su propio contexto, que devuelven solo un resumen, y qué pasa sin subagentes"
  height={560}
/>

Se definen como un archivo Markdown con *frontmatter* en `.claude/agents/` (del proyecto) o `~/.claude/agents/` (personales). Solo `name` y `description` son obligatorios:

```markdown title=".claude/agents/code-reviewer.md" showLineNumbers
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

Lo que debes saber de ellos:

- **No ven tu historial:** reciben solo la tarea que les delegas; por eso la tarea debe explicarse completa.
- **Sirven para paralelizar:** varios subagentes pueden trabajar a la vez en tareas **independientes**.
- **Se combinan con skills:** una skill con `context: fork` se ejecuta en un subagente, y un subagente puede precargar skills.
- **Por defecto pueden crear otros subagentes**, hasta tres niveles bajo la conversación principal (se puede limitar).
- **No son gratis:** coordinar cuesta, y repartir tareas que dependen unas de otras no acelera nada.

Con estas bases (agente, contexto, skills, archivos de instrucciones y subagentes) ya puedes entender **por qué** existen las metodologías que siguen: son formas de **organizar el trabajo de un agente** para que produzca resultados predecibles.

## Parte B · Spec-driven development: dirigir al agente con especificaciones

Ya sabes qué es un agente, qué contexto tiene y cómo se le enseñan procedimientos con skills. Falta la pregunta de fondo: **¿cómo le decimos qué construir?** Hasta ahora lo habitual es escribir un mensaje en el chat. Esta parte explica por qué eso se queda corto y qué propone el *spec-driven development* (SDD).

### 6. Qué falla antes de las especificaciones

Los problemas aparecen en dos momentos distintos:

**En el desarrollo tradicional**, la fuente de verdad es el código. La documentación y los requisitos se escriben al principio, el proyecto cambia, y **la especificación se queda atrás**. Los autores de GitHub Spec Kit lo dicen así: la brecha entre especificación e implementación «ha afectado al desarrollo de software desde sus inicios», y los requisitos hoy cambian «mucho más rápido que nunca».

**Con IA y sin método** (el llamado *vibe coding*), el problema es otro: le describes un objetivo vago y recibes código que **«parece correcto pero a menudo falla»**. GitHub lo explica sin culpar al modelo: son excelentes completando patrones, pero no leyendo mentes; el problema es nuestro enfoque, no su capacidad. El vibe coding sirve para **prototipos**; es menos fiable para aplicaciones serias o código que ya existe.

Hay varias causas concretas:

- **Se rellenan los vacíos con lo que «suena bien»:** si no dijiste cómo se organiza la app, el agente inventa una organización.
- **Alucinaciones de paquetes:** un estudio presentado en USENIX Security 2025 (576 000 muestras de código, 16 modelos) halló que **al menos el 5,2 %** de los paquetes que sugieren los modelos comerciales y el **21,7 %** de los de código abierto no existen. Ojo: mide *paquetes*, no métodos de una API.
- **Falta de contexto persistente:** cada sesión empieza vacía (sección 2), y Anthropic explica que el contexto es un recurso finito: conviene que el agente guarde notas **fuera** de la ventana para recuperarlas después.

Compara el mismo encargo («agregar el filtro por nivel a la lista de rutinas») con y sin especificación:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/tradicional-vs-spec/index.html"
  title="El mismo encargo sin especificación y con especificación: dónde queda la verdad, en el chat o en Markdown versionado"
  height={660}
/>

:::warning[Evidencia: lo que sí y lo que no sabemos]
Lo anterior son **motivaciones**, no pruebas de que SDD funcione mejor. Hasta hoy **no hay estudios controlados** que midan que desarrollar con especificaciones mejore los resultados; lo que existe son experiencias de equipos, anuncios de los proveedores de las herramientas y opinión. Úsalo como una hipótesis razonable que tú vas a poner a prueba en tu proyecto.
:::

### 7. Qué propone el spec-driven development

La frase que resume la propuesta, tomada del blog de GitHub: pasar de «el código es la fuente de verdad» a **«la intención es la fuente de verdad»**. En vez de empezar escribiendo código, **primero se escribe una especificación** y de ella se derivan el plan, las tareas y el código.

#### 7.1. Qué es (y qué no es) una *spec*

Birgitta Böckeler, de Thoughtworks, describe una spec como **«un artefacto estructurado y orientado al comportamiento»**, escrito en lenguaje natural como guía para los agentes. Tres matices importantes:

- **No es un *prompt* largo.** El propio artículo advierte que «spec» se usa a veces como sinónimo de «prompt detallado», y no lo es: una spec se guarda, se revisa y se versiona.
- **No es un *memory bank*.** Los archivos de contexto general (como `AGENTS.md`) aplican a **todas** las sesiones; una spec aplica a **una funcionalidad concreta**.
- **Vive en el repositorio.** Son archivos Markdown: el humano la dirige y la revisa; el agente suele redactarla a partir de lo que tú le describes.

Contenido típico: historias de usuario y **criterios de aceptación** (qué debe cumplirse), un diseño técnico (cómo se hará) y una lista de **tareas** trazables a los criterios.

#### 7.2. Tres niveles: qué pasa con la spec después

No todas las propuestas tratan la spec igual. Böckeler distingue tres niveles (el artículo está publicado en el sitio de Martin Fowler, pero la autora es ella):

| Nivel | Qué dice el artículo | Qué significa |
| :--- | :--- | :--- |
| **Spec-first** | Se escribe primero una spec bien pensada y se usa para la tarea en curso. | La spec guía la tarea; después puede quedar obsoleta. |
| **Spec-anchored** | La spec se conserva incluso después de terminar la tarea. | La spec se mantiene y se actualiza con cada cambio. |
| **Spec-as-source** | La spec es el archivo fuente principal; el humano solo edita la spec y nunca toca el código. | El código se genera a partir de la spec. |

Todas las herramientas que ella analizó son **spec-first**.

#### 7.3. Lo que ya conoces

Si cursaste el Seminario de Software, ya viste una versión «artesanal» del SDD: un `AGENTS.md` como *constitución*, una carpeta `.agents/` con memoria, especificaciones, planes y tareas, y una regla práctica: **una sola tarea por iteración** y «la verdad vive en Markdown, no en el chat» ([guía de la semana 14 del Seminario](../../seminario-de-i-d-i/semana-14/01-spec-driven-development.md)). Es SDD *spec-first* con memoria persistente. Lo que sigue es el panorama de herramientas que automatizan o estructuran ese mismo camino.

### 8. El panorama de propuestas

Cinco formas de aplicar SDD (y la artesanal) conviven hoy:

| Propuesta | Enfoque | Archivos principales | Peso del proceso | Mejor para |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub Spec Kit** | Comandos en el agente, fases con puertas y una *constitución* | `spec.md`, `plan.md`, `tasks.md`, listas de verificación | Alto | Funcionalidades medianas o grandes, equipos |
| **OpenSpec** | Specs vivas y cambios por *delta*: proponer, aplicar, archivar | `openspec/specs/`, `openspec/changes/<cambio>/` | Bajo a medio | Código existente, cambios incrementales |
| **Kiro** | IDE y CLI propio: requisitos, diseño y tareas | `requirements.md`, `design.md`, `tasks.md` | Medio | Quien quiere un flujo guiado en un IDE |
| **BMAD** | Un equipo ágil de agentes, de la idea al código | PRD, arquitectura, UX, épicas e historias | Alto (escala hacia abajo) | Proyectos con una idea difusa |
| **SDD artesanal** | Las mismas fases en Markdown propio | `AGENTS.md` y `.agents/…` | Bajo a medio | Enseñanza y proyectos pequeños |

:::note[«Peso» y «curva» son nuestra valoración]
Las columnas de peso del proceso y de curva de aprendizaje son una **valoración**, basada en las descripciones de las propias herramientas y en el análisis de Böckeler, no una medición.
:::

:::warning[Los comandos cambian cada semana]
Spec Kit y OpenSpec publicaron versiones nuevas esta misma semana, y **cambiaron los nombres de sus comandos** (por ejemplo, OpenSpec 2.0 retiró los comandos `/opsx:*` y pasó a skills `/openspec-*`; la documentación de Spec Kit hoy escribe `/speckit-…` con guion donde material anterior usa punto). Antes de seguir una guía, **comprueba la versión** de tu herramienta con `--version` y la documentación oficial. Los *conceptos* de esta parte son estables; los comandos, no.
:::

#### 8.1. Críticas honestas

SDD no es una receta mágica. Böckeler, probando tres herramientas, encontró:

- **Desajuste con el tamaño de la tarea:** una herramienta convirtió un bug pequeño en 4 historias y 16 criterios de aceptación («una almádena para romper una nuez»); para una funcionalidad pequeña, programar con asistencia de IA «a secas» habría dado más control.
- **Carga de revisión:** «para ser honesta, prefiero revisar código que todos estos archivos Markdown».
- **Falsa sensación de control:** el agente ignoró notas, creó duplicados y aplicó en exceso las reglas de la constitución.
- **Specs que se desactualizan:** si nadie las actualiza cuando cambia el código, vuelven a quedarse atrás, que era justo el problema original.

**Cuándo no conviene:** cambios pequeños y bien entendidos, prototipos y exploración, y trabajos donde el requisito solo se descubre probando. En esos casos, pedirle el cambio directamente al agente es más sensato.

Con esto ya tienes el criterio para elegir. En la parte C vamos a profundizar en **una** de estas propuestas, BMAD, porque cubre el camino completo desde la idea hasta las historias listas para programar.

## Parte C · BMAD: un equipo ágil de agentes

### 9. Qué es BMAD y qué lo compone

**BMAD** (*Breakthrough Method for Agile AI-Driven Development*) es un marco que **simula un equipo ágil con agentes de IA**: hay un agente que investiga, uno que escribe el PRD, uno que diseña la experiencia, uno que decide la arquitectura y uno que programa y revisa. A diferencia de otras propuestas del panorama, que parten de «una funcionalidad» (spec → plan → tareas), BMAD cubre el proceso **desde la idea** hasta el código revisado, y adapta cuánto proceso aplica al **tamaño del trabajo**. Es de código abierto (licencia MIT).

Y aquí se cierra el círculo con la parte A: **BMAD está hecho de skills**. Cada agente y cada flujo es una skill que se instala en `.claude/skills/` (con su `SKILL.md`) y se invoca con una barra, como `/bmad-build`. Todo lo que aprendiste sobre carga progresiva, descripciones, `AGENTS.md` y subagentes aplica aquí tal cual.

#### 9.1. Dos versiones, y cuál usaremos

| | **v6.12.4 (estable)** | **V7 (alfa)** |
| :--- | :--- | :--- |
| Instalación | `npx bmad-method install` | `npx skills add …` y luego pedir al skill `bmad` que ejecute `bmad setup` |
| ¿Se puede fijar la versión? | **Sí**: `npx bmad-method@6.12.4 install` | **No todavía**: no hay etiqueta ni paquete publicado |
| Agentes | 5: Mary, John, Winston, Amelia, Sally | 6: se suma Sofia (Product Owner) |
| Épicas e historias | `epics.md` y `sprint-status.yaml` | Un árbol de tickets que mantiene Sofia |
| Estado | Congelada, solo correcciones | «Preview alpha»: «espera cambios que rompen compatibilidad entre actualizaciones» |

En esta guía trabajamos con **v6.12.4**, porque es la única que puedes **fijar** y todos los estudiantes verán lo mismo. Los conceptos (roles, documento como contrato, tamaño del proceso) son comunes a las dos.

:::warning[La web oficial ya muestra V7]
El sitio de documentación de BMAD (docs.bmad-method.org) se publica desde la rama de desarrollo y **describe V7**, no v6.12: allí verás a Sofia, el skill `bmad` y `npx skills`. Si lo que instalaste con `npx bmad-method install` no coincide con lo que lees, es por eso. La documentación de v6.12 está en la rama `V6.12` del repositorio. Y el propio README avisa que V7 era una estimación «para mediados de noviembre de 2026»: revisa si ya salió antes de decidir qué versión instalar.
:::

#### 9.2. Los agentes (los roles del equipo)

| Agente | Skill | Rol | Cuándo lo llamas |
| :--- | :--- | :--- | :--- |
| **Mary** | `bmad-agent-analyst` | Analista de negocio | Idea sin validar, investigación, escribir el *brief* |
| **John** | `bmad-agent-pm` | Gerente de producto | Escribir el PRD y las épicas e historias |
| **Sally** | `bmad-agent-ux-designer` | Diseño de UX | Cuando la interfaz importa |
| **Winston** | `bmad-agent-architect` | Arquitecto de sistemas | Decisiones que varias partes del código deben respetar |
| **Amelia** | `bmad-agent-dev` | Ingeniera de software | Implementar, probar, revisar y cerrar épicas |

Además hay skills que no son personas, sino **flujos**: `bmad-build` (un cambio de una sesión), `bmad-code-review`, `bmad-deep-recon` (investigación con citas), `bmad-project-context`, `bmad-party-mode` (conversación entre varios agentes) y `bmad-help`, que **te dice qué sigue** mirando los documentos que ya existen. Cuando no sepas qué hacer, empieza por ahí.

#### 9.3. Las fases y sus documentos

BMAD organiza el trabajo en cuatro fases. Cada una termina con **un documento que el siguiente rol toma como contrato**. Explora quién hace qué, y cómo cambia la ruta según el tamaño del trabajo:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/fases-bmad/index.html"
  title="Las cuatro fases de BMAD con su agente y su documento, y qué fases se usan según el tamaño del trabajo"
  height={610}
/>

| Fase | Quién | Skill | Documento |
| :--- | :--- | :--- | :--- |
| **1 · Analysis** | Mary | `bmad-brainstorming`, `bmad-deep-recon`, `bmad-product-brief` (o `bmad-prfaq`) | Sesión de brainstorming, `research.md`, `brief.md` |
| **2 · Planning** | John y Sally | `bmad-prd`, `bmad-ux` | `prd.md`, `DESIGN.md` y `EXPERIENCE.md` |
| **3 · Solutioning** | Winston y John | `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning` | `ARCHITECTURE-SPINE.md`, `epics.md`, `sprint-status.yaml` |
| **4 · Implementation** | Amelia | `bmad-build`, `bmad-code-review`, `bmad-retrospective` | Código, hallazgos de revisión, retrospectiva |

:::note[Los nombres de las fases no son uniformes]
En la propia documentación conviven tres vocabularios: las cuatro fases clásicas de arriba (*Analysis, Planning, Solutioning, Implementation*), nombres de carpeta internos distintos en el archivo de ayuda de v6.12, y el ciclo de V7 (*Clarify, Plan, Build and verify, Learn and adjust*). En esta guía usamos el clásico de cuatro fases.
:::

#### 9.4. No todo trabajo necesita todas las fases

BMAD no pide la ruta completa siempre. La regla del método es que **el tamaño del proceso sigue a la intención**:

| Trabajo | Ruta |
| :--- | :--- |
| Una edición obvia y de bajo riesgo | Pídesela directamente al agente; BMAD no hace falta |
| Un cambio que cabe en una sesión (unas 500 líneas, «un puñado de archivos») | `/bmad-build <descripción del cambio>` |
| Una idea clara, mayor que una sesión | `bmad-spec` y su «Story Breakdown» |
| Un producto nuevo, con varias épicas (la doc habla de «unas 20 sesiones o más») | La ruta completa: brief → PRD → UX → arquitectura → épicas e historias → construir por historia |
| Una idea vaga, o dudas de si vale la pena | Primero aclarar: brainstorming, `bmad-forge-idea`, `bmad-deep-recon` |

Hay señales que suben un trabajo pequeño de nivel: riesgo alto, requisitos poco claros, alcance arquitectónico amplio o coordinación entre varias personas. Y un dato histórico que verás en blogs antiguos: el «Quick Flow» **ya no existe** con ese nombre; hoy es `bmad-build`.

### 10. Instalar BMAD y entender sus carpetas

#### 10.1. Instalación

Necesitas **Node.js 20.12 o superior**, **Python 3.10 o superior** y **`uv`** (los skills ejecutan scripts de Python con `uv run`). Desde la carpeta de tu proyecto:

```bash title="Instalar BMAD v6.12.4 en Claude Code"
npx bmad-method@6.12.4 install --directory . --modules bmm --tools claude-code --yes
```

Sin las opciones, el instalador te hace preguntas (entre ellas tu nivel de experiencia, que cambia cuánto explican los agentes). `npx bmad-method install --list-tools` muestra las herramientas soportadas; Claude Code, Codex, Cursor y GitHub Copilot son las preferidas. Después abre `claude` y prueba:

```text
/bmad-help I have a frontend idea and the backend already exists. Where do I start?
```

:::danger[BMAD son skills de un tercero: aplica lo de la parte A]
Instalar BMAD es instalar **skills con scripts** que se ejecutan en tu computador. El propio instalador de skills muestra evaluaciones de riesgo y algunos skills de BMAD reciben alertas de riesgo medio o alto, porque ejecutan scripts y leen texto de terceros (tickets, diffs), que los escáneres tratan como riesgo de inyección de prompt. Antes de instalar: fija la versión, **lee** lo que se va a instalar y no lo hagas en una carpeta con credenciales. El agente también te pedirá permiso la primera vez que ejecute un comando: léelos antes de aceptar.
:::

#### 10.2. Qué carpetas aparecen

Mira cómo crece un proyecto con cada fase y qué tipo de archivo es cada cosa:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/carpetas-bmad/index.html"
  title="Carpetas que crea BMAD v6.12.4 y cómo se llena la carpeta de artefactos con cada fase, distinguiendo configuración, soporte generado y documentos del producto"
  height={1080}
/>

Lo esencial:

- **`.claude/skills/`**: las skills de BMAD (una carpeta por skill). Es lo que viste en la parte A.
- **`_bmad/`**: **configuración y soporte**, no son documentos de tu producto. `config.toml` guarda las respuestas de la instalación; `custom/` guarda **tus sobrescrituras** (`<skill>.toml` para el equipo y `<skill>.user.toml` para ti); `scripts/` y `render/` los genera la herramienta.
- **`_bmad-output/`**: los **artefactos del producto**: el brief, el PRD, el UX, la arquitectura, las épicas. Los crean los skills al escribir; no existen hasta que los pides.
- **`AGENTS.md`**: `bmad-project-context` escribe aquí un bloque pequeño y verificado (comandos, convenciones, errores conocidos). Es el mismo `AGENTS.md` de la sección 4.

| Qué es | Dónde | ¿Se versiona en Git? |
| :--- | :--- | :--- |
| Artefactos del producto | `_bmad-output/**` | **Sí** (la documentación sugiere incluso que sea su propio repositorio) |
| Configuración del equipo | `_bmad/config.toml`, `_bmad/custom/*.toml` | Sí |
| Configuración personal | `*.user.toml` | **No** (el instalador crea un `.gitignore` para ellos) |
| Soporte generado | `_bmad/scripts/`, `_bmad/render/`, `.claude/skills/` | Se regenera al actualizar |
| Instrucciones para agentes | `AGENTS.md` | Sí |

### 11. Un proyecto vacío con un backend que ya existe

Pongamos el caso de la app de **ejercicios y rutinas**: el backend (NestJS) ya existe y se puede consumir; el frontend en Next.js empieza en una **carpeta vacía**. Es un proyecto **nuevo para el frontend**, con un **contrato que viene de fuera**: el backend es una restricción, no código que debas modificar.

:::note[BMAD no trae este escenario]
La documentación oficial de BMAD **no tiene un escenario titulado así** ni habla de OpenAPI o Swagger. Lo que sigue combina lo que la documentación sí respalda con **recomendaciones de esta guía**, que están marcadas.
:::

#### 11.1. Primero, el contexto del backend

Un agente no puede respetar un backend que no conoce: si no se lo cuentas, **inventará endpoints**. BMAD documenta varios mecanismos para darle contexto; cuál usar depende de qué tengas a mano:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/contexto-del-backend/index.html"
  title="Tres formas de darle a BMAD el contexto de un backend que ya existe y qué skills lo leen"
  height={620}
/>

Lo que conviene escribir (**recomendación de la guía**, BMAD no lo genera) es un documento corto `docs/backend-api.md` con: URL base y cómo se configura (`NEXT_PUBLIC_API_URL`), autenticación (cómo se inicia sesión y qué se envía en cada petición), una lista de endpoints con método, ruta y ejemplo de respuesta, y el formato de los errores. Si el backend ya expone Swagger/OpenAPI, guárdalo en el repositorio y enlázalo: esa es la fuente de verdad.

:::tip[No describas lo que el agente ya puede leer]
La documentación de BMAD advierte que darle al agente descripciones en texto de cosas que **ya puede leer en el código** crea «contradicción, ambigüedad e hinchazón de la ventana de contexto». Si el repositorio del backend está al alcance, mejor que lo lea (con `bmad-deep-recon`) a que tú lo resumas.
:::

#### 11.2. El mapa: qué skill usar en cada fase

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/mapa-fases-skills/index.html"
  title="Qué skill de BMAD usar en cada fase de un frontend nuevo con backend existente, con el comando, lo que le das, el documento que sale y qué revisar"
  height={800}
/>

| Paso | ¿Obligatorio? | Skill | Lo que sale |
| :--- | :--- | :--- | :--- |
| Contexto de agentes | Recomendado | `bmad-project-context` | Bloque en `AGENTS.md` |
| Idea y alcance | Opcional | `bmad-product-brief` (Mary) | `brief.md` |
| Requisitos | **Sí** en v6.12 | `bmad-prd` (John) | `prd.md` |
| UX | Recomendado: la interfaz es lo principal | `bmad-ux` (Sally) | `DESIGN.md`, `EXPERIENCE.md` |
| Arquitectura | Recomendado: varias épicas compartirán cliente de API, autenticación y errores | `bmad-architecture` (Winston) | `ARCHITECTURE-SPINE.md` |
| Historias | **Sí** | `bmad-create-epics-and-stories` y `bmad-sprint-planning` (John) | `epics.md`, `sprint-status.yaml` |
| Construcción | **Sí** | `bmad-build` (Amelia) | Código y registro de implementación |
| Revisión y cierre | Recomendado | `bmad-code-review`, `bmad-retrospective` | Hallazgos y retrospectiva |

#### 11.3. El recorrido, paso a paso

La pieza de la sección 10.2 muestra cómo la carpeta se llena de documentos con cada fase. Estas son las fases del recorrido, y la **ruta corta** (un solo `/bmad-build`) salta directo del contexto al código.

Veamos qué hace cada fase y, sobre todo, **qué te toca revisar a ti**.

**Brief (opcional).** Mary te entrevista sobre la idea: qué problema resuelve, para quién y qué queda fuera. Para un frontend sobre un backend que ya existe, muchas veces basta con unas líneas; si decides tú solo qué se construye, puedes saltarla.

**PRD.** John escribe los **requisitos del frontend**: qué puede hacer cada tipo de usuario y qué debe ocurrir. Es la fase donde conviene **citar qué endpoint del backend sostiene cada requisito**, para que ningún requisito dependa de algo que la API no ofrece.

**UX.** Sally produce dos documentos con roles distintos: `DESIGN.md` (**cómo se ve**: la guía visual) y `EXPERIENCE.md` (**cómo funciona**: flujos, pantallas y estados vacío, de carga y de error). BMAD documenta el diseño **en texto**; no es una herramienta de maquetación. Si necesitas *mockups* visuales, hazlos con tu herramienta de diseño y **enlázalos como referencia** en el UX (recomendación de la guía).

**Arquitectura.** Winston escribe el *spine* (la «columna vertebral»): **solo las decisiones que podrían divergir entre partes construidas por separado**. Para un frontend de Next.js, los temas que conviene dejar fijos son: la versión y el *starter*, la estructura de carpetas, dónde se llama al backend (componentes de servidor o de cliente), cómo se guarda el token o la sesión, el formato de errores, el cliente de API tipado y las variables de entorno. La lista concreta es una **recomendación de la guía**; BMAD solo promete fijar las decisiones que cruzan épicas. Como la API ya está decidida, el spine debe **registrarla como restricción** y no volver a discutirla.

**Épicas, historias y tareas.** John corta los requisitos en **épicas** y **historias** con **criterios de aceptación** (`epics.md`), y `bmad-sprint-planning` produce un veredicto (PASS, CONCERNS o FAIL) y `sprint-status.yaml`. Una historia es la unidad de trabajo para el agente: debe caber en **una sesión** de construcción.

**Construir.** `/bmad-build` toma una historia (o una descripción), aclara la intención, planifica, implementa, revisa y hace *commit*. Las **primeras historias fijan el patrón** del proyecto (estructura inicial, cliente de API, autenticación): conviene hacerlas **con atención humana** antes de repetir el patrón con rapidez.

**Revisar y cerrar.** `bmad-code-review` revisa con varios revisores independientes y clasifica los hallazgos; al terminar una épica, `bmad-retrospective` la juzga frente a la evidencia. En V7 hay una regla que vale en cualquier versión: **solo una persona marca una historia como hecha**.

#### 11.4. Qué revisas tú en cada fase

| Fase | Pregunta que debes hacerle al documento |
| :--- | :--- |
| Brief | ¿Describe el problema y el alcance que tú tienes en mente, o lo que «suena bien»? |
| PRD | ¿Cada requisito está respaldado por un endpoint real? ¿Qué quedó explícitamente fuera? |
| UX | ¿Están los estados de carga, vacío y error de cada pantalla? |
| Arquitectura | ¿Las decisiones coinciden con lo que ya hace el backend? ¿Hay alguna que contradiga el curso? |
| Historias | ¿Cada una cabe en una sesión y tiene criterios que puedas verificar? |
| Construir | ¿El código sigue el patrón del spine? ¿Pasan las pruebas? |

:::tip[Busca las suposiciones]
BMAD marca en los documentos lo que **rellenó sin preguntar** con etiquetas `[ASSUMPTION]`, y deja preguntas abiertas como `Open question:`. El método espera que **las leas**: son los puntos donde el agente decidió por ti.
:::

### 12. Buenas prácticas, límites y errores frecuentes

#### 12.1. Buenas prácticas

- **Fija la versión** (`npx bmad-method@6.12.4 install`) y anótala en el repositorio, para que todo el equipo vea lo mismo.
- **Empieza cada flujo en una conversación nueva.** Mezclar fases en un mismo chat contamina el contexto (sección 2).
- **Haz que el tamaño del proceso siga al trabajo.** Un cambio pequeño es un `/bmad-build`, no una ruta de dos horas.
- **Mantén cortos los documentos.** Sofia, en V7, lee todo en una sola pasada y el techo práctico es de unas decenas de miles de tokens (unas 40 páginas): lo que excede se pierde sin avisar.
- **Versiona `_bmad-output/`** y revísalo como revisas código: es el contrato que el agente usa.
- **Revisa las primeras historias a mano.** Fijan el patrón que luego se repite.
- **Usa `bmad-help`** cuando no sepas qué sigue.

#### 12.2. Límites

- **Costo en tokens:** el repositorio **no publica cifras oficiales**. Lo que sí documenta son mecanismos para contenerlo: skills largos divididos en pasos, `bmad-shard-pro` (V7) y una profundidad de revisión configurable. Tenlo presente si tu plan de uso del modelo es limitado.
- **Exceso de proceso:** un blogger que lo probó contó dos días de preguntas, cinco documentos de planificación y «cero líneas de código real» antes de pasar a un enfoque más ligero. Es **una opinión individual**, no un estudio, pero describe un riesgo real: aplicar la ruta completa a una tarea pequeña.
- **No es determinista:** los agentes formulan las preguntas distinto cada vez; la documentación misma lo dice («esto no es un guion»).
- **Los agentes no tienen memoria persistente:** lo que perdura son los documentos.
- **Seguridad:** son skills con scripts de un tercero (ver la sección 10.1).
- **Cambia rápido:** los nombres de fases, comandos y agentes difieren entre versiones. Verifica antes de seguir una guía antigua.

#### 12.3. Errores frecuentes

| Síntoma | Causa probable | Qué hacer |
| :--- | :--- | :--- |
| Lo que lees en la web no coincide con lo instalado | La web documenta **V7**; instalaste v6.12 | Lee la documentación de la rama `V6.12` o instala la versión que describe la web |
| El agente inventa endpoints | No tiene el contexto del backend | `docs/backend-api.md` y apuntarlo con `persistent_facts`, o dejar que lea el backend (sección 11.1) |
| Tardas horas y no hay código | Ruta completa para un cambio pequeño | `/bmad-build` directo |
| El agente repite un error de convención | Falta contexto del repositorio | `/bmad-project-context` y revisa el bloque de `AGENTS.md` |
| Los documentos se contradicen | Mezclaste fases en una sola conversación o se editó un documento sin actualizar los demás | Conversación nueva por flujo; `bmad-correct-course` para cambios de rumbo |
| Una historia no cabe en una sesión | Es demasiado grande | Dividirla; la referencia es unas 500 líneas |
| Un skill se detiene pidiendo permiso | La herramienta pide confirmar el primer comando nuevo | Léelo y acepta, o los chequeos se saltan |

### 13. Un reto para practicar

Elige una mejora real para tu app de ejercicios y rutinas (por ejemplo, «guardar rutinas favoritas») y decide, **antes de empezar**:

1. ¿Qué tamaño tiene? ¿Es un `/bmad-build` o una ruta completa? Justifica con la tabla de la sección 9.4.
2. Escribe `docs/backend-api.md` con los endpoints que necesitarías.
3. Si elegiste la ruta completa: pídele a John un PRD ligero y **marca cada requisito con el endpoint que lo respalda**. Cuenta cuántas suposiciones (`[ASSUMPTION]`) dejó el agente y decide cuáles aceptas.
4. Construye **una** historia con `/bmad-build` y compara el resultado con el criterio de aceptación.

Al terminar, responde: ¿qué parte del proceso te ahorró trabajo y cuál te lo costó?

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s16-agentes-skills-bmad-quiz">
  <Question title="¿Qué distingue a un agente de un asistente de chat?">
    <Option>El agente es un modelo más grande.</Option>
    <Option>El asistente siempre verifica su propio trabajo.</Option>
    <Option correct>El agente usa herramientas para decidir los pasos, actuar y verificar el resultado en un bucle, mientras que el asistente responde con texto que tú aplicas.</Option>
    <Option>El agente no necesita contexto.</Option>
  </Question>
  <Question title="¿Cuáles son las tres fases del bucle agéntico de Claude Code?">
    <Option>Planear, programar y desplegar.</Option>
    <Option correct>Reunir contexto, actuar y verificar los resultados.</Option>
    <Option>Preguntar, esperar y repetir.</Option>
    <Option>Leer, borrar y escribir.</Option>
  </Question>
  <Question title="Escribes en un archivo de instrucciones una regla que debe cumplirse siempre, como no editar el archivo .env. ¿Qué garantía tienes?">
    <Option>Total: el agente nunca puede incumplirla.</Option>
    <Option correct>Ninguna: es una petición que el modelo trata como contexto; para que se cumpla siempre se usa un hook o un permiso.</Option>
    <Option>Solo se cumple si está dentro de una skill.</Option>
    <Option>Se cumple si el archivo tiene menos de 200 líneas.</Option>
  </Question>
  <Question title="¿Qué se carga SIEMPRE en el contexto de una skill, aunque no la uses?">
    <Option>Todo su SKILL.md.</Option>
    <Option>Todos sus scripts.</Option>
    <Option correct>Solo su nombre y su descripción (aproximadamente 100 tokens).</Option>
    <Option>Nada: las skills no ocupan contexto.</Option>
  </Question>
  <Question title="Tu skill tiene la descripción «Ayuda con documentos». ¿Qué problema es probable?">
    <Option>Que ocupe demasiado contexto.</Option>
    <Option>Que Claude Code la rechace al instalarla.</Option>
    <Option correct>Que el agente no la active cuando la necesitas, o que la active para tareas equivocadas.</Option>
    <Option>Que sus scripts no se ejecuten.</Option>
  </Question>
  <Question title="¿Cuál es la relación entre AGENTS.md y la carpeta .agents/?">
    <Option>Las dos son parte del mismo estándar abierto.</Option>
    <Option correct>AGENTS.md es un formato abierto; la carpeta .agents/ es una convención, y Claude Code no lee nada que esté dentro de ella.</Option>
    <Option>.agents/ es la carpeta donde Claude Code descubre las skills.</Option>
    <Option>AGENTS.md solo lo lee Claude Code.</Option>
  </Question>
  <Question title="¿Para qué sirve un subagente?">
    <Option>Para que el modelo use menos herramientas.</Option>
    <Option>Para guardar la memoria entre sesiones.</Option>
    <Option correct>Para delegar una tarea en un contexto aislado y recibir solo un resumen, sin llenar la conversación principal, o para trabajar en paralelo.</Option>
    <Option>Para ejecutar skills de terceros sin riesgo.</Option>
  </Question>
  <Question title="Según el artículo de Böckeler, ¿qué es una spec en spec-driven development?">
    <Option>Un prompt largo bien escrito.</Option>
    <Option>El archivo de memoria general que se carga en todas las sesiones.</Option>
    <Option correct>Un artefacto estructurado y orientado al comportamiento, que se guarda y se revisa, y que guía al agente para una funcionalidad concreta.</Option>
    <Option>Un comentario dentro del código.</Option>
  </Question>
  <Question title="¿Qué nivel de SDD dice que «la spec se conserva incluso después de terminar la tarea»?">
    <Option>Spec-first.</Option>
    <Option correct>Spec-anchored.</Option>
    <Option>Spec-as-source.</Option>
    <Option>Vibe coding.</Option>
  </Question>
  <Question title="¿Qué dice la evidencia disponible sobre si el spec-driven development mejora los resultados?">
    <Option>Hay estudios controlados que muestran una mejora del 50 %.</Option>
    <Option>Hay estudios que demuestran que empeora los resultados.</Option>
    <Option correct>No hay estudios controlados que lo midan; lo que existe son experiencias de equipos, anuncios de los proveedores y opinión.</Option>
    <Option>Solo se ha medido en proyectos de videojuegos.</Option>
  </Question>
  <Question title="Vas a cambiar el color de un botón. ¿Qué ruta de BMAD corresponde?">
    <Option>La ruta completa: brief, PRD, UX, arquitectura y épicas.</Option>
    <Option correct>Una edición obvia y de bajo riesgo: pedírselo directamente al agente; BMAD no hace falta.</Option>
    <Option>Siempre bmad-prfaq.</Option>
    <Option>Una retrospectiva con bmad-retrospective.</Option>
  </Question>
  <Question title="Instalaste BMAD con npx bmad-method install y la web oficial muestra otra cosa (el agente Sofia, el skill bmad). ¿Por qué?">
    <Option>Porque la instalación falló.</Option>
    <Option>Porque la web está desactualizada y describe una versión antigua.</Option>
    <Option correct>Porque la web documenta V7 (alfa), mientras que ese comando instala la v6.12 estable.</Option>
    <Option>Porque Sofia es un agente de la versión 5.</Option>
  </Question>
  <Question title="Tu frontend nuevo consume un backend que ya existe. ¿Qué conviene hacer para que BMAD no invente endpoints?">
    <Option>Nada: BMAD descubre el backend por sí solo.</Option>
    <Option correct>Darle el contexto del backend: por ejemplo un docs/backend-api.md o el OpenAPI en el repositorio, o dejar que lea el código con bmad-deep-recon.</Option>
    <Option>Pedirle a John que adivine la API en el PRD.</Option>
    <Option>Escribir todo el backend de nuevo en el PRD.</Option>
  </Question>
  <Question title="¿Qué documento produce Sally con bmad-ux?">
    <Option>El código de los componentes.</Option>
    <Option correct>DESIGN.md (cómo se ve) y EXPERIENCE.md (cómo funciona: flujos, pantallas y estados).</Option>
    <Option>epics.md.</Option>
    <Option>ARCHITECTURE-SPINE.md.</Option>
  </Question>
  <Question title="¿Qué indican las etiquetas [ASSUMPTION] en los documentos de BMAD?">
    <Option>Que el documento está aprobado.</Option>
    <Option>Que el agente encontró un error de sintaxis.</Option>
    <Option correct>Que el agente rellenó algo sin preguntar; el método espera que tú lo leas y decidas si lo aceptas.</Option>
    <Option>Que una historia está lista para construirse.</Option>
  </Question>
</Quiz>

---

## Further Reading

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Claude Code: How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Claude Code: Skills](https://code.claude.com/docs/en/skills)
- [Claude Code: Memory (CLAUDE.md y AGENTS.md)](https://code.claude.com/docs/en/memory)
- [Claude Code: Subagents](https://code.claude.com/docs/en/sub-agents)
- [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Anthropic Academy](https://anthropic.skilljar.com/)
- [Agent Skills: especificación abierta](https://github.com/agentskills/agentskills)
- [AGENTS.md](https://github.com/agentsmd/agents.md)
- [Birgitta Böckeler: Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [Kiro: Specs](https://kiro.dev/docs/specs/)
- [BMAD-METHOD (repositorio)](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD: documentación (V7)](https://docs.bmad-method.org/)
