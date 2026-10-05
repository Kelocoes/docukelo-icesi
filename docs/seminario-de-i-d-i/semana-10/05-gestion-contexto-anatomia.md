---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Gestión de Contexto

Un modelo de inteligencia artificial no "recuerda" tu proyecto de forma mágica ni posee conciencia de tu repositorio. En términos de ciencias de la computación, los LLMs son funciones puras sin estado (*stateless*): cada vez que interactúas con un agente en la consola, este evalúa un bloque de texto estructurado conocido como la **Ventana de Contexto**.

La calidad, precisión y apego arquitectónico del código que el agente genere en Flutter dependerá directamente de lo que esté presente (y de lo que esté ausente) en dicha ventana.

---

## 1. Anatomía de la Ventana de Contexto

Cada petición que envías al agente ensambla una estructura de capas de información antes de enviarse al modelo de lenguaje:

![Anatomía de la Ventana de Contexto y Comandos de Auditoría](/img/seminario-de-i-d-i/anatomia-ventana-contexto.svg)

### Las 5 Capas del Contexto Agéntico
1. **System Prompt del CLI:** Instrucciones fundacionales inyectadas por la herramienta (`agy` u `opencode`). Define la identidad del agente, los esquemas de las herramientas disponibles (lectura de archivos, ejecución de comandos en bash/powershell) y los protocolos de seguridad.
2. **Contrato de Contexto del Proyecto (`AGENTS.md` / `CLAUDE.md`):** Tu especificación arquitectónica. Le indica al agente que estamos en Flutter con Material 3, que toda la UI debe usar `StatelessWidget` y que existe una regla estricta entre `Screen` y `Page`.
3. **Historial de Conversación:** La secuencia reciente de mensajes intercambiados durante la sesión de terminal.
4. **Salidas de Herramientas (*Tool Outputs*) y Archivos:** El código fuente que el agente ha abierto deliberadamente (ej. `lib/pages/home_page.dart`) y los resultados de consola (ej. el informe de `flutter analyze`).
5. **Espacio Reservado para la Generación (*Completion Tokens*):** La cuota máxima de tokens que el modelo tiene permitida para redactar su respuesta y proponer los *diffs*.

---

## 2. Los Dos Peligros: Amnesia y Sobrecarga (*Context Bloat*)

Para liderar al agente con eficacia (*Human-in-the-Lead*), debes evitar dos extremos perjudiciales:

| Dimensión | Extremo 1: Amnesia Arquitectónica | Punto Óptimo (Human-in-the-Lead) | Extremo 2: Context Bloat (Sobrecarga) |
| :--- | :--- | :--- | :--- |
| **Causa raíz** | Sin `AGENTS.md` o con reglas ambiguas. | Contrato conciso, modular y quirúrgico. | Carpetas enteras (`build/`, `.dart_tool/`, logs) inyectadas. |
| **Comportamiento del LLM** | Alucinación estadística, código genérico y obsoleto. | Cumple convenciones locales (MD3, `StatelessWidget`). | *Lost in the Middle*: ignora instrucciones intermedias. |
| **Impacto en el equipo** | Refactorización manual obligatoria y frustración. | Diff mínimo, limpio y verificable en consola. | Alta latencia (*TTFT*), consumo excesivo de tokens y bugs sutiles. |

### Peligro 1: Amnesia Arquitectónica ("Garbage In, Garbage Out")
Si no proporcionas un archivo de contexto o este es vago, el modelo recurre a la probabilidad estadística global de su entrenamiento en Internet. Como en los foros públicos abundan tutoriales desactualizados:
* Te generará botones obsoletos como `FlatButton` o `RaisedButton` en vez de `ElevatedButton`.
* Creará componentes `StatefulWidget` innecesarios para maquetaciones estáticas.
* Encapsulará un `Scaffold` dentro de otro `Scaffold`, rompiendo la convención `Screen` vs `Page`.

