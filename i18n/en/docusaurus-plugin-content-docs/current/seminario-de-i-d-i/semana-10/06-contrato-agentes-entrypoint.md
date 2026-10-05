---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AGENTS.md Contract

In professional software development with terminal agents, the instruction file is not a user manual for humans; it is a **formal architectural and behavioral contract for the machine**.

This standard has converged across the industry around two canonical names: **`AGENTS.md`** (an agnostic standard adopted by the open community) and **`CLAUDE.md`** (used by the Anthropic ecosystem). When an agent finds one of these files at the repository root upon starting a session, it immediately loads it as its top-priority directive.

---

## 1. Modular Architecture: `AGENTS.md` as an Entrypoint

As an application grows, placing every single guideline into a single file causes clutter and saturates context. The recommended practice is to use `AGENTS.md` at the root as a **lean entrypoint** that indexes and links specialized subdirectories inside the `.agents/` folder:

![Modular Structure of AGENTS.md and Living Document](/img/seminario-de-i-d-i/estructura-agents-entrypoint.svg)

### Distribution of Responsibilities in `.agents/`

```text
my_flutter_project/
├── AGENTS.md                      # Main entrypoint at the root
└── .agents/
    ├── memory/                    # Hard architecture rules and technical decisions
    │   ├── flutter-architecture.md # Screen vs Page convention, data immutability
    │   └── ui-tokens-material3.md # Color seeds, typography, and visual style
    ├── conventions/               # Quality standards and code style
    │   ├── dart-style.md          # Linting rules, mandatory use of const
    │   └── git-workflow.md        # Commit convention (feat:, fix:, refactor:)
    └── workflows/                 # Checklists and validation processes
        └── checklist-ui.md        # Checklist before approving a view
```

:::note[Why aren't we including "skills" yet?]
*Skills* are executable packages with scripts and dynamic invocation schemas that we will study in depth in **Week 11**. In this stage, we focus exclusively on **memory, conventions, and contractual guidelines**.
:::

---

## 2. Generating the Contract: The `/init` Command and Its Meta-Prompt

### What does the native `/init` command do?
In tools with built-in support (such as Claude Code or Antigravity), running `/init` in the terminal runs a static analyzer across the repository:
1. It inspects manifests (`pubspec.yaml`, `package.json`, `analysis_options.yaml`).
2. It detects the language (Dart 3.x), framework (Flutter), and common build commands.
3. It generates an initial draft of `AGENTS.md` or `CLAUDE.md` tailored to the detected structure.

### The Universal Initialization Meta-Prompt
If your CLI does not natively feature the `/init` command or if you are configuring a repository from scratch with OpenCode, execute this **Meta-Prompt** directly in the terminal:

```markdown title="Meta-Prompt to generate the first AGENTS.md"
Act as a Senior Flutter Software Architect. Inspect this repository 
(check pubspec.yaml, analysis_options.yaml, and the lib/ folder).

Generate a concise and modular AGENTS.md file for the project root to serve 
as the operational contract for future AI agents. It must comply with:
1. Essential terminal commands (flutter analyze, dart format, flutter test).
2. Non-negotiable architectural rule: Screen (with Scaffold) vs Page (without Scaffold) separation.
3. State constraint: 100% StatelessWidget, immutability, and passing parameters via constructors.
4. Design: Strict Material Design 3, using Theme.of(context).colorScheme.
5. Index of links pointing to the .agents/ folder (memory, conventions, workflows).
6. Concise list of forbidden anti-patterns (e.g., nested Scaffolds, hardcoded hex colors, StatefulWidget).

Be succinct and direct. Do not add redundant explanations that consume unnecessary tokens.
```

---

## 3. The Context File as a Living Document

A common mistake when starting out with agentic programming is conceiving `AGENTS.md` as a static configuration file written once and archived.

In professional practice following a **Human-in-the-Lead** approach, the context file is a **living organism that evolves alongside the software lifecycle**, capturing the team's learnings and resolutions:

* **Step 1: Pattern detection:** The agent makes a mistake or a recurring deviation (for example, using deprecated properties in a widget).
* **Step 2: Root cause diagnosis:** As the development lead, you identify that the convention or technical constraint was not explicitly formulated in the contract.
* **Step 3: Concise drafting:** A concise and direct rule is drafted inside `AGENTS.md` or in the relevant topic file within `.agents/memory/`.
* **Step 4: Immediate reload:** In the next interaction or session, the agent reads the updated contract and adopts the standard without requiring continuous manual supervision.

### Update Protocol
* **The two-warnings rule:** If you have to correct the agent twice on the same anti-pattern (for instance, omitting `const` constructors), do not correct it manually a third time. **Open `AGENTS.md` and add the constraint.**
* **Conciseness and clarity:** Be direct and prescriptive. It is far more effective to write:
  ```markdown
  - FORBIDDEN: Using Scaffold inside files located in lib/pages/.
  ```
  than writing a three-paragraph justification on Flutter design history.
* **Version control:** The `AGENTS.md` file and the `.agents/` folder **must be included in Git commits**. This ensures that any team member (or evaluator) who clones the repository shares the exact same agentic assistance standard.

In the next lesson, we will put all of this into practice in our **In-Class Hands-on Workshop**, implementing the agent on the initial mobile application.
