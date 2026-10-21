---
sidebar_position: 1
description: "Learn what a skill is, how the SKILL.md file is structured, and how to install and invoke skills to extend your agents."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Skills: Agent Extension

In previous sessions, you learned that an artificial intelligence model's context window is a finite and costly resource. If we attempt to pack all instructions, style guides, library documentation, and automation scripts into a single `AGENTS.md` or `CLAUDE.md` file, we cause **Context Bloat**, which spikes latency and triggers the *Lost in the Middle* phenomenon (attention degradation).

To solve this engineering challenge, modern terminal tools (`agy`, `opencode`, Claude Code) introduce the concept of **Skills**: packages of procedural knowledge and specialized tooling loaded on-demand by the agent only when the current task requires it.

---

## 1. What is a Skill?

A **Skill** is a self-contained capability module that extends an AI agent's operational intelligence. Unlike global, permanent repository rules:

* **Does not saturate initial memory:** Remains dormant on local disk and is only injected into the context window when explicitly invoked by the user or when the agent determines that the task matches the skill description.
* **Provides procedural memory:** Contains step-by-step workflows ("how to do X"), debugging heuristics, and domain-specific best practices (for example, Flutter with Material Design 3).
* **Includes executable tools:** Can bundle terminal scripts (Python, Bash, Dart) and code templates allowing the agent to run automated diagnostics and validations.

![Skill Anatomy and Surgical In-Memory Loading](/img/seminario-de-i-d-i/skills-anatomia-invocacion.svg)

---

## 2. Anatomy of a Skill

Physically, a skill is a structured directory located within the agent configuration folders (at the project level in `.agents/skills/<skill-name>/` or at the user level in `~/.gemini/antigravity-cli/skills/`).

Its anatomy consists of the following required and optional elements:

```bash title="Skill structure"
.agents/skills/flutter-helper/
├── SKILL.md            # [REQUIRED] Manifest, YAML metadata, and instructions
├── scripts/            # [OPTIONAL] Executable automation scripts
│   ├── check_lints.py
│   └── audit_dispose.sh
└── references/         # [OPTIONAL] Templates, design tokens, and schemas
    ├── m3_colors.json
    └── state_blueprint.dart
```

### The `SKILL.md` File and its YAML Frontmatter

The `SKILL.md` file is the required entry point. It begins with a YAML metadata block enclosed by three hyphens (`---`):

```markdown title=".agents/skills/flutter-helper/SKILL.md" showLineNumbers
---
name: flutter-helper
description: "Specialist in frontend development with Flutter, Material 3, State lifecycle, and memory leak prevention."
---

# Flutter Helper Skill

This skill guides the construction, auditing, and refactoring of Flutter user interfaces.

## Implementation Rules
1. Strictly separate Screen (host Scaffold) from Page (internal canvas).
2. Any resource holding listeners (TextEditingController) must be released in dispose().
3. Use const constructors on all immutable widgets.
```

* **`name`**: Unique kebab-case identifier used to invoke the skill from the command line (e.g., `/skill flutter-helper`).
* **`description`**: Concise summary explaining when and why it should be activated. Agents use this description to automatically select the appropriate skill via semantic similarity when the user issues a request.

---

## 3. Installing and Invoking Skills

Skills can be installed at two scope levels depending on the team's needs:

### 1. Project Level (Shared with the Team)
Stored inside the repository under `.agents/skills/<skill-name>/` and tracked in version control with Git. This ensures that any team member or agent cloning the repository has access to the exact same operational capabilities.

