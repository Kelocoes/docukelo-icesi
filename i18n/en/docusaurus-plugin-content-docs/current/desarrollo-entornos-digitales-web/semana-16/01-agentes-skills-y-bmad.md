---
sidebar_position: 1
description: "From the basics to spec-driven development: what an agent is compared with an assistant, what a skill is and how it is organized (SKILL.md, AGENTS.md, .agents/), which problems spec-driven development tackles, and how to apply BMAD, phase by phase, to a new frontend on top of an existing backend."
---

# Agents, Skills and Spec-Driven Development with BMAD

Programming with AI is no longer just asking a chat for code. Today the work looks more like **directing an agent**: giving it context, teaching it procedures and telling it precisely what to build. This guide walks that path **from the bottom up**, because every advanced tool rests on the previous ones: there is no point in using BMAD without knowing what a skill is, or in writing specifications without understanding what context the agent has.

In this guide we will cover:

| Part | Question it answers | Sections |
| :--- | :--- | :--- |
| **A · The basics** | What is an agent and how does it differ from an assistant? What are context, a skill, `AGENTS.md`, a subagent? | 1 to 5 |
| **B · Spec-driven development** | What goes wrong when you ask a chat for code, and what does spec-driven development propose? Which tools exist? | 6 to 8 |
| **C · BMAD** | How do you use a team of agents, phase by phase, to build the frontend of an app whose backend already exists? | 9 to 13 |

```text
Model → Assistant → Agent → Context → Skills → AGENTS.md → Subagents → Specifications → BMAD
```

:::tip[How to read it]
If you already work with agents, you can jump to part B. But section 3 (skills) and section 4 (`AGENTS.md` and `.agents/`) are the foundation of BMAD: if they are not clear to you, come back to them when you reach section 9.
:::

:::note[Tools change every week]
The **concepts** in this guide are stable; the **names of commands, fields and versions** are not. When something could not be confirmed in an official source, the guide says so. Before following a command, check your tool's version and its documentation.
:::

---
## Part A · The basics: from chatting to working with agents

### 1. From a chat to an agent

#### 1.1. The model and the chat

A **language model** receives text and returns text. A **chat** is that model inside a conversation: you write, it answers. What matters is what it **cannot** do on its own. The Claude Code documentation sums it up this way: without tools, the model "can only respond with text"; with tools, it "can act: read your code, edit files, run commands, search the web, and interact with external services".

That explains an experience you already know: you ask a chat for code, **you** copy it, **you** paste it, **you** run it and, if it fails, **you** paste the error back.

#### 1.2. Assistant and agent

These two words are used very loosely. Anthropic **does not publish a formal definition of "assistant"**; what it does is contrast *agentic coding* with "chat assistants that only respond with text you have to apply yourself". In this guide we will use these working definitions:

- **Assistant:** an AI that **answers and suggests**. You run and decide every step.
- **Agent:** an AI that, with **tools**, **decides the steps, acts, looks at the result and repeats**, under your supervision.

Anthropic, in its guide *Building effective agents*, distinguishes two things that should not be mixed up:

- A **workflow** is a system where models and tools are orchestrated "through predefined code paths": the programmer sets the path.
- An **agent** is a system where the model "dynamically directs its own processes and tool usage": the model decides the path.

And in Claude Code that path has three phases that repeat: **gather context, take action and verify results**. Follow the same request ("fix the failing tests") with an assistant and with an agent:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/asistente-vs-agente/index.html"
  title="The same request, fixing the failing tests, with a chat assistant and with an agent: who decides each step and the loop of gathering context, acting and verifying"
  height={660}
/>

| | **Chat / assistant** | **Agent** |
| :--- | :--- | :--- |
| What it produces | Text that you apply | Actions on your project (edit, run) |
| Who decides the next step | You | The model, under your supervision |
| Does it verify its work? | No, unless you paste the result | Yes: it can run the tests and read the errors |
| Main risk | Blindly copying wrong code | Real changes you did not want |

:::warning[An agent really acts]
Because an agent edits files and runs commands, there are **controls**: permission modes (ask before each action, accept edits, plan first), the <kbd>Esc</kbd> key to interrupt it, and *checkpoints* to undo file edits. Checkpoints do **not** undo actions outside your computer, such as changes to a database or a deployment. Anthropic also recommends setting **stopping conditions** and testing in sandboxed environments. A more capable agent does not remove the need for **you to review**.
:::

#### 1.3. Tools and harness

A **tool** is an action the model can request: read a file, edit code, run a command, search the web, launch a subagent. Tools are what make a coding assistant "agentic". There is also **MCP** (*Model Context Protocol*), an open standard for connecting AI to external data and services.

Claude Code is the layer around the model that gives it tools and context management; that layer is called the **harness**. In other words: **Claude is the model; Claude Code is the harness** that turns it into a coding agent.

### 2. Context: what the agent knows right now

The **context window** is a session's working memory: it holds the conversation history, the content of the files the agent read, command outputs, your instruction files, loaded skills and the system instructions. Two consequences shape everything that follows:

1. **Every new session starts with an empty context.** The agent does not remember the previous conversation; it only gets back what is loaded at startup.
2. **Context is limited and everything competes for it.** A huge log, ten files read "just in case" or a very long prompt push out what really matters.

The underlying idea: **what you write in an instruction file is loaded in every session; what you put in a skill is loaded only when needed.** That difference is the reason skills exist.

### 3. Skills: knowledge that loads when needed

#### 3.1. What a skill is and why it exists

According to the Claude Code documentation, skills "extend what Claude can do": you create a `SKILL.md` file with instructions and Claude adds it to its toolkit; it uses it when relevant, or you invoke it with `/skill-name`. On the Anthropic platform they explain it by contrast: unlike a *prompt* (conversation-level instructions for a one-off task), a skill **loads on demand**, so you don't repeat the same guidance in every conversation.

