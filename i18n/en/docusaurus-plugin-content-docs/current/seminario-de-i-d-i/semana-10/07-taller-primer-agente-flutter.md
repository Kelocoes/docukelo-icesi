---
sidebar_position: 7
unlisted: true
---

# AI Agents Workshop

The goal of this workshop is to put into practice the terminal-based agent-assisted development workflow (`agy` or `opencode`), formalize the architecture of your Flutter application through an agentic contract, and solve UI issues under the **Human-in-the-Lead** role.

![Flutter Agent Workshop Flow](/img/seminario-de-i-d-i/taller-flujo-agente-flutter.svg)

---

## Prerequisites

* Local Flutter project (for example, the base app or the FitTrack challenge).
* Agentic CLI installed and authenticated (`agy` or `opencode`).
* Emulator or physical device ready to test the views.

---

## What You Must Build

### 1. Agentic Contract Structure
You must define the architectural contract in your repository so that the agent operates within the project boundaries:
* **Modular `.agents/` folder:** Create context directories (`memory/`, `conventions/`) and document the application's golden rules:
  * Strict separation between `Screen` (solely responsible for `Scaffold`) and `Page` (internal canvas without `Scaffold`).
  * Strict immutability: 100% of UI built using `StatelessWidget`.
  * Visual integration with Google Material 3 (`colorScheme`).
* **`AGENTS.md` entry point:** Create the root file serving as an entry point for the agent, linking the modular documentation in `.agents/` and declaring verification commands (`flutter analyze`, `dart format lib/`).

### 2. Terminal-Based Problem Solving (Human-in-the-Lead)
Use your terminal agent to interact with the project code:
* Ask the agent to fix or implement a view (for example, resolve a `RenderFlex overflow` or lay out a session summary component).
* **Mandatory change auditing:** Do not accept diffs blindly. Inspect that the solution adheres to immutability (`StatelessWidget`), utilizes `const` constructors where applicable, and does not break the layout structure.
* Run `flutter analyze` to verify that the resulting code introduces no lints or warnings.

### 3. Contract Iteration (Living Document)
The contract must evolve alongside the code:
* Identify an incorrect pattern or an additional rule you want to standardize (for example, Material 3 button syntax or parameter naming).
* Update `AGENTS.md` or the corresponding file in `.agents/memory/` with the new guideline.
* Ask the agent to audit or refactor the created code to align with the new rule.
* Make a Git commit that includes both the source code and the updated agentic contracts.

---

## Validation Criteria

1. **Functional contract:** Root `AGENTS.md` referencing `.agents/` without overloading the initial context.
2. **Architecture respected:** All views follow the `Screen` vs. `Page` rule and remain as `StatelessWidget`.
3. **Code quality:** `flutter analyze` reports zero issues (*0 issues found*).
4. **Git traceability:** Repository commits reflecting the joint evolution of the code and agentic rules.
