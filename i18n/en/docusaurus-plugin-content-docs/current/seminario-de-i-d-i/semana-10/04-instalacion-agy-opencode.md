---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CLI Installation

To apply the **Human-in-the-Lead** paradigm in our Flutter projects, we need an agile and robust command-line interface. In this session, you will learn how to install, authenticate, and operate two leading tools in the agentic terminal ecosystem:

1. **Antigravity CLI (`agy`)**: A high-integration tool designed for advanced agentic workflows, native subagent support, and deep context management.
2. **OpenCode CLI (`opencode`)**: An open-source terminal client with a Go-powered TUI, compatible with multiple model providers (Google Gemini, Anthropic Claude, OpenAI, and local models via Ollama).

---

## 1. Tool Overview

![Workflow and Comparison of Antigravity CLI and OpenCode](/img/seminario-de-i-d-i/cli-tools-setup-workflow.svg)

| Feature | Antigravity CLI (`agy`) | OpenCode (`opencode`) |
| :--- | :--- | :--- |
| **Primary Focus** | Agentic orchestration with subagents and slash commands | Open-source multi-provider interactive TUI |
| **Supported Models** | Gemini family (Flash, Pro) and associated models | Gemini, Claude 3.5 Sonnet, GPT-4o, local Ollama |
| **User Interface** | Interactive console + Slash Commands (`/`) | Terminal User Interface (TUI with Bubble Tea) |
| **Automated Mode** | Integrated into terminal pipelines | `opencode run "<prompt>"` (*headless mode*) |
| **File-Level Context** | Contextual loading and reading via tool calls | Explicit inclusion with at-sign (`@file`) |

---

## 2. Installing Antigravity CLI (`agy`)

### Prerequisites
* Git installed and configured on your system (`git --version`).
* An active internet connection and developer account for authentication.

### Installation Process

<Tabs>
<TabItem value="windows" label="Windows (PowerShell)" default>

Open a **PowerShell** terminal and run the one-step installation script:

```powershell title="Installing agy on Windows"
# Automatic download and configuration in your PATH
irm https://antigravity.google/cli/install.ps1 | iex

# Verify installation
agy --version
```

</TabItem>
<TabItem value="macos" label="macOS (Terminal / zsh)">

Open your terminal and run the official script via `curl`:

```bash title="Installing agy on macOS"
# Download and PATH configuration
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Verify installation
agy --version
```

</TabItem>
<TabItem value="linux" label="Linux (Bash / Zsh)">

```bash title="Installing agy on Linux"
# One-step download and installation
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Verify installation
agy --version
```

</TabItem>
</Tabs>

### Authenticating in `agy`
When running `agy` for the first time:
1. The console will display an authentication URL or automatically open your default browser.
2. Sign in with your authorized credentials.
3. Upon completing the login process, the terminal will display the interactive prompt:
   ```yaml
   Antigravity CLI: Ready
   Help: Type /help for available slash commands
   Status: Connected
   ```

---

## 3. Installing OpenCode (`opencode`)

OpenCode is an open-source project distributed as a self-contained binary and via global package managers.

### Binary Installation

<Tabs>
<TabItem value="powershell" label="Windows (PowerShell)" default>

Run the official installation script for Windows:

```powershell title="Installing OpenCode on Windows"
# Run remote installer
irm https://opencode.ai/install.ps1 | iex

# Alternative via npm (if you have Node.js installed):
npm install -g opencode
```

Verify that the executable is in your `PATH`:
```powershell
opencode --version
```

</TabItem>
<TabItem value="unix" label="macOS / Linux">

Use the automated installation script via `curl`:

```bash title="Installing OpenCode on macOS / Linux"
# Using the official installer
curl -fsSL https://opencode.ai/install | bash

# Or on macOS using Homebrew:
brew install anomalyco/tap/opencode

# Alternative via npm:
npm install -g opencode
```

Verify the version:
```bash
opencode --version
```

</TabItem>
</Tabs>

### Configuring Providers and Models in OpenCode

OpenCode allows you to choose your preferred language model. To connect your API Keys:

```bash title="Configuring credentials in OpenCode"
# Launch the interactive authentication wizard:
opencode auth login
```

The wizard will prompt you for the provider you want to configure:
* **Google Gemini:** Requires `GEMINI_API_KEY`.
* **Anthropic:** Requires `ANTHROPIC_API_KEY` (for Claude 3.5 Sonnet).
* **OpenAI:** Requires `OPENAI_API_KEY` (for GPT-4o).
* **Ollama:** For 100% local GPU inference without API costs.

:::tip[Direct Environment Variables]
You can also export your key directly in your `.bashrc`, `.zshrc`, or Windows Environment Variables:
```bash
export GEMINI_API_KEY="AIzaSy..."
# or
export ANTHROPIC_API_KEY="sk-ant-..."
```
:::

---

## 4. Getting Started in the Flutter Project Directory

Once your tool of choice (`agy` or `opencode`) is installed, the standard workflow consists of **launching the console directly inside the root of the Flutter project** we created in sessions 18 and 19:

```bash title="Navigate to the project and launch the agent"
# 1. Navigate to your Flutter application folder (e.g., fittrack)
cd ~/dev/flutter/fittrack

# 2. Verify that your Flutter environment is healthy
flutter doctor

# 3. Launch your agent:
agy
# (or if using OpenCode):
opencode
```

### Agent Health Check
Once inside the agent's interactive prompt, run an initial diagnostic query:

```markdown title="Initial diagnostic query"
Inspect the project root and tell me which Flutter dependencies are declared in pubspec.yaml
```

**What to expect:**
1. The agent invokes a file reading tool (`view_file` or `read_file` on `pubspec.yaml`).
2. You will see the requested action in the terminal.
3. The agent will reply with a summary of the declared dependencies (such as `flutter: sdk: flutter` and `cupertino_icons`).

With the environment up and running, in the next lesson we will explore **context management**: what the model actually sees, how tokens are calculated, and why context determines the quality of the generated code.