### Peligro 2: Sobrecarga y Degradación de Atención (*Lost in the Middle*)
Cargar directorios masivos como `build/`, `.dart_tool/` o archivos de configuración de iOS/Android (`Podfile.lock`) produce **Context Bloat**:
* **Degradación de atención:** Diversos estudios de atención en transformadores demuestran que cuando la ventana de contexto se satura de información irrelevante, el modelo tiende a ignorar instrucciones críticas ubicadas en el medio del prompt (*Lost in the Middle*).
* **Mayor latencia:** El tiempo necesario para procesar el primer token (*Time To First Token - TTFT*) se dispara notablemente.
* **Costo innecesario:** Cada interacción reenvía miles de tokens redundantes a la API.

:::info[Regla de Oro del Contexto]
**"¿Puede el agente inferir esto leyendo el código existente?"**
Si la respuesta es sí (por ejemplo, si el agente puede deducir cómo se llama una variable viendo el archivo), **no lo incluyas** en tu archivo de instrucciones. Solo incluye reglas de negocio, patrones arquitectónicos no inferibles y anti-patrones prohibidos.
:::

---

## 3. Comandos Esenciales de Inspección en Consola

Los entornos de terminal profesionales ofrecen comandos rápidos (*Slash Commands*) para auditar el estado cognitivo del agente:

### 1. `/context`: ¿Qué tiene el agente en la cabeza?
Permite visualizar la lista exacta de archivos cargados en memoria y el porcentaje de la ventana de contexto utilizado:

```yaml
# Auditoría de memoria activa en consola
> /context
Active Context Tokens: 14250 / 128000 (11%)
Loaded Files:
  - AGENTS.md (Root context)
  - pubspec.yaml (Project manifest)
  - lib/screens/home_screen.dart (Active edit target)
  - lib/pages/home_page.dart (Active edit target)
```

### 2. `/usage` (o `/cost`): Monitoreo de recursos y gasto
Muestra el consumo acumulado de tokens durante la sesión:

```yaml
# Métricas de consumo y costos en tiempo real
> /usage
Session Usage:
  Prompt Tokens (Input): 42100
  Completion Tokens (Output): 3850
  Total Tool Invocations: 8
  Estimated Session Cost: $0.014 USD
```

### 3. `/model`: Selección del motor adecuado
Te permite alternar entre modelos según la complejidad técnica de la tarea:

```yaml
# Selector interactivo de motor agéntico
> /model
Available Models:
  1: Gemini 1.5 Flash / Claude 3.5 Haiku (Rápido, ideal para consultas o correcciones menores)
  2: Gemini 1.5 Pro / Claude 3.5 Sonnet (Avanzado, recomendado para arquitectura y refactorizaciones)
Selecciona: 2
```

---

## 4. ¿Y si tu CLI no tiene estos comandos nativos?

Si estás utilizando una herramienta que no implementa `/context` o `/usage` como comandos directos, puedes auditar al agente formulándole **prompts de metacognición**:

<Tabs>
<TabItem value="context-prompt" label="Emular /context" default>

```markdown title="Prompt de auditoría de contexto"
Enumera de forma concisa qué archivos de este proyecto tienes cargados actualmente 
en tu contexto de trabajo y resume en 3 puntos las reglas arquitectónicas que estás aplicando.
```

</TabItem>
<TabItem value="rules-prompt" label="Comprobar apego al contrato">

```markdown title="Prompt de verificación de contrato"
Antes de generar código, cita textualmente la regla de AGENTS.md relativa 
a la separación entre Screen y Page y explícame cómo aplica a la vista que te pedí.
```

</TabItem>
</Tabs>

En la siguiente sesión aprenderemos a construir nuestro primer archivo `AGENTS.md` (o `CLAUDE.md`) utilizando el comando `/init` o su prompt equivalente, y estableceremos una estructura modular y escalable para la carpeta `.agents/`.