Anthropic gives a rule of thumb for when to create one: when you paste the same multi-step procedure into the chat **for the third time**, it is time to turn it into a skill.

#### 3.2. Anatomy of a skill

A skill is **a folder**. There is only one required file, `SKILL.md`; the rest is optional and lets the agent read (or run) things **only if it needs them**. Click each file:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/anatomia-de-una-skill/index.html"
  title="File tree of an example skill: the required SKILL.md and the optional scripts, references and assets folders, with what loads at each level"
  height={980}
/>

The smallest `SKILL.md` that works:

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

:::info[The example is in Spanish]
The skill above reviews academic reports against the course rubric and lists structure and citation fixes, without rewriting the text. It is kept in Spanish because a skill's language should match the language its users write in.
:::

The parts of the header (the *frontmatter*), according to the open skills standard:

| Field | Required? | What it must satisfy |
| :--- | :--- | :--- |
| `name` | Yes | 1 to 64 characters: lowercase letters, digits and hyphens; same as the folder name. |
| `description` | Yes | 1 to 1024 characters: **what it does and when to use it**. It is what the agent reads to decide. |
| `license`, `compatibility`, `metadata` | No | License, environment requirements and extra data. |
| `allowed-tools` | No (experimental) | Tools **pre-approved** while the skill is active. |

Claude Code adds its own fields (for example `disable-model-invocation`, `user-invocable`, `argument-hint`, `context`, `paths`). Three details worth knowing:

- In Claude Code **all fields are optional** (only the `description` is recommended), and **a misspelled field is silently ignored**.
- `allowed-tools` **does not restrict**: every tool is still available and your permissions still rule; it only avoids being asked about the ones you list.
- `disable-model-invocation: true` prevents the agent from loading the skill on its own (and removes its description from the context): useful for skills with side effects, such as a `deploy`.

