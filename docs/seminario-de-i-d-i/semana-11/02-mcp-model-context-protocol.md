---
sidebar_position: 2
description: "Comprende el protocolo MCP, su arquitectura de host, cliente y servidor, y en qué se diferencia de una API o una skill."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Protocolo MCP (Model Context Protocol)

En la sesión anterior exploramos cómo extender el razonamiento del agente mediante **Skills** (memoria procedimental bajo demanda). Sin embargo, un modelo de lenguaje por sí solo no tiene acceso al mundo real: no puede consultar tu base de datos en Supabase, no puede interactuar con repositorios remotos en GitHub ni puede manipular un navegador web para probar una pantalla en vivo.

Para resolver la fragmentación entre los LLMs y las fuentes de datos del mundo real, la industria adoptó un estándar abierto fundamental: el **Model Context Protocol (MCP)**.

---

## 1. ¿Qué es MCP?

El **Model Context Protocol (MCP)** es un protocolo abierto y bidireccional desarrollado por Anthropic que estandariza la forma en que las aplicaciones con IA (*Hosts*) se conectan de manera segura con herramientas, fuentes de datos y servicios externos (*Servers*).

Antes de MCP, si una herramienta quería conectar un agente con una base de datos PostgreSQL, un repositorio de GitHub y el sistema de archivos local, debía programar conectores propietarios independientes para cada uno. Con MCP, cualquier servicio que implemente la especificación se vuelve accesible de forma universal e instantánea para cualquier cliente compatible (`agy`, Claude Desktop, Cursor, VS Code).

![Comparativa: API Tradicional vs Skill vs Servidor MCP](/img/seminario-de-i-d-i/mcp-arquitectura-vs-api-vs-skill.svg)

---

## 2. La Tríada Conceptual: API vs. Skill vs. MCP

Es común que los desarrolladores confundan estos tres conceptos en el ecosistema agéntico. Comprender su diferencia es esencial para diseñar arquitecturas de software modernas:

| Característica | API Tradicional (REST / GraphQL) | Skill de Agente | Servidor MCP (Model Context Protocol) |
| :--- | :--- | :--- | :--- |
| **¿Qué es?** | Interfaz de programación para comunicación entre sistemas. | Módulo de memoria procedimental, heurísticas y reglas de razonamiento. | Protocolo cliente-servidor que expone herramientas y recursos ejecutables en tiempo real. |
| **Público objetivo** | Desarrolladores humanos y código compilado tradicional. | El modelo de lenguaje (se inyecta en su ventana de contexto). | El agente inteligente y su runtime de ejecución de herramientas (*Tool Calling*). |
| **Autodescubrimiento** | **Ninguno.** Requiere que un humano lea la documentación de Swagger/OpenAPI y programe el cliente. | Por metadatos YAML frontmatter o comando directo (`/skill`). | **Totalmente dinámico.** El servidor expone sus herramientas (`tools/list`) con esquemas JSON Schema en vivo. |
| **Analogía del mundo real** | Un enchufe eléctrico de pared con voltaje fijo. | El manual de taller con instrucciones paso a paso sobre cómo armar un motor. | La caja de herramientas mecánicas conectada al brazo robótico del operario. |

---

## 3. ¿Por qué un LLM no puede consumir directamente una API REST?

Podrías preguntarte: *"Si ya tenemos APIs REST con endpoints como `/api/v1/contacts`, ¿por qué necesitamos MCP?"*.

Las APIs REST tradicionales presentan tres limitaciones graves cuando interactúan con modelos de lenguaje:

1. **Falta de introspección semántica:** Una API HTTP entrega un código de estado (como `400 Bad Request` o `404 Not Found`) pero no explica al agente qué parámetros esperaba o qué alternativas existen para resolver el error.
2. **Sobrecarga de tokens innecesaria:** Si intentas inyectar una especificación Swagger completa (OpenAPI) con cientos de endpoints en el prompt del LLM, agotarás la ventana de contexto antes de comenzar a trabajar.
3. **Seguridad y permisos en runtime:** Una API REST tradicional concede acceso global a través de un token API estático. MCP implementa un protocolo de consentimiento donde el usuario puede autorizar individualmente cada llamada a herramienta (*Human-in-the-Loop*).

