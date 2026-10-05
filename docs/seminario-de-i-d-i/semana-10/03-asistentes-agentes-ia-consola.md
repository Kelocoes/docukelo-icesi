---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Agentes en Consola

En las sesiones anteriores aprendiste a construir interfaces declarativas en Flutter mediante la composición de widgets *Stateless* y la estricta separación entre `Screen` y `Page`. A partir de este punto del curso, daremos el salto hacia el **desarrollo de software asistido por agentes inteligentes**, transformando la terminal de comandos en un entorno de co-creación guiada.

---

## 1. De Asistentes Pasivos a Agentes en Consola

Durante los últimos años, la interacción habitual con modelos de lenguaje masivo (LLM) ha sido a través de interfaces de chat en el navegador o extensiones de autocompletado en el editor de código (*inline completion* o *ghost text*). Sin embargo, este enfoque presenta una brecha operativa evidente:

![Asistente Tradicional vs Agente de Consola con ReAct Loop](/img/seminario-de-i-d-i/asistente-vs-agente-react.svg)

### La limitación del Asistente Tradicional (Chatbot / Copilot)
* **Pasivo y desacoplado:** El modelo responde a tus preguntas o redacta fragmentos aislados, pero **carece de contacto con el sistema operativo**.
* **Fricción manual constante:** Como desarrollador, debes copiar el bloque generado, pegarlo en tu archivo, formatearlo, ejecutar `flutter analyze` en la terminal, leer el mensaje de error si algo falló y volver a redactar un prompt explicando el fallo al chatbot.
* **Amnesia arquitectónica:** Al no poder inspeccionar el árbol del proyecto ni las dependencias en `pubspec.yaml`, el chatbot suele asumir versiones antiguas de librerías o inventar widgets inexistentes.

### El Agente de IA en Consola (Bucle ReAct)
Un **agente de software** no es simplemente un LLM conversando; es un programa que ejecuta un ciclo continuo de **Percepción $\rightarrow$ Razonamiento $\rightarrow$ Acción $\rightarrow$ Verificación** (*ReAct Loop*):

1. **Percepción:** Utiliza herramientas (*tools*) para explorar el árbol de directorios, leer archivos específicos (como `lib/screens/home_screen.dart`) e inspeccionar el historial de Git.
2. **Razonamiento:** Analiza el objetivo solicitado a la luz del contexto del proyecto y de las reglas de arquitectura definidas por el equipo.
3. **Acción:** Propone y aplica ediciones precisas (*diffs*) en el código fuente, crea archivos y ejecuta comandos en la terminal (`flutter pub get`, `dart format`).
4. **Verificación:** Evalúa la salida de la terminal (`stdout` y `stderr`). Si al ejecutar `flutter analyze` el compilador reporta un error de sintaxis o una violación de linter, el agente **lee el error, reflexiona sobre la causa y se auto-corrige** antes de dar por terminada la tarea.

---

## 2. Modos de Operación y Niveles de Autonomía

Al operar un agente en consola sobre tu máquina de desarrollo, la pregunta central no es solo qué puede hacer el agente, sino **cuánto control delegas en él**. Los entornos agénticos clasifican la operación en cuatro niveles de autonomía:

| Nivel | Modo de Operación | Nivel de Autonomía | Control del Desarrollador |
| :---: | :--- | :--- | :--- |
| **0** | **Solo Consulta** (*Ask*) | Solo lectura de archivos | Máximo (cero comandos o escrituras en disco) |
| **1** | **Supervisado** (*Human-in-the-Loop*) | Propone acciones y *diffs* | **Confirmación explícita `[y/n]` antes de cada acción** |
| **2** | **Planificado** (*Plan Mode*) | Ejecución por fases tras plan | Aprobación previa de la arquitectura propuesta |
| **3** | **Autónomo** (*Full Auto*) | Ciclo continuo sin pausas | Supervisión diferida (solo para pipelines maduros) |

### Nivel 0: Solo Consulta (*Ask Mode*)
El agente actúa en modo de solo lectura. Puede analizar archivos para responderte dudas conceptuales (por ejemplo, *"Explícame por qué este Container causa overflow"*), pero tiene bloqueada la modificación de archivos y la ejecución de comandos.

### Nivel 1: Supervisión Paso a Paso (*Human-in-the-Loop*)
El agente investiga el problema y propone acciones atómicas. **Antes de aplicar cualquier modificación o ejecutar un comando de shell, se detiene y te solicita confirmación explícita:**