:::tip[Anthropic's best practices for writing them]
Keep `SKILL.md` **under 500 lines**; keep references **one level deep** (a file linked from `SKILL.md`, not one linked from another linked file); write the description in the **third person**, saying what it does and when to use it; and avoid vague names such as `helper` or `utils`.
:::

#### 3.3. How it loads: progressive disclosure

If the agent read all your skills in full at startup, the context would fill up before starting. That's why they load **in levels**:

| Level | When it loads | Approximate cost | What it contains |
| :--- | :--- | :--- | :--- |
| 1. Metadata | **Always**, at startup | ~100 tokens per skill | `name` and `description` |
| 2. Instructions | When the skill **activates** | under 5,000 tokens | The body of `SKILL.md` |
| 3. Resources | **As needed** | 0 until read | The supporting files; a script **is run** and only its output enters the context |

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/carga-progresiva-skills/index.html"
  title="Progressive loading of a skill in three levels: name and description always, the SKILL.md body on activation and supporting files only when needed, with an approximate context counter"
  height={680}
/>

Once invoked, the skill's content **stays in the context** in the following turns; that's why the body should be written as standing, concise instructions.

#### 3.4. Where they live and how they are used

| Location | Path | Scope |
| :--- | :--- | :--- |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | That repository; versioned with Git and shared with the team |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is enabled (`/plugin:skill`) |

There are **two ways to use them**, and by default both apply:

1. **Automatic:** the agent compares your task with the descriptions and decides to load a skill.
2. **Manual:** you invoke it with `/name`. It is the safest option when it matters that *that* skill is used.

A practical detail: skills on claude.ai, in the API and in Claude Code are **independent**; they do not sync with each other. And the old custom commands (`.claude/commands/`) still work, but Anthropic recommends skills as their replacement.

#### 3.5. Chatting versus using a skill

The same request, with and without a skill. Switch the skill's description to "vague" and see what happens:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/chat-vs-skill/index.html"
  title="The same request with and without a skill in two sessions, and what happens when the skill's description is clear or vague"
  height={660}
/>

#### 3.6. Advantages and disadvantages

**Advantages**

- **Reuse:** written once and used in every conversation.
- **On-demand context:** it only costs ~100 tokens per skill until it activates; supporting files cost nothing until they are read.
- **More reliability with scripts:** a script that runs gives the same result every time, and costs less than asking the model to generate the code.
- **Versioning and teamwork:** a project skill lives in the repository; "push it and your team gets it".
- **Consistency:** a fixed procedure instead of re-explaining it and getting different results.

**Disadvantages and risks**

- **A bad description ruins the skill:** if it is vague or overlaps with another, the agent may load the wrong one or not load the right one.
- **Context cost:** every description loads in every request; with many skills, it grows. A loaded skill competes with the history.
- **It is not deterministic:** the model **interprets** the instructions; the result can vary.
- **Maintenance:** content ages, references break and it is worth testing it with real cases.
- **Security:** a skill can bring scripts and orders that the agent runs with your permissions.

:::danger[Only use skills from trusted sources]
Anthropic says it plainly: use skills **that you created or obtained from Anthropic**. A malicious skill can direct the agent to invoke tools or run code in ways that don't match its stated purpose, risking data exfiltration. Before using a third-party one, **read** its `SKILL.md`, its scripts and any network calls.
:::

#### 3.7. Skills compared with other pieces

Skills are not the only way to give an agent context or capabilities. A quick guide on when to use each:

| Mechanism | What it is | When it loads | Use it for |
| :--- | :--- | :--- | :--- |
| `CLAUDE.md` / `AGENTS.md` | Persistent instructions | In **every** session, in full | Conventions and commands: "always do X" |
| **Skill** | Knowledge and procedures | The description always; the body when used | Reference material and repeatable tasks |
| **Subagent** | Worker with an isolated context | When launched | Isolating context, parallelizing, specializing |
| **Hook** | Automatic action on an event | When the event happens | What **must** always happen (lint, blocking a command) |
| **MCP** | Connection to external services | Its tools, at startup | Outside data and actions (database, browser) |
| **Plugin** | Bundle of skills, hooks, subagents and MCP | Depending on its parts | Sharing a complete setup |

:::note[An instruction is a request, not a guarantee]
A line such as "never edit `.env`" in `CLAUDE.md` or in a skill is a **request**, not a guarantee: the model treats it as context. If a rule must **always** hold, don't leave it in an instruction: turn it into a **hook** or a permission.
:::

### 4. AGENTS.md and the `.agents/` folder

#### 4.1. AGENTS.md: a README for agents

`README.md` is written **for people**: what the project is and how to install it. **`AGENTS.md`** is written **for coding agents**: build and test commands, conventions and the repository's pitfalls. It is an **open format**, now under the Agentic AI Foundation (Linux Foundation), with no required fields: it is plain Markdown.

```markdown title="AGENTS.md" showLineNumbers
# AGENTS.md

## Commands
- Install: `npm install`
- Local server: `npm start`
- Tests: `npm test`

## Conventions
- Documents in Spanish, code and file names in English.
- Do not edit the `build/` folder.

## Before finishing
- Run `npm test` and confirm it passes.
```

Claude Code has its own file, **`CLAUDE.md`**. The current rule: Claude Code reads `AGENTS.md` **if there is no `CLAUDE.md`**; if both exist, it reads only `CLAUDE.md`. To keep a single source, you write a `CLAUDE.md` that **imports** the other one:

```markdown title="CLAUDE.md" showLineNumbers
@AGENTS.md

## Claude Code
Use plan mode for changes in `src/billing/`.
```

#### 4.2. The `.agents/` folder: standard or convention?

Here is a common trap. `AGENTS.md` (the **file**) is a standard. The `.agents/` **folder** **is not part of that standard**: it is a **convention** that is spreading for storing a project's skills and memory. And the Claude Code documentation is explicit: it **does not read anything inside `.agents/`**, nor does it discover skills in `.agents/skills/` (its own are `.claude/skills/` and `~/.claude/skills/`).

So what is it for? A skill stored in `.agents/skills/` is useful to Claude Code only if **(a)** `AGENTS.md` or `CLAUDE.md` **links** to it and the agent decides to open it, or **(b)** you copy or link it into `.claude/skills/`. Explore the three combinations of files and see what each tool reads:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/agents-md-y-agents/index.html"
  title="Tree of a project with AGENTS.md, CLAUDE.md, .claude and .agents, and which files Claude Code reads depending on the combination of instruction files"
  height={720}
/>

This very documentation project uses exactly that strategy: its `AGENTS.md` is an **index** with links to the project memory (`.agents/memory/`) and to each skill (`.agents/skills/`), with a "when to use it" line. There is no `CLAUDE.md`, so Claude Code reads `AGENTS.md` directly and **follows the links when needed**.

| Item | Status |
| :--- | :--- |
| `AGENTS.md` at the root | Open format |
| `SKILL.md` with `name` and `description`, and the `scripts/`, `references/`, `assets/` subfolders | Open skills specification |
| `.agents/skills/` | Emerging convention (Claude Code does not read it on its own) |
| `.agents/memory/`, `.agents/spec/` | This project's own convention |
| `AGENTS.md` as an index with links | Project pattern: it works because the agent follows the links |

:::note[Other tools]
Other AI coding tools also read `AGENTS.md`, but **each one decides the details** (which file wins, whether it reads nested folders). Check the documentation of the tool you use before assuming the same behavior.
:::

### 5. Subagents: splitting the work without filling the context

A **subagent** is a specialized assistant that runs in **its own context window**, with its own instructions and permissions, performs a delegated task and **returns only a summary** to the main conversation. Anthropic recommends using one when a side task would flood the conversation with search results, logs or files you won't look at again.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/orquestador-y-subagentes/index.html"
  title="An orchestrator hands tasks to three subagents with their own context, which return only a summary, and what happens without subagents"
  height={560}
/>

They are defined as a Markdown file with *frontmatter* in `.claude/agents/` (project) or `~/.claude/agents/` (personal). Only `name` and `description` are required:

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

What you should know about them:

- **They don't see your history:** they only receive the task you delegate; that's why the task must be fully explained.
- **They help parallelize:** several subagents can work at the same time on **independent** tasks.
- **They combine with skills:** a skill with `context: fork` runs in a subagent, and a subagent can preload skills.
- **By default they can create other subagents**, up to three levels below the main conversation (this can be limited).
- **They are not free:** coordinating costs, and splitting tasks that depend on each other speeds nothing up.

With these basics (agent, context, skills, instruction files and subagents) you can now understand **why** the methodologies that follow exist: they are ways to **organize an agent's work** so that it produces predictable results.

## Part B · Spec-driven development: directing the agent with specifications

You now know what an agent is, what context it has and how procedures are taught to it with skills. The underlying question remains: **how do we tell it what to build?** So far the usual way is to write a message in the chat. This part explains why that falls short and what *spec-driven development* (SDD) proposes.

### 6. What goes wrong before specifications

The problems appear at two different moments:

**In traditional development**, the source of truth is the code. Documentation and requirements are written at the beginning, the project changes, and **the specification falls behind**. The authors of GitHub Spec Kit put it this way: the gap between specification and implementation "has plagued software development since its beginning", and requirements now change "far more rapidly than ever before".

**With AI and no method** (so-called *vibe coding*), the problem is different: you describe a vague goal and get code that **"looks right, but doesn't quite work"**. GitHub explains it without blaming the model: models are exceptional at pattern completion, but not at mind reading; the issue is our approach, not their ability. Vibe coding is fine for **prototypes**; it is less reliable for serious applications or existing code.

There are several concrete causes:

- **Gaps get filled with what "sounds right":** if you didn't say how the app is organized, the agent invents an organization.
- **Package hallucinations:** a study presented at USENIX Security 2025 (576,000 code samples, 16 models) found that **at least 5.2%** of the packages suggested by commercial models and **21.7%** of those suggested by open-source models do not exist. Note: it measures *packages*, not methods of an API.
- **Lack of persistent context:** every session starts empty (section 2), and Anthropic explains that context is a finite resource: the agent should keep notes **outside** the window to retrieve them later.

Compare the same request ("add the level filter to the list of routines") with and without a specification:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/tradicional-vs-spec/index.html"
  title="The same request without and with a specification: where the truth lives, in the chat or in versioned Markdown"
  height={660}
/>

:::warning[Evidence: what we do and don't know]
The above are **motivations**, not proof that SDD works better. To date there are **no controlled studies** measuring that developing with specifications improves results; what exists are team experiences, announcements from tool vendors and opinion. Treat it as a reasonable hypothesis that you are going to test in your own project.
:::

### 7. What spec-driven development proposes

The phrase that sums up the proposal, taken from the GitHub blog: moving from "code is the source of truth" to **"intent is the source of truth"**. Instead of starting by writing code, **you first write a specification** and from it derive the plan, the tasks and the code.

#### 7.1. What a *spec* is (and isn't)

Birgitta Böckeler, from Thoughtworks, describes a spec as **"a structured, behavior-oriented artifact"**, written in natural language as guidance for agents. Three important nuances:

- **It is not a long *prompt*.** The article itself warns that "spec" is sometimes used as a synonym for "detailed prompt", and it isn't: a spec is saved, reviewed and versioned.
- **It is not a *memory bank*.** General context files (such as `AGENTS.md`) apply to **all** sessions; a spec applies to **one specific feature**.
- **It lives in the repository.** They are Markdown files: the human steers and reviews it; the agent usually drafts it from what you describe.

Typical content: user stories and **acceptance criteria** (what must hold), a technical design (how it will be done) and a list of **tasks** traceable to the criteria.

#### 7.2. Three levels: what happens to the spec afterwards

Not every proposal treats the spec the same way. Böckeler distinguishes three levels (the article is published on Martin Fowler's site, but she is the author):

| Level | What the article says | What it means |
| :--- | :--- | :--- |
| **Spec-first** | A well thought-out spec is written first and used for the task at hand. | The spec guides the task; afterwards it may become obsolete. |
| **Spec-anchored** | The spec is kept even after the task is complete. | The spec is maintained and updated with every change. |
| **Spec-as-source** | The spec is the main source file; the human only edits the spec and never touches the code. | The code is generated from the spec. |

All the tools she analyzed are **spec-first**.

#### 7.3. What you already know

If you took the Software Seminar, you already saw a "hand-made" version of SDD: an `AGENTS.md` as a *constitution*, an `.agents/` folder with memory, specifications, plans and tasks, and a practical rule: **one task per iteration** and "the truth lives in Markdown, not in the chat" ([Seminar week 14 guide](../../seminario-de-i-d-i/semana-14/01-spec-driven-development.md)). It is *spec-first* SDD with persistent memory. What follows is the landscape of tools that automate or structure that same path.

### 8. The landscape of proposals

Five ways to apply SDD (including the hand-made one) coexist today:

| Proposal | Approach | Main files | Process weight | Best for |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub Spec Kit** | Commands in the agent, gated phases and a *constitution* | `spec.md`, `plan.md`, `tasks.md`, checklists | High | Medium or large features, teams |
| **OpenSpec** | Living specs and *delta* changes: propose, apply, archive | `openspec/specs/`, `openspec/changes/<change>/` | Low to medium | Existing code, incremental changes |
| **Kiro** | Its own IDE and CLI: requirements, design and tasks | `requirements.md`, `design.md`, `tasks.md` | Medium | Those who want a guided flow in an IDE |
| **BMAD** | An agile team of agents, from idea to code | PRD, architecture, UX, epics and stories | High (scales down) | Projects with a fuzzy idea |
| **Hand-made SDD** | The same phases in your own Markdown | `AGENTS.md` and `.agents/…` | Low to medium | Teaching and small projects |

:::note["Weight" and "curve" are our assessment]
The process weight and learning curve columns are an **assessment**, based on the tools' own descriptions and on Böckeler's analysis, not a measurement.
:::

:::warning[Commands change every week]
Spec Kit and OpenSpec published new versions this very week, and **renamed their commands** (for example, OpenSpec 2.0 retired the `/opsx:*` commands and moved to `/openspec-*` skills; Spec Kit's documentation now writes `/speckit-…` with a hyphen where older material uses a dot). Before following a guide, **check the version** of your tool with `--version` and the official documentation. The *concepts* in this part are stable; the commands are not.
:::

#### 8.1. Honest criticism

SDD is not a magic recipe. Böckeler, trying out three tools, found:

- **Mismatch with the size of the task:** one tool turned a small bug into 4 user stories and 16 acceptance criteria ("a sledgehammer to crack a nut"); for a small feature, plain AI-assisted coding would have given more control.
- **Review overhead:** "to be honest, I'd rather review code than all these markdown files".
- **False sense of control:** the agent ignored notes, created duplicates and over-applied the constitution's rules.
- **Specs that go stale:** if nobody updates them when the code changes, they fall behind again, which was exactly the original problem.

**When it doesn't pay off:** small, well-understood changes, prototypes and exploration, and work where the requirement is only discovered by trying. In those cases, asking the agent for the change directly is more sensible.

With this you have the criteria to choose. In part C we go deeper into **one** of these proposals, BMAD, because it covers the whole path from the idea to stories ready to code.

## Part C · BMAD: an agile team of agents

### 9. What BMAD is and what it is made of

**BMAD** (*Breakthrough Method for Agile AI-Driven Development*) is a framework that **simulates an agile team with AI agents**: there is an agent that researches, one that writes the PRD, one that designs the experience, one that decides the architecture and one that codes and reviews. Unlike other proposals in the landscape, which start from "a feature" (spec → plan → tasks), BMAD covers the process **from the idea** to reviewed code, and adapts how much process it applies to the **size of the work**. It is open source (MIT license).

And here the circle closes with part A: **BMAD is made of skills**. Every agent and every workflow is a skill installed in `.claude/skills/` (with its `SKILL.md`) and invoked with a slash, such as `/bmad-build`. Everything you learned about progressive loading, descriptions, `AGENTS.md` and subagents applies here as is.

#### 9.1. Two versions, and which one we will use

| | **v6.12.4 (stable)** | **V7 (alpha)** |
| :--- | :--- | :--- |
| Installation | `npx bmad-method install` | `npx skills add …` and then ask the `bmad` skill to run `bmad setup` |
| Can the version be pinned? | **Yes**: `npx bmad-method@6.12.4 install` | **Not yet**: there is no tag or published package |
| Agents | 5: Mary, John, Winston, Amelia, Sally | 6: Sofia (Product Owner) joins |
| Epics and stories | `epics.md` and `sprint-status.yaml` | A ticket tree maintained by Sofia |
| Status | Frozen, fixes only | "Preview alpha": "expect breaking changes between updates" |

In this guide we work with **v6.12.4**, because it is the only one you can **pin**, so every student will see the same thing. The concepts (roles, document as contract, process size) are common to both.

:::warning[The official website already shows V7]
BMAD's documentation site (docs.bmad-method.org) is published from the development branch and **describes V7**, not v6.12: there you will see Sofia, the `bmad` skill and `npx skills`. If what you installed with `npx bmad-method install` doesn't match what you read, that's why. The v6.12 documentation is on the repository's `V6.12` branch. And the README itself warns that V7 was an estimate "for mid-November 2026": check whether it has come out before deciding which version to install.
:::

#### 9.2. The agents (the team's roles)

| Agent | Skill | Role | When you call it |
| :--- | :--- | :--- | :--- |
| **Mary** | `bmad-agent-analyst` | Business analyst | Unvalidated idea, research, writing the *brief* |
| **John** | `bmad-agent-pm` | Product manager | Writing the PRD and the epics and stories |
| **Sally** | `bmad-agent-ux-designer` | UX designer | When the interface matters |
| **Winston** | `bmad-agent-architect` | Systems architect | Decisions that several parts of the code must respect |
| **Amelia** | `bmad-agent-dev` | Software engineer | Implementing, testing, reviewing and closing epics |

There are also skills that are not people but **workflows**: `bmad-build` (a one-session change), `bmad-code-review`, `bmad-deep-recon` (research with citations), `bmad-project-context`, `bmad-party-mode` (conversation among several agents) and `bmad-help`, which **tells you what's next** by looking at the documents that already exist. When you don't know what to do, start there.

#### 9.3. The phases and their documents

BMAD organizes the work into four phases. Each one ends with **a document that the next role takes as a contract**. Explore who does what, and how the route changes with the size of the work:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/fases-bmad/index.html"
  title="The four BMAD phases with their agent and their document, and which phases are used depending on the size of the work"
  height={610}
/>

| Phase | Who | Skill | Document |
| :--- | :--- | :--- | :--- |
| **1 · Analysis** | Mary | `bmad-brainstorming`, `bmad-deep-recon`, `bmad-product-brief` (or `bmad-prfaq`) | Brainstorming session, `research.md`, `brief.md` |
| **2 · Planning** | John and Sally | `bmad-prd`, `bmad-ux` | `prd.md`, `DESIGN.md` and `EXPERIENCE.md` |
| **3 · Solutioning** | Winston and John | `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning` | `ARCHITECTURE-SPINE.md`, `epics.md`, `sprint-status.yaml` |
| **4 · Implementation** | Amelia | `bmad-build`, `bmad-code-review`, `bmad-retrospective` | Code, review findings, retrospective |

:::note[Phase names are not uniform]
Three vocabularies coexist in the documentation itself: the four classic phases above (*Analysis, Planning, Solutioning, Implementation*), different internal folder names in the v6.12 help file, and the V7 cycle (*Clarify, Plan, Build and verify, Learn and adjust*). In this guide we use the classic four phases.
:::

#### 9.4. Not every job needs every phase

BMAD doesn't always ask for the full route. The method's rule is that **the size of the process follows the intent**:

| Work | Route |
| :--- | :--- |
| An obvious, low-risk edit | Ask the agent for it directly; BMAD isn't needed |
| A change that fits in one session (about 500 lines, "a handful of files") | `/bmad-build <description of the change>` |
| A clear idea, bigger than one session | `bmad-spec` and its "Story Breakdown" |
| A new product, with several epics (the docs mention "about 20 sessions or more") | The full route: brief → PRD → UX → architecture → epics and stories → build per story |
| A vague idea, or doubts about whether it's worth it | Clarify first: brainstorming, `bmad-forge-idea`, `bmad-deep-recon` |

Some signals push a small job up a level: high risk, unclear requirements, broad architectural scope or coordination between several people. And a historical note you will see in old blog posts: the "Quick Flow" **no longer exists** under that name; today it is `bmad-build`.

### 10. Installing BMAD and understanding its folders

#### 10.1. Installation

You need **Node.js 20.12 or later**, **Python 3.10 or later** and **`uv`** (the skills run Python scripts with `uv run`). From your project folder:

```bash title="Install BMAD v6.12.4 in Claude Code"
npx bmad-method@6.12.4 install --directory . --modules bmm --tools claude-code --yes
```

Without the options, the installer asks you questions (among them your experience level, which changes how much the agents explain). `npx bmad-method install --list-tools` shows the supported tools; Claude Code, Codex, Cursor and GitHub Copilot are the preferred ones. Then open `claude` and try:

```text
/bmad-help I have a frontend idea and the backend already exists. Where do I start?
```

:::danger[BMAD is third-party skills: apply what you learned in part A]
Installing BMAD means installing **skills with scripts** that run on your computer. The skills installer itself shows risk assessments, and some BMAD skills get medium or high risk alerts because they run scripts and read third-party text (tickets, diffs), which scanners treat as a prompt-injection risk. Before installing: pin the version, **read** what is going to be installed and don't do it in a folder with credentials. The agent will also ask for permission the first time it runs a command: read them before accepting.
:::

#### 10.2. Which folders appear

See how a project grows with each phase and what kind of file each thing is:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/carpetas-bmad/index.html"
  title="Folders created by BMAD v6.12.4 and how the artifacts folder fills up with each phase, distinguishing configuration, generated support and product documents"
  height={1080}
/>

The essentials:

- **`.claude/skills/`**: BMAD's skills (one folder per skill). It is what you saw in part A.
- **`_bmad/`**: **configuration and support**, not documents of your product. `config.toml` stores the installation answers; `custom/` stores **your overrides** (`<skill>.toml` for the team and `<skill>.user.toml` for you); `scripts/` and `render/` are generated by the tool.
- **`_bmad-output/`**: the **product artifacts**: the brief, the PRD, the UX, the architecture, the epics. The skills create them when they write; they don't exist until you ask for them.
- **`AGENTS.md`**: `bmad-project-context` writes a small, verified block here (commands, conventions, known errors). It is the same `AGENTS.md` from section 4.

| What it is | Where | Versioned in Git? |
| :--- | :--- | :--- |
| Product artifacts | `_bmad-output/**` | **Yes** (the docs even suggest it be its own repository) |
| Team configuration | `_bmad/config.toml`, `_bmad/custom/*.toml` | Yes |
| Personal configuration | `*.user.toml` | **No** (the installer creates a `.gitignore` for them) |
| Generated support | `_bmad/scripts/`, `_bmad/render/`, `.claude/skills/` | Regenerated on update |
| Instructions for agents | `AGENTS.md` | Yes |

### 11. An empty project with a backend that already exists

Take the **exercises and routines** app: the backend (NestJS) already exists and can be consumed; the Next.js frontend starts in an **empty folder**. It is a **new project for the frontend**, with a **contract that comes from outside**: the backend is a constraint, not code you should modify.

:::note[BMAD doesn't ship this scenario]
BMAD's official documentation **has no scenario with that title** and doesn't talk about OpenAPI or Swagger. What follows combines what the documentation does support with **this guide's recommendations**, which are marked.
:::

#### 11.1. First, the backend context

An agent cannot respect a backend it doesn't know: if you don't tell it, **it will invent endpoints**. BMAD documents several mechanisms to give it context; which one to use depends on what you have at hand:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/contexto-del-backend/index.html"
  title="Three ways to give BMAD the context of an existing backend and which skills read it"
  height={620}
/>

What is worth writing (**the guide's recommendation**, BMAD doesn't generate it) is a short `docs/backend-api.md` document with: the base URL and how it is configured (`NEXT_PUBLIC_API_URL`), authentication (how you log in and what is sent with each request), a list of endpoints with method, path and an example response, and the error format. If the backend already exposes Swagger/OpenAPI, save it in the repository and link it: that is the source of truth.

:::tip[Don't describe what the agent can already read]
BMAD's documentation warns that giving the agent text descriptions of things it **can already read in the code** creates "contradiction, ambiguity, and context-window bloat". If the backend repository is within reach, it's better to let it read it (with `bmad-deep-recon`) than to summarize it yourself.
:::

#### 11.2. The map: which skill to use in each phase

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-16/mapa-fases-skills/index.html"
  title="Which BMAD skill to use in each phase of a new frontend with an existing backend, with the command, what you give it, the document it produces and what to review"
  height={800}
/>

| Step | Required? | Skill | What comes out |
| :--- | :--- | :--- | :--- |
| Agent context | Recommended | `bmad-project-context` | Block in `AGENTS.md` |
| Idea and scope | Optional | `bmad-product-brief` (Mary) | `brief.md` |
| Requirements | **Yes** in v6.12 | `bmad-prd` (John) | `prd.md` |
| UX | Recommended: the interface is the main thing | `bmad-ux` (Sally) | `DESIGN.md`, `EXPERIENCE.md` |
| Architecture | Recommended: several epics will share the API client, authentication and errors | `bmad-architecture` (Winston) | `ARCHITECTURE-SPINE.md` |
| Stories | **Yes** | `bmad-create-epics-and-stories` and `bmad-sprint-planning` (John) | `epics.md`, `sprint-status.yaml` |
| Build | **Yes** | `bmad-build` (Amelia) | Code and implementation log |
| Review and close | Recommended | `bmad-code-review`, `bmad-retrospective` | Findings and retrospective |

#### 11.3. The walkthrough, step by step

The piece in section 10.2 shows how the folder fills up with documents in each phase. These are the phases of the walkthrough, and the **short route** (a single `/bmad-build`) jumps straight from context to code.

Let's see what each phase does and, above all, **what you have to review**.

**Brief (optional).** Mary interviews you about the idea: what problem it solves, for whom and what is left out. For a frontend on top of an existing backend, a few lines are often enough; if you alone decide what gets built, you can skip it.

**PRD.** John writes the **frontend requirements**: what each type of user can do and what must happen. This is the phase where you should **cite which backend endpoint supports each requirement**, so that no requirement depends on something the API doesn't offer.

**UX.** Sally produces two documents with different roles: `DESIGN.md` (**how it looks**: the visual guide) and `EXPERIENCE.md` (**how it works**: flows, screens and empty, loading and error states). BMAD documents the design **in text**; it is not a layout tool. If you need visual *mockups*, make them with your design tool and **link them as a reference** in the UX (the guide's recommendation).

**Architecture.** Winston writes the *spine*: **only the decisions that could diverge between parts built separately**. For a Next.js frontend, the topics worth pinning down are: the version and the *starter*, the folder structure, where the backend is called (server or client components), how the token or session is stored, the error format, the typed API client and the environment variables. The concrete list is **the guide's recommendation**; BMAD only promises to pin the decisions that cross epics. Since the API is already decided, the spine should **record it as a constraint** and not debate it again.

**Epics, stories and tasks.** John slices the requirements into **epics** and **stories** with **acceptance criteria** (`epics.md`), and `bmad-sprint-planning` produces a verdict (PASS, CONCERNS or FAIL) and `sprint-status.yaml`. A story is the unit of work for the agent: it must fit in **one** build **session**.

**Build.** `/bmad-build` takes a story (or a description), clarifies the intent, plans, implements, reviews and commits. The **first stories set the pattern** for the project (initial structure, API client, authentication): it is worth doing them **with human attention** before repeating the pattern quickly.

**Review and close.** `bmad-code-review` reviews with several independent reviewers and triages the findings; when an epic is finished, `bmad-retrospective` judges it against the evidence. In V7 there is a rule that holds in any version: **only a person marks a story as done**.

#### 11.4. What you review in each phase

| Phase | Question you should ask the document |
| :--- | :--- |
| Brief | Does it describe the problem and scope you have in mind, or what "sounds right"? |
| PRD | Is every requirement backed by a real endpoint? What was explicitly left out? |
| UX | Are the loading, empty and error states of every screen there? |
| Architecture | Do the decisions match what the backend already does? Does any contradict the course? |
| Stories | Does each one fit in a session and have criteria you can verify? |
| Build | Does the code follow the spine's pattern? Do the tests pass? |

:::tip[Look for the assumptions]
BMAD marks in its documents what it **filled in without asking** with `[ASSUMPTION]` tags, and leaves open questions as `Open question:`. The method expects you to **read them**: they are the points where the agent decided for you.
:::

### 12. Best practices, limits and common mistakes

#### 12.1. Best practices

- **Pin the version** (`npx bmad-method@6.12.4 install`) and note it in the repository, so the whole team sees the same thing.
- **Start each workflow in a new conversation.** Mixing phases in the same chat pollutes the context (section 2).
- **Make the size of the process follow the work.** A small change is a `/bmad-build`, not a two-hour route.
- **Keep documents short.** Sofia, in V7, reads everything in a single pass and the practical ceiling is a few tens of thousands of tokens (about 40 pages): whatever exceeds it is lost without warning.
- **Version `_bmad-output/`** and review it the way you review code: it is the contract the agent uses.
- **Review the first stories by hand.** They set the pattern that is then repeated.
- **Use `bmad-help`** when you don't know what's next.

#### 12.2. Limits

- **Token cost:** the repository **publishes no official figures**. What it does document are mechanisms to contain it: long skills split into steps, `bmad-shard-pro` (V7) and a configurable review depth. Keep it in mind if your model usage plan is limited.
- **Too much process:** a blogger who tried it reported two days of questions, five planning documents and "zero lines of real code" before switching to a lighter approach. It is **one individual opinion**, not a study, but it describes a real risk: applying the full route to a small task.
- **It is not deterministic:** the agents phrase their questions differently each time; the documentation itself says so ("this is not a script").
- **The agents have no persistent memory:** what lasts are the documents.
- **Security:** they are third-party skills with scripts (see section 10.1).
- **It changes fast:** phase, command and agent names differ between versions. Check before following an old guide.

#### 12.3. Common mistakes

| Symptom | Likely cause | What to do |
| :--- | :--- | :--- |
| What you read on the website doesn't match what's installed | The website documents **V7**; you installed v6.12 | Read the documentation on the `V6.12` branch or install the version the website describes |
| The agent invents endpoints | It doesn't have the backend context | `docs/backend-api.md` pointed to with `persistent_facts`, or let it read the backend (section 11.1) |
| Hours go by and there is no code | Full route for a small change | `/bmad-build` directly |
| The agent repeats a convention mistake | Repository context is missing | `/bmad-project-context` and review the `AGENTS.md` block |
| The documents contradict each other | You mixed phases in one conversation, or a document was edited without updating the others | A new conversation per workflow; `bmad-correct-course` for changes of direction |
| A story doesn't fit in a session | It is too big | Split it; the reference is about 500 lines |
| A skill stops asking for permission | The tool asks you to confirm the first new command | Read it and accept, or the checks are skipped |

### 13. A challenge to practice

Pick a real improvement for your exercises and routines app (for example, "save favorite routines") and decide, **before starting**:

1. How big is it? Is it a `/bmad-build` or a full route? Justify it with the table in section 9.4.
2. Write `docs/backend-api.md` with the endpoints you would need.
3. If you chose the full route: ask John for a lightweight PRD and **tag each requirement with the endpoint that supports it**. Count how many assumptions (`[ASSUMPTION]`) the agent left and decide which ones you accept.
4. Build **one** story with `/bmad-build` and compare the result with the acceptance criterion.

When you finish, answer: which part of the process saved you work and which part cost you work?

---

## Self-Assessment Quiz

<Quiz id="dedw-s16-agentes-skills-bmad-quiz">
  <Question title="What distinguishes an agent from a chat assistant?">
    <Option>The agent is a bigger model.</Option>
    <Option>The assistant always verifies its own work.</Option>
    <Option correct>The agent uses tools to decide the steps, act and verify the result in a loop, while the assistant answers with text that you apply.</Option>
    <Option>The agent doesn't need context.</Option>
  </Question>
  <Question title="What are the three phases of Claude Code's agentic loop?">
    <Option>Plan, code and deploy.</Option>
    <Option correct>Gather context, take action and verify results.</Option>
    <Option>Ask, wait and repeat.</Option>
    <Option>Read, delete and write.</Option>
  </Question>
  <Question title="You write in an instruction file a rule that must always hold, such as not editing the .env file. What guarantee do you have?">
    <Option>Total: the agent can never break it.</Option>
    <Option correct>None: it is a request that the model treats as context; to make it always hold you use a hook or a permission.</Option>
    <Option>It only holds if it is inside a skill.</Option>
    <Option>It holds if the file has fewer than 200 lines.</Option>
  </Question>
  <Question title="What of a skill is ALWAYS loaded into the context, even if you don't use it?">
    <Option>Its whole SKILL.md.</Option>
    <Option>All its scripts.</Option>
    <Option correct>Only its name and its description (about 100 tokens).</Option>
    <Option>Nothing: skills take up no context.</Option>
  </Question>
  <Question title="Your skill has the description “Helps with documents”. What problem is likely?">
    <Option>That it takes up too much context.</Option>
    <Option>That Claude Code rejects it when installing it.</Option>
    <Option correct>That the agent doesn't activate it when you need it, or activates it for the wrong tasks.</Option>
    <Option>That its scripts don't run.</Option>
  </Question>
  <Question title="What is the relationship between AGENTS.md and the .agents/ folder?">
    <Option>Both are part of the same open standard.</Option>
    <Option correct>AGENTS.md is an open format; the .agents/ folder is a convention, and Claude Code doesn't read anything inside it.</Option>
    <Option>.agents/ is the folder where Claude Code discovers skills.</Option>
    <Option>Only Claude Code reads AGENTS.md.</Option>
  </Question>
  <Question title="What is a subagent for?">
    <Option>To make the model use fewer tools.</Option>
    <Option>To keep memory between sessions.</Option>
    <Option correct>To delegate a task in an isolated context and receive only a summary, without filling the main conversation, or to work in parallel.</Option>
    <Option>To run third-party skills without risk.</Option>
  </Question>
  <Question title="According to Böckeler's article, what is a spec in spec-driven development?">
    <Option>A long, well-written prompt.</Option>
    <Option>The general memory file loaded in every session.</Option>
    <Option correct>A structured, behavior-oriented artifact that is saved and reviewed, and that guides the agent for a specific feature.</Option>
    <Option>A comment inside the code.</Option>
  </Question>
  <Question title="Which SDD level says that “the spec is kept even after the task is complete”?">
    <Option>Spec-first.</Option>
    <Option correct>Spec-anchored.</Option>
    <Option>Spec-as-source.</Option>
    <Option>Vibe coding.</Option>
  </Question>
  <Question title="What does the available evidence say about whether spec-driven development improves results?">
    <Option>There are controlled studies showing a 50% improvement.</Option>
    <Option>There are studies proving it makes results worse.</Option>
    <Option correct>There are no controlled studies measuring it; what exists are team experiences, vendor announcements and opinion.</Option>
    <Option>It has only been measured in video game projects.</Option>
  </Question>
  <Question title="You are going to change the color of a button. Which BMAD route fits?">
    <Option>The full route: brief, PRD, UX, architecture and epics.</Option>
    <Option correct>An obvious, low-risk edit: ask the agent for it directly; BMAD isn't needed.</Option>
    <Option>Always bmad-prfaq.</Option>
    <Option>A retrospective with bmad-retrospective.</Option>
  </Question>
  <Question title="You installed BMAD with npx bmad-method install and the official website shows something else (the agent Sofia, the bmad skill). Why?">
    <Option>Because the installation failed.</Option>
    <Option>Because the website is outdated and describes an old version.</Option>
    <Option correct>Because the website documents V7 (alpha), while that command installs the stable v6.12.</Option>
    <Option>Because Sofia is an agent from version 5.</Option>
  </Question>
  <Question title="Your new frontend consumes a backend that already exists. What should you do so that BMAD doesn't invent endpoints?">
    <Option>Nothing: BMAD discovers the backend on its own.</Option>
    <Option correct>Give it the backend context: for example a docs/backend-api.md or the OpenAPI file in the repository, or let it read the code with bmad-deep-recon.</Option>
    <Option>Ask John to guess the API in the PRD.</Option>
    <Option>Rewrite the whole backend in the PRD.</Option>
  </Question>
  <Question title="Which document does Sally produce with bmad-ux?">
    <Option>The components' code.</Option>
    <Option correct>DESIGN.md (how it looks) and EXPERIENCE.md (how it works: flows, screens and states).</Option>
    <Option>epics.md.</Option>
    <Option>ARCHITECTURE-SPINE.md.</Option>
  </Question>
  <Question title="What do the [ASSUMPTION] tags in BMAD documents indicate?">
    <Option>That the document is approved.</Option>
    <Option>That the agent found a syntax error.</Option>
    <Option correct>That the agent filled something in without asking; the method expects you to read it and decide whether you accept it.</Option>
    <Option>That a story is ready to be built.</Option>
  </Question>
</Quiz>

---

## Further Reading

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Claude Code: How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Claude Code: Skills](https://code.claude.com/docs/en/skills)
- [Claude Code: Memory (CLAUDE.md and AGENTS.md)](https://code.claude.com/docs/en/memory)
- [Claude Code: Subagents](https://code.claude.com/docs/en/sub-agents)
- [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Anthropic Academy](https://anthropic.skilljar.com/)
- [Agent Skills: open specification](https://github.com/agentskills/agentskills)
- [AGENTS.md](https://github.com/agentsmd/agents.md)
- [Birgitta Böckeler: Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [Kiro: Specs](https://kiro.dev/docs/specs/)
- [BMAD-METHOD (repository)](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD: documentation (V7)](https://docs.bmad-method.org/)
