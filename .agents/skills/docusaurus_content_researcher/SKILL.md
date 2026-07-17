---
name: docusaurus-content-researcher
description: Research and write course documentation in DocuKelo, identifying teaching styles (procedural step-by-step vs. conceptual design UI/UX), collecting web information, and preserving the student-centric tone.
---

# Academic Content Research and Generation Skill (DocuKelo)

This skill enables the agent to research the existing structure of subjects at Universidad Icesi, collect updated technical information from the web, and generate content consistent with the teacher's preferred teaching style and the course's current pedagogical tone.

---

## 1. Tone, Voice, and Writing Style Guide (DocuKelo Tone Guide)

When drafting any guide or documentation in this project, the agent **must** rigorously match the pedagogical tone of current documents. Based on the analysis of files in `docs/`, here are the characteristics of the tone:

* **Didactic, Empathetic, and Student-Centric**: The writing must not be cold or merely academic. It should be conversational, understanding, and oriented towards facilitating progressive learning (e.g., *"Before diving into containers, it is helpful to first understand..."* or *"To keep the example simple..."*).
* **Technical Hybrid (Professional Spanglish)**: Use common industry technical terms in their original English (such as *host*, *guest*, *multi-stage build*, *hotfix*, *pull request*, *mock*, *middleware*) but integrated naturally within fluid Spanish explanations. Do not try to translate terms that in the real world are used in English.
* **Pragmatic and Realistic (Real-World Warnings)**: Include warnings, disclaimers, and notes of professional realism. If a tool is complex to configure or not necessary for the scope of a school lab, clarify it explicitly (e.g., *"...although for small-to-medium scale exercises it is not necessary to overcomplicate with these tools"*).
* **Strict Prohibition of Icons and Emojis**: Do not use emojis or other special graphical characters in interfaces, cards, buttons, titles, or body text. The design must remain sober and focused purely on typography and Infima CSS.
* **Readability and Scannability**:
  - Avoid long blocks of uninterrupted text. Break them into paragraphs of 3 to 4 lines.
  - Use lists with bold titles for key concept explanations (e.g., `- **Isolation:** Each container is independent...`).
  - Use **comparative tables** of two or three columns to contrast technologies or approaches (e.g., Git Flow vs Git Trunk).
  - Limit image sizes using the HTML `width` attribute (e.g., `<img src="..." width="600" />`) to prevent visual overflow in Docusaurus.

---

## 2. Research and Curricular Alignment

The agent **must** perform the following research steps before writing any content:

### Step A: Course History Analysis (Alignment)
1. **Previous Folders Review**: The agent must list and read the guides of previous weeks (e.g., if drafting Week 4, inspect weeks 1, 2, and 3).
2. **Technological Continuity**: Ensure the new content continues with the same stack of technologies and dependencies shown previously, unless the topic explicitly requires introducing a new one.
3. **Name Consistency**: Keep the names of projects, directories, and base configurations consistent with what students already configured in previous weeks.

### Step B: Web Information Gathering (Web Search)
1. **Search in Official Sources**: Use the search engine to retrieve the latest and most accurate information directly from the official documentation of the corresponding technology (e.g., Docker, Spring, React, Tailwind CSS, NestJS, or Next.js docs).
2. **Avoid Deprecated Commands**: Confirm that recommended console commands are for modern and stable versions (e.g., prefer `docker compose` over the old and deprecated `docker-compose`).
3. **Content Synthesis**: Do not copy and paste generic information. Filter the retrieved information from the web to adapt it strictly to the academic level of the students in the course.

---

## 3. Content Styles and Two-Block Structure

All extensive technical documents and guides (especially labs and architecture topics) must be divided into two consecutive sections:

1. **Conceptual Foundations (Theory and Flow)**:
   - Explanation of the architecture of the component or middleware.
   - Mandatory inclusion of diagrams (Mermaid, SVG) if there are data flows or requests.
   - **Mandatory Diagram Explanation**: Immediately below the graph, detail in dedicated paragraphs what each key component of the diagram does (e.g., define the role of filters, managers, and context in security).
2. **Practical Development Guide (Implementation)**:
   - Numbered and interactive steps for the lab or workshop.

Identify which course the request belongs to and apply its preferred style within the practical block:

### A. "Step-by-Step" Style (Procedural) - E.g.: *Computación en Internet 2 / 3*
* **Practical Structure**:
  - `<StepByStep>` component and multiple numbered `<Step>` components to guide the practical lab.
  - Code blocks with the metadata `title="path/to/file.ext"`, `showLineNumbers` enabled, and with rich explanatory comments in most of their key lines.
  - `<Tabs>` / `<TabItem>` components for dependency commands (Maven vs Gradle) or console commands (OS).
  - Admonitions `:::tip` or `:::warning` to warn about common configurations or errors.

### B. "Design and Conceptual" Style (UI/UX) - E.g.: *Diseñando con Algoritmos*
* **Practical Structure**:
  - Explanation of interface, design, or layout principles.
  - `<CardGrid>` with `<Card>` grids to compile links to external articles, UI tools, or base repositories.
  - Visual simulators with the `<BrowserWindow>` or `<IframeWindow>` component to show how an interface should look or interact.
  - Practical examples and structured HTML code snippets using Tailwind CSS utility classes.
  - Reflective questions and dynamic group review activities for the workshop.

---

## 4. Technical Workflow to Generate Content

1. **Research**: Read the directory structure of the corresponding course, its existing guides, and search the web.
2. **Create Category**: If it is a new week, create `_category_.json` specifying the order and description.
3. **Create MDX File**: Write the content in fluent Spanish (es), using the globally registered components in `src/theme/MDXComponents.js`.
4. **Verify Compilation**: Run `npm run build` locally to ensure there are no JSX syntax errors or broken links before delivering the result to the user.