---

## 4. Arquitectura de MCP: Host, Client y Server

La especificación MCP opera bajo una arquitectura de tres capas:

```mermaid
graph TD
    subgraph Host ["MCP Host (Entorno de Ejecución)"]
        H["Aplicación Principal<br/>(Terminal agy / Claude Desktop / IDE Extension)"]
        C["MCP Client<br/>(Gestor de Conexiones JSON-RPC)"]
        H --> C
    end

    C -->|"JSON-RPC (stdio / SSE)"| S1["MCP Server: Postgres<br/>(describe_table, run_query)"]
    C -->|"JSON-RPC (stdio / SSE)"| S2["MCP Server: GitHub<br/>(create_pr, list_issues)"]
    C -->|"JSON-RPC (stdio / SSE)"| S3["MCP Server: Playwright<br/>(browser_navigate, screenshot)"]

    style Host fill:#f8fafc,stroke:#64748b,stroke-width:1.5px
    style H fill:#ffffff,stroke:#94a3b8,stroke-width:1.5px,color:#0f172a
    style C fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    style S1 fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    style S2 fill:#faf5ff,stroke:#865cf0,stroke-width:2px,color:#581c87
    style S3 fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
```

1. **MCP Host:** La aplicación principal donde el usuario interactúa con la IA (por ejemplo, el CLI de desarrollo o tu editor de código).
2. **MCP Client:** El módulo dentro del host que gestiona las conexiones activas, envía las solicitudes del modelo y recibe los resultados.
3. **MCP Server:** Un proceso independiente y ligero que expone tres tipos primitivos de capacidades:
   * **Tools (Herramientas):** Funciones ejecutables con efectos secundarios (ej. `create_table`, `git_commit`, `send_slack_message`).
   * **Resources (Recursos):** Datos de solo lectura contextuales (ej. esquemas de bases de datos, archivos de logs, documentación técnica).
   * **Prompts:** Plantillas preconfiguradas para guiar al modelo en tareas específicas del servidor.

### Canales de Transporte (Transports)

MCP se comunica mediante mensajes **JSON-RPC 2.0** a través de dos mecanismos de transporte:
* **`stdio` (Entrada/Salida Estándar):** El host inicia el servidor MCP como un subproceso local en la misma máquina (ideal para CLI tools, emuladores y manipulación de archivos locales).
* **`SSE` (Server-Sent Events sobre HTTP):** El servidor MCP corre en un host remoto en la nube (ideal para servicios compartidos como Supabase, Jira corporativo o clusters de Docker).

---

## 5. Ejemplos Prácticos de Servidores MCP en Ingeniería

A continuación se presentan los servidores MCP más utilizados en proyectos de software contemporáneos:

<Tabs>
<TabItem value="postgres" label="PostgreSQL / Supabase" default>

Permite que el agente inspeccione la estructura real de la base de datos antes de escribir consultas o modelos en Dart:

```json title="tools/list (Respuesta del servidor MCP Postgres)"
{
  "tools": [
    {
      "name": "describe_table",
      "description": "Devuelve las columnas, tipos de datos y llaves foráneas de una tabla en Postgres.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "table_name": { "type": "string" }
        },
        "required": ["table_name"]
      }
    }
  ]
}
```

* **Beneficio para el estudiante:** El agente consulta `describe_table(table_name: "contactos")` y genera el modelo inmutable en Dart con los nombres de campos y tipos exactos de la base de datos sin alucinar.

</TabItem>
<TabItem value="github" label="GitHub Server">

Permite que el agente interactúe con el repositorio remoto de Git:

```json title="tools/list (Respuesta del servidor MCP GitHub)"
{
  "tools": [
    {
      "name": "create_pull_request",
      "description": "Crea un Pull Request en el repositorio con un título y descripción técnica.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "head_branch": { "type": "string" },
          "base_branch": { "type": "string" }
        }
      }
    }
  ]
}
```