```bash
# 1. Confirmación de comando en shell:
? Agente desea ejecutar: flutter analyze
  [y] Permitir  [n] Denegar  [a] Permitir siempre durante esta sesión
```

```diff
# 2. Confirmación de diff antes de tocar el archivo en disco:
--- a/lib/pages/home_page.dart
+++ b/lib/pages/home_page.dart
@@ -15,3 +15,5 @@
+ return SingleChildScrollView(
+   child: Column(
- return Column(
```

:::tip[Recomendación Pedagógica]
Durante este curso universitario, el **Nivel 1** es tu modo de trabajo fundamental. Te obliga a auditar cada línea de código antes de que toque tu repositorio, evitando que el desarrollo se convierta en una caja negra.
:::

### Nivel 2: Planificación Previa (*Plan Mode*)
Antes de escribir una sola línea de código en tareas complejas (como maquetar una pantalla nueva con 4 subcomponentes), el agente genera un **plan estructurado por fases**. El desarrollador revisa y aprueba el plan arquitectónico general; una vez aprobado, el agente ejecuta las etapas de edición de manera semi-autónoma.

### Nivel 3: Autonomía Completa (*Full Auto / YOLO Mode*)
El agente ejecuta comandos, crea ramas de Git, resuelve errores y refactoriza sin requerir interacción humana hasta completar el objetivo. Este modo solo es viable en proyectos con suites de pruebas unitarias automáticas muy maduras y entornos desechables (*sandboxes* en contenedores). **No se recomienda en etapas formativas.**

---

## 3. De Human-in-the-Loop a Human-in-the-Lead

Uno de los errores más comunes al comenzar a programar con agentes de IA es adoptar una actitud pasiva, limitándose a presionar la tecla `[y]` cada vez que el agente propone una acción. Este fenómeno se conoce como **fatiga de confirmación** y convierte al desarrollador en un simple "portero distraído".

Para ejercer una ingeniería de software rigurosa, debemos evolucionar de **Human-in-the-Loop** a **Human-in-the-Lead**:

![Human in the loop frente a Human in the lead](/img/seminario-de-i-d-i/human-in-the-loop-vs-lead.svg)

<Tabs>
<TabItem value="hitl" label="Human-in-the-Loop (Reactivo)" default>

* **Postura:** El programador reacciona ante lo que el modelo propone.
* **Mecánica:** Lanza un prompt vago (*"Hazme la pantalla de perfil"*), el agente asume decisiones de diseño por su cuenta y el programador intenta corregir las alucinaciones aprobando o rechazando *diffs* en la terminal.
* **Riesgo:** Pérdida de control arquitectónico, código espagueti y dependencia cognitiva del asistente.

</TabItem>
<TabItem value="hitlead" label="Human-in-the-Lead (Estratégico)">

* **Postura:** El programador actúa como el **Arquitecto y Director Técnico**.
* **Mecánica:** 
  1. Define con anterioridad las restricciones innegociables (por ejemplo: *"100% StatelessWidget, nada de Scaffolds anidados en Pages, uso estricto de Material 3"*).
  2. Plasma estas reglas en un contrato explícito (`AGENTS.md`).
  3. Divide el problema en especificaciones claras y audita que el agente opere estrictamente dentro de los límites del contrato.
* **Beneficio:** Conservas la autoría intelectual del sistema, maximizas la velocidad de entrega y garantizas una base de código limpia y mantenible.

</TabItem>
</Tabs>

---

## 4. Por qué Operar desde la Consola

¿Por qué preferir un agente que viva en la terminal por encima de una extensión gráfica en el editor?

1. **Alineación con el ciclo de vida del software:** Los comandos reales de compilación (`flutter run`), comprobación de tipos (`dart analyze`), gestión de paquetes (`flutter pub add`) y control de versiones (`git commit`) residen en la terminal. Un agente en consola interactúa nativamente con estas herramientas.
2. **Agnóstico del editor:** Funciona exactamente igual tanto si utilizas VS Code, Android Studio, Vim o un servidor remoto vía SSH.
3. **Componibilidad y automatización:** Permite encadenar flujos mediante tuberías (*pipes*), scripts de terminal e integraciones en flujos de integración continua (*CI/CD*).
4. **Visibilidad sin adornos:** Todo lo que el agente lee, propone y ejecuta queda registrado cronológicamente en el historial de tu terminal con colores semánticos y marcas de tiempo.

En la siguiente lección instalaremos las herramientas de terminal líderes de este ecosistema: **Antigravity CLI (`agy`)** y **OpenCode (`opencode`)**.
