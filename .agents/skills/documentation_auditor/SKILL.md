---
name: documentation-auditor
description: Auditor and improver for academic documentation, evaluating clarity, step-by-step guidance, visual diagram inclusion, code metadata compliance, and structural consistency.
---

# Documentation Auditing and Improvement Proposal Skill (DocuKelo)

This skill enables the agent to critically analyze existing documentation files in this project, detect pedagogical deficiencies, and propose structured improvement plans before editing the content.

---

## 1. Quality Evaluation Criteria (What to Analyze)

When inspecting a course document, the agent must evaluate the following aspects:

### A. Clarity and Pedagogical Structure
* Does the main topic have an initial conceptual explanation that justifies its use?
* Are there loose code snippets without indicating the target path?
* Are difficult concepts explained with analogies or practical breakdowns instead of excessive jargon?
* **Mandatory Diagram Explanation**: Whenever a diagram (Mermaid, SVG, or image) is included, the purpose and technical explanation of each key component illustrated must be detailed immediately below (e.g., in security, define the function of filters, the manager, and the context). Simply rendering the graphic is not enough.
* **Two-Layer Structure**: Documents must be clearly separated into two major blocks:
  1. **Concepts and Theoretical Foundations**: Dedicated to explaining architecture, data flows, and theoretical components supported by diagrams.
  2. **Practical Guide (Step-by-Step)**: Dedicated to the lab or sequential development of the code using MDX components.

### B. Visual Elements and Diagramming (Mermaid)
* Does the topic involve complex data flows, middleware, security, client-server interactions, or database architectures?
* **Rule**: If the answer is yes, the document **must** include at least one Mermaid diagram (sequence or flow) at the beginning of the topic to illustrate the background behavior.
* **Dark Mode Visibility (Contrast)**: Ensure that all Mermaid diagrams and SVG graphics display clearly in both the light and dark themes of Docusaurus.
  * In `docusaurus.config.js`, the `mermaid.theme.dark` property must be set to `'dark'` to automatically render light lines and text in dark mode.
  * When using custom styles (`style` or `classDef` in Mermaid), avoid direct black or dark blue text or lines without a light background container, as they will get lost against the dark background of the site.

### C. Practical Guide Structure (MDX)
* Are tutorials organized with flat numbered lists?
* **Rule**: Replace numbered lab lists with the global `<StepByStep>` and `<Step>` components.
* Do code blocks display the filename in the header?
* **Rule**: Every code snippet must include `title="path/name.ext"` and `showLineNumbers` (if it has more than 10 lines).
* **Rich Comments in Code**: Code snippets must be heavily and detailedly commented line by line (or on most significant lines) to guide the student on what each parameter, annotation, or instruction does. Do not omit or simplify the explanatory comments included.

### D. Theme Consistency and Icon Prohibition
* Does the document contain emojis or icons in titles, buttons, or cards?
* **Rule**: Remove them. Only clean typography, colors from the Icesi palette, and native admonitions (`:::info`, `:::tip`, etc.) are allowed.

---

## 2. Auditor Agent Workflow

When the user requests to audit or improve a topic:

1. **Reading and Diagnosis**: Read the entire file. Create a list of detected deficiencies based on the criteria above.
2. **Plan Proposal**: Before rewriting the file, propose the diagrams and changes to be made to the user (e.g., Mermaid structure, components to be used).
3. **Application**: Apply the modifications to the `.md` or `.mdx` file using the globally registered components in `src/theme/MDXComponents.js`.
4. **Build Validation**: Run `npm run build` to ensure that the MDX restructuring and Mermaid diagrams have no compilation errors or broken links.