</TabItem>
<TabItem value="browser" label="Playwright / Browser">

Permite que el agente abra un navegador headless, capture pantallas de la aplicación web y valide si los botones son interactivos:

```yaml title="Invocación de servidor MCP"
# Invocación en el flujo del agente
Agent: "Abriendo http://localhost:3000 para validar el formulario de contactos..."
Tool Call: browser_navigate(url: "http://localhost:3000")
Tool Call: browser_take_screenshot()
Agent: "Captura de pantalla verificada: el botón 'Agregar Contacto' es visible y no presenta desbordes visuales."
```

</TabItem>
</Tabs>

---

## 6. Configuración de un Servidor MCP en tu Entorno

Para habilitar un servidor MCP en tu CLI de desarrollo (`agy`), se define un archivo de configuración JSON en tu espacio de trabajo o directorio global:

```json title="mcp_servers.json" showLineNumbers
{
  "mcpServers": {
    "supabase-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:pass@db.supabase.co:5432/postgres"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

Al iniciar la sesión, el agente detecta automáticamente estos servidores mediante el handshake de MCP, listando las nuevas herramientas disponibles para asistir en la construcción y auditoría de tu aplicación.

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s11-mcp-quiz">
  <Question title="¿Cuál es la función principal del Model Context Protocol (MCP)?">
    <Option>Reemplazar el SDK de Flutter por una librería de componentes basada en Python.</Option>
    <Option correct>Estandarizar mediante un protocolo abierto y bidireccional la conexión segura de modelos de IA con herramientas, bases de datos y entornos del mundo real.</Option>
    <Option>Compilar aplicaciones Dart directamente a código binario sin necesidad de Gradle.</Option>
    <Option>Eliminar por completo la necesidad de escribir pruebas unitarias en el frontend.</Option>
  </Question>

  <Question title="¿Cuál es la diferencia fundamental entre una Skill y un Servidor MCP?">
    <Option>Las skills son de pago y los servidores MCP son siempre gratuitos.</Option>
    <Option>Las skills solo funcionan en navegadores web y los servidores MCP solo en teléfonos móviles.</Option>
    <Option correct>Una Skill aporta memoria procedimental y conocimiento contextual en texto, mientras que un MCP Server es un proceso ejecutable que expone herramientas interactivas del mundo real.</Option>
    <Option>No existe ninguna diferencia; son dos palabras exactamente sinónimas.</Option>
  </Question>

  <Question title="¿Por qué un LLM no puede consumir eficientemente una API REST tradicional sin un protocolo como MCP?">
    <Option>Porque las APIs REST no soportan transferencias de datos en formato JSON.</Option>
    <Option correct>Porque las APIs REST tradicionales carecen de autodescubrimiento semántico dinámico para LLMs y sobrecargarían la ventana de contexto con esquemas estáticos masivos.</Option>
    <Option>Porque los modelos de lenguaje tienen prohibido hacer peticiones por el puerto 443.</Option>
    <Option>Porque las APIs REST solo pueden ser ejecutadas por usuarios con permisos de administrador en Windows.</Option>
  </Question>

  <Question title="En la arquitectura de tres capas de MCP, ¿qué elemento expone directamente las Tools, Resources y Prompts?">
    <Option>El MCP Host.</Option>
    <Option>El compilador AOT de Dart.</Option>
    <Option correct>El MCP Server.</Option>
    <Option>El archivo pubspec.yaml del proyecto Flutter.</Option>
  </Question>

  <Question title="¿Qué mecanismo de transporte utiliza MCP cuando el servidor corre como un proceso local en la misma máquina del desarrollador?">
    <Option>WebSockets con cifrado TLS 1.3 exclusivamente.</Option>
    <Option correct>stdio (Entrada y Salida estándar del sistema operativo con mensajes JSON-RPC).</Option>
    <Option>Transferencia de archivos vía FTP pasivo.</Option>
    <Option>Conexión por cable serial RS-232.</Option>
  </Question>
</Quiz>
