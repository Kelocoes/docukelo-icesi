---
sidebar_position: 2
description: "Understand the MCP protocol, its host, client, and server architecture, and how it differs from an API or a skill."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Model Context Protocol (MCP)

In the previous session, we explored how to extend an agent's reasoning via **Skills** (on-demand procedural memory). However, a language model on its own has no access to the real world: it cannot query your Supabase database, interact with remote GitHub repositories, or control a web browser to test a live screen.

To bridge this disconnect between LLMs and real-world data sources, the industry adopted a critical open standard: the **Model Context Protocol (MCP)**.

---

## 1. What is MCP?

The **Model Context Protocol (MCP)** is an open, bidirectional protocol developed by Anthropic that standardizes how AI applications (*Hosts*) securely connect with external tools, data sources, and services (*Servers*).

Prior to MCP, if a tool wanted to connect an agent to a PostgreSQL database, a GitHub repository, and the local file system, it had to implement proprietary connectors for each one. With MCP, any service that implements the specification becomes universally and instantly accessible to any compatible client (`agy`, Claude Desktop, Cursor, VS Code).

![Comparison: Traditional API vs Skill vs MCP Server](/img/seminario-de-i-d-i/mcp-arquitectura-vs-api-vs-skill.svg)

---

## 2. The Conceptual Triad: API vs. Skill vs. MCP

Developers frequently confuse these three concepts in the agentic ecosystem. Understanding their distinctions is essential for designing modern software architectures:

| Feature | Traditional API (REST / GraphQL) | Agent Skill | MCP Server (Model Context Protocol) |
| :--- | :--- | :--- | :--- |
| **What is it?** | Programming interface for communication between systems. | Module containing procedural memory, heuristics, and reasoning rules. | Client-server protocol exposing executable tools and real-time resources. |
| **Target Audience** | Human developers and traditional compiled code. | The language model (injected into its context window). | The intelligent agent and its tool-calling runtime. |
| **Self-Discovery** | **None.** Requires a human to read Swagger/OpenAPI docs and write client code. | Via YAML frontmatter metadata or explicit command (`/skill`). | **Fully dynamic.** The server exposes its tools (`tools/list`) with live JSON Schema definitions. |
| **Real-World Analogy** | A fixed-voltage wall outlet. | The workshop repair manual with step-by-step assembly instructions. | The mechanical toolbox attached to an operator's robotic arm. |

---

## 3. Why Can't an LLM Directly Consume a REST API?

You might wonder: *"If we already have REST APIs with endpoints like `/api/v1/contacts`, why do we need MCP?"*.

Traditional REST APIs pose three significant challenges when interacting with language models:

1. **Lack of semantic introspection:** An HTTP API returns a status code (such as `400 Bad Request` or `404 Not Found`) without explaining to the agent what parameters were expected or what alternative options exist to resolve the error.
2. **Unnecessary token overhead:** Injecting an entire Swagger specification (OpenAPI) containing hundreds of endpoints into the LLM prompt exhausts the context window before work even begins.
3. **Runtime security and permissions:** A traditional REST API grants global access through a static API token. MCP implements a consent protocol where the user can authorize individual tool calls (*Human-in-the-Loop*).

---

## 4. MCP Architecture: Host, Client, and Server

The MCP specification operates on a three-tier architecture:

```mermaid
graph TD
    subgraph Host ["MCP Host (Execution Environment)"]
        H["Main Application<br/>(agy Terminal / Claude Desktop / IDE Extension)"]
        C["MCP Client<br/>(JSON-RPC Connection Manager)"]
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

1. **MCP Host:** The main application where the user interacts with the AI (for instance, the developer CLI or your code editor).
2. **MCP Client:** The module inside the host that manages active connections, transmits model requests, and receives execution results.
3. **MCP Server:** A lightweight, standalone process exposing three primitive capability types:
   * **Tools:** Executable functions with side effects (e.g., `create_table`, `git_commit`, `send_slack_message`).
   * **Resources:** Contextual read-only data (e.g., database schemas, log files, technical documentation).
   * **Prompts:** Preconfigured prompt templates guiding the model through server-specific tasks.

### Transport Channels

MCP communicates using **JSON-RPC 2.0** messages across two transport mechanisms:
* **`stdio` (Standard Input/Output):** The host launches the MCP server as a local child process on the same machine (ideal for CLI tools, emulators, and local file operations).
* **`SSE` (Server-Sent Events over HTTP):** The MCP server runs on a remote cloud host (ideal for shared services such as Supabase, enterprise Jira, or Docker clusters).

---

## 5. Practical Examples of MCP Servers in Engineering

Below are the most widely used MCP servers in contemporary software projects:

<Tabs>
<TabItem value="postgres" label="PostgreSQL / Supabase" default>

Allows the agent to inspect real database schemas before writing queries or Dart data models:

```json title="tools/list (Postgres MCP Server Response)"
{
  "tools": [
    {
      "name": "describe_table",
      "description": "Returns columns, data types, and foreign keys for a PostgreSQL table.",
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

* **Engineering benefit:** The agent calls `describe_table(table_name: "contacts")` and generates the immutable Dart model with exact field names and types directly from the database without hallucinating.

</TabItem>
<TabItem value="github" label="GitHub Server">

Enables the agent to interact with the remote Git repository:

```json title="tools/list (GitHub MCP Server Response)"
{
  "tools": [
    {
      "name": "create_pull_request",
      "description": "Creates a Pull Request in the repository with a title and technical summary.",
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

Enables the agent to launch a headless browser, capture screenshots of the web app, and verify whether buttons are interactive:

```yaml title="MCP server invocation"
# Flow invocation within the agent
Agent: "Opening http://localhost:3000 to validate the contact form..."
Tool Call: browser_navigate(url: "http://localhost:3000")
Tool Call: browser_take_screenshot()
Agent: "Screenshot verified: the 'Add Contact' button is visible with no layout overflows."
```

</TabItem>
</Tabs>

---

## 6. Configuring an MCP Server in Your Environment

To enable an MCP server in your developer CLI (`agy`), define a JSON configuration file in your workspace or global directory:

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

Upon launching the session, the agent automatically detects these servers through the MCP handshake, listing newly available tools to assist in building and auditing your application.

---

## Self-Assessment Quiz

<Quiz id="seminario-s11-mcp-quiz">
  <Question title="What is the primary purpose of the Model Context Protocol (MCP)?">
    <Option>To replace the Flutter SDK with a Python-based component library.</Option>
    <Option correct>To standardize through an open, bidirectional protocol the secure connection between AI models and real-world tools, databases, and environments.</Option>
    <Option>To compile Dart applications directly into machine code without Gradle.</Option>
    <Option>To completely eliminate the need for frontend unit testing.</Option>
  </Question>

  <Question title="What is the fundamental difference between an Agent Skill and an MCP Server?">
    <Option>Skills are paid while MCP servers are always free.</Option>
    <Option>Skills only run in web browsers while MCP servers only run on mobile phones.</Option>
    <Option correct>A Skill provides procedural memory and contextual knowledge as text, whereas an MCP Server is an executable process that exposes interactive real-world tools.</Option>
    <Option>There is no difference; they are exact synonyms.</Option>
  </Question>

  <Question title="Why can't an LLM efficiently consume a traditional REST API without a protocol like MCP?">
    <Option>Because REST APIs do not support JSON data formats.</Option>
    <Option correct>Because traditional REST APIs lack dynamic semantic introspection for LLMs and would overload the context window with massive static schemas.</Option>
    <Option>Because language models are restricted from making requests over port 443.</Option>
    <Option>Because REST APIs can only be invoked by users with administrator privileges on Windows.</Option>
  </Question>

  <Question title="In the three-tier MCP architecture, which component directly exposes Tools, Resources, and Prompts?">
    <Option>The MCP Host.</Option>
    <Option>The Dart AOT compiler.</Option>
    <Option correct>The MCP Server.</Option>
    <Option>The Flutter project pubspec.yaml file.</Option>
  </Question>

  <Question title="Which transport mechanism does MCP use when the server runs as a local child process on the developer's machine?">
    <Option>WebSockets with TLS 1.3 encryption exclusively.</Option>
    <Option correct>stdio (Standard Input and Output of the operating system with JSON-RPC messages).</Option>
    <Option>Passive FTP file transfer.</Option>
    <Option>RS-232 serial cable connection.</Option>
  </Question>
</Quiz>