### 2. Global Level (Developer Environment)
Stored in the CLI user directory (e.g., on Windows `C:\Users\<User>\.gemini\config\skills\` or on Linux/macOS `~/.config/agy/skills/`). They are available across any project opened in your terminal.

### Console Invocation

In the agentic CLI, you can load and interact with a skill in two ways:

<Tabs>
<TabItem value="manual" label="Explicit Invocation (/skill)" default>

```yaml title="Explicit invocation"
# Direct loading of the skill into the active session
> /skill flutter-helper

[System] Skill 'flutter-helper' loaded into active context.
Tokens added: 920 tokens (0.7% of context limit).

> "Generate a view to register a new contact with phone validation"
```

</TabItem>
<TabItem value="automatica" label="Automatic Semantic Activation">

```yaml title="Automatic activation"
# The agent detects the need from the prompt and loads the skill
> "Review lib/pages/contact_page.dart and check if there are memory leaks in controllers"

[Agent Decision] Task matches skill 'flutter-helper'. Activating procedural guide...
[Agent] Inspecting dispose() on controllers in lib/pages/contact_page.dart.
```

</TabItem>
</Tabs>

---

## 4. Installing the Flutter Skill for the Course

For this course, we will use a specialized Flutter skill providing:
1. Automated verification of the **Screen vs. Page** rule (avoiding nested `Scaffold` widgets).
2. Detection of orphan controllers that omit the call to `dispose()`.
3. Validation of official **Google Material Design 3** components.

To check available skills in your console environment, run:

```bash title="Terminal" showLineNumbers
agy skill list
```

Or within the interactive agent session:

```yaml title="List skills"
> /skills
```

---

## 5. Auditing Generated Code and the Living Contract

When the agent generates or modifies code assisted by the skill, your responsibility as the **Human-in-the-Lead** is to audit the result before integrating it into the project.

![Human-in-the-Lead Audit and Decision Loop](/img/seminario-de-i-d-i/bucle-feedback-contrato.svg)

### What to fix by hand vs. what to fix in the contract?

One of the most common pitfalls when working with AI agents is falling into two unproductive extremes: manually fixing everything repeatedly, or overcrowding the `AGENTS.md` file with tiny, irrelevant rules.

| Situation | Diagnosis | Correct Action | Justification |
| :--- | :--- | :--- | :--- |
| **Isolated or Cosmetic Flaw** | A margin of `16.0` instead of `20.0`, or button text requiring a specific wording tweak. | **Fix by hand** directly in the `.dart` file. | It is not worth consuming tokens or cluttering the global contract for a rule applicable only to one specific view. |
| **Systemic Architectural Violation** | The agent nested a `Scaffold` inside a `Page`, used a `StatefulWidget` for static data, or used deprecated Flutter 1 components (`FlatButton`). | **Update the contract** (`AGENTS.md` or `.agents/memory/`). | If you do not update the contract, the agent will make the exact same mistake on the next screen you ask it to build. |

:::tip[The Living Contract Principle]
Whenever the agent makes a recurring architectural mistake, do not just fix the code: **add the negative or positive rule in `.agents/memory/`**. By doing so, you compound the learning for the entire semester and across your entire team via Git.
:::

---

## Self-Assessment Quiz

<Quiz id="seminario-s11-skills-extension-quiz">
  <Question title="What is the primary advantage of using a Skill instead of placing all instructions inside AGENTS.md?">
    <Option>It allows the agent to compile Flutter applications without having the SDK installed.</Option>
    <Option correct>It avoids context window overload (Context Bloat), loading procedural knowledge on-demand only when the task requires it.</Option>
    <Option>Skills completely replace the mobile application's source code.</Option>
    <Option>It allows the language model to run offline on any computer.</Option>
  </Question>

  <Question title="Which file is mandatory inside any Skill folder, and what section must it include at the beginning?">
    <Option>README.txt with a list of Flutter commands.</Option>
    <Option>config.json containing Supabase database passwords.</Option>
    <Option correct>SKILL.md with a YAML frontmatter metadata block delimited by three hyphens (---) defining its name and description.</Option>
    <Option>main.dart with a basic StatelessWidget class.</Option>
  </Question>

  <Question title="If the agent generates a view with 12px padding instead of 16px on a specific card, what is the recommended action according to the Human-in-the-Lead principle?">
    <Option>Delete the entire repository and start over from scratch.</Option>
    <Option correct>Fix the value manually in the Dart file, since it is an isolated cosmetic adjustment that does not justify polluting the global context contract.</Option>
    <Option>Create a new rule in AGENTS.md requiring that no padding can ever be 12px across the entire application.</Option>
    <Option>Uninstall the agentic CLI and rewrite the project in Java Swing.</Option>
  </Question>

  <Question title="If the agent repeatedly nests Scaffolds inside Pages violating clean architecture, what is the required action?">
    <Option>Accept the code because Flutter compiles it without syntax errors.</Option>
    <Option>Fix it by hand silently every single time it occurs throughout the semester.</Option>
    <Option correct>Update the agentic contract (AGENTS.md or conventions memory) to explicitly prohibit the antipattern of nested Scaffolds inside Pages.</Option>
    <Option>Restart the computer to clear Dart's cache.</Option>
  </Question>

  <Question title="How do you manually invoke a skill in the interactive agent console?">
    <Option>git push --skill flutter</Option>
    <Option correct>Using the /skill &lt;skill-name&gt; command in the active terminal session.</Option>
    <Option>flutter pub add skill</Option>
    <Option>npm run build</Option>
  </Question>
</Quiz>
