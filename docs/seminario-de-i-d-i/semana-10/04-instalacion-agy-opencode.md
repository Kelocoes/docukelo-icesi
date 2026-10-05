---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Instalación de CLIs

Para aplicar el paradigma de **Human-in-the-Lead** en nuestros proyectos de Flutter, necesitamos una interfaz de consola ágil y robusta. En esta sesión aprenderás a instalar, autenticar y operar dos de las herramientas líderes en el ecosistema de terminal agéntica:

1. **Antigravity CLI (`agy`)**: Herramienta de alta integración diseñada para flujos agénticos avanzados, soporte nativo de subagentes y gestión profunda de contexto.
2. **OpenCode CLI (`opencode`)**: Cliente de terminal de código abierto (*open-source*) con interfaz TUI construida en Go, compatible con múltiples proveedores de modelos (Google Gemini, Anthropic Claude, OpenAI y modelos locales vía Ollama).

---

## 1. Visión General de las Herramientas

![Flujo y Comparativa de Antigravity CLI y OpenCode](/img/seminario-de-i-d-i/cli-tools-setup-workflow.svg)

| Característica | Antigravity CLI (`agy`) | OpenCode (`opencode`) |
| :--- | :--- | :--- |
| **Enfoque Principal** | Orquestación agéntica con subagentes y comandos slash | TUI interactiva multiproveedor de código abierto |
| **Modelos Soportados** | Familia Gemini (Flash, Pro) y modelos asociados | Gemini, Claude 3.5 Sonnet, GPT-4o, Ollama local |
| **Interfaz de Usuario** | Consola interactiva + Slash Commands (`/`) | Terminal User Interface (TUI con Bubble Tea) |
| **Modo Automatizado** | Integrado en pipelines de terminal | `opencode run "<prompt>"` (*headless mode*) |
| **Contexto por Archivo** | Carga contextual y lectura mediante herramientas | Inclusión explícita con arroba (`@archivo`) |

---

## 2. Instalación de Antigravity CLI (`agy`)

### Requisitos Previos
* Git instalado y configurado en el sistema (`git --version`).
* Conexión a Internet y cuenta de desarrollador activa para autenticación.

### Proceso de Instalación

<Tabs>
<TabItem value="windows" label="Windows (PowerShell)" default>

Abre una terminal de **PowerShell** y ejecuta el script de instalación en un solo paso:

```powershell title="Instalación de agy en Windows"
# Descarga y configuración automática en tu PATH
irm https://antigravity.google/cli/install.ps1 | iex

# Comprobar instalación
agy --version
```

</TabItem>
<TabItem value="macos" label="macOS (Terminal / zsh)">

Abre tu terminal y ejecuta el script oficial vía `curl`:

```bash title="Instalación de agy en macOS"
# Descarga y configuración en PATH
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Comprobar instalación
agy --version
```

</TabItem>
<TabItem value="linux" label="Linux (Bash / Zsh)">

```bash title="Instalación de agy en Linux"
# Descarga e instalación en un solo paso
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Comprobar instalación
agy --version
```

</TabItem>
</Tabs>

### Autenticación en `agy`
Al ejecutar `agy` por primera vez:
1. La consola desplegará una URL de autenticación o abrirá automáticamente tu navegador predeterminado.
2. Inicia sesión con tus credenciales autorizadas.
3. Al completar el inicio de sesión, la terminal mostrará el prompt interactivo:
   ```yaml
   Antigravity CLI: Ready
   Help: Type /help for available slash commands
   Status: Connected
   ```

---

## 3. Instalación de OpenCode (`opencode`)

OpenCode es un proyecto de código abierto que se distribuye como binario autocontenido y mediante gestores de paquetes globales.

### Instalación del Binario

<Tabs>
<TabItem value="powershell" label="Windows (PowerShell)" default>

Ejecuta el script oficial de instalación para Windows:

```powershell title="Instalación de OpenCode en Windows"
# Ejecutar instalador remoto
irm https://opencode.ai/install.ps1 | iex

# Alternativa mediante npm (si tienes Node.js instalado):
npm install -g opencode
```

Verifica que el ejecutable esté en tu `PATH`:
```powershell
opencode --version
```

</TabItem>
<TabItem value="unix" label="macOS / Linux">

Utiliza el script de instalación automática mediante `curl`:

```bash title="Instalación de OpenCode en macOS / Linux"
# Mediante instalador oficial
curl -fsSL https://opencode.ai/install | bash

# O en macOS usando Homebrew:
brew install anomalyco/tap/opencode

# Alternativa mediante npm:
npm install -g opencode
```

Verifica la versión:
```bash
opencode --version
```

</TabItem>
</Tabs>

### Configuración de Proveedores y Modelos en OpenCode

OpenCode te permite seleccionar el modelo de lenguaje de tu preferencia. Para vincular tus claves de API (*API Keys*):

```bash title="Configuración de credenciales en OpenCode"
# Lanzar el asistente de autenticación interactivo:
opencode auth login
```

El asistente te preguntará qué proveedor deseas configurar:
* **Google Gemini:** Requiere `GEMINI_API_KEY`.
* **Anthropic:** Requiere `ANTHROPIC_API_KEY` (para Claude 3.5 Sonnet).
* **OpenAI:** Requiere `OPENAI_API_KEY` (para GPT-4o).
* **Ollama:** Para inferencia 100% local en tu GPU sin costo de API.

:::tip[Variables de Entorno Directas]
También puedes exportar tu clave directamente en tu archivo `.bashrc`, `.zshrc` o en las Variables de Entorno de Windows:
```bash
export GEMINI_API_KEY="AIzaSy..."
# o
export ANTHROPIC_API_KEY="sk-ant-..."
```
:::

---

## 4. Primeros Pasos en el Directorio del Proyecto Flutter

Una vez instalada tu herramienta de preferencia (`agy` o `opencode`), el procedimiento estándar de trabajo consiste en **lanzar la consola directamente dentro de la raíz del proyecto Flutter** que creamos en las sesiones 18 y 19:

```bash title="Navegar al proyecto y lanzar el agente"
# 1. Posicionarte en la carpeta de tu aplicación Flutter (ej. fittrack)
cd ~/dev/flutter/fittrack

# 2. Asegurarte de que el entorno de Flutter esté sano
flutter doctor

# 3. Lanzar tu agente:
agy
# (o si utilizas OpenCode):
opencode
```

### Comprobación de Salud del Agente
Una vez dentro del prompt interactivo del agente, escribe una primera consulta de diagnóstico:

```markdown title="Consulta de diagnóstico inicial"
Inspecciona la raíz del proyecto y dime qué dependencias de Flutter están declaradas en pubspec.yaml
```

**Qué debes observar:**
1. El agente invoca una herramienta de lectura de archivos (`view_file` o `read_file` sobre `pubspec.yaml`).
2. En la terminal verás la acción solicitada.
3. El agente te responderá resumiendo las dependencias (como `flutter: sdk: flutter` y `cupertino_icons`).

Con el entorno operativo, en la siguiente lección estudiaremos **la gestión del contexto**: qué ve exactamente el modelo, cómo se calculan los tokens y por qué el contexto determina la calidad del código que genera.
