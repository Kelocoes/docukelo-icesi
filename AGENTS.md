# Agent System Entrypoint

Welcome to the DocuKelo Agent System repository configuration. This directory contains instructions, custom skills, and shared memory configurations that define and guide the behavior of AI coding agents collaborating on this project.

## Directory Index

* **Memory**
  * [Docusaurus Guidelines](./.agents/memory/docusaurus-guidelines.md): General rules, code formatting guidelines, available MDX components, and UX constraints.
  * [SVG Redesign Project](./.agents/memory/svg-redesign/README.md): Contexto, progreso y criterios del rediseño de gráficos (proyecto de varias semanas). Léelo antes de crear o modificar gráficos.
  * [Interactive pieces kit](./static/interactive/_shared/dk-base.css): the shared code for interactive graphics (`dk-*.js` and `dk-base.css`). It is documented in `.agents/skills/docusaurus_animated_diagrams/references/kit-api.md`; do not duplicate it inside a piece.
* **Skills**
  * [Animated & Interactive Diagrams](./.agents/skills/docusaurus_animated_diagrams/SKILL.md): **Use this skill whenever you create, redesign or animate a graphic for a chapter** (diagrams, flows, protocol/architecture explanations). It contains the process (analyze, build, test, integrate), a reusable kit of interactive pieces that lives in `static/interactive/_shared/` (theme-aware CSS, icons, sequence/compare/architecture/anatomy/table engines, step player, code panel), a ready-to-copy template, and the lessons learned. Read its `SKILL.md` first; every new piece must be built with that kit instead of writing one-off code.
  * [Documentation Auditor](./.agents/skills/documentation_auditor/SKILL.md): Guides agents on how to review and identify improvements in educational content.
  * [Docusaurus Content Researcher](./.agents/skills/docusaurus_content_researcher/SKILL.md): Guides agents on tone, pedagogical structure, and curricular alignment.
  * [Docusaurus Mermaid SVG](./.agents/skills/docusaurus_mermaid_svg/SKILL.md): Visual design rules and Mermaid templates for flowcharts, sequence diagrams, and block diagrams.
  * [Docusaurus Quiz](./.agents/skills/docusaurus_quiz/SKILL.md): Guidelines, formatting rules, and component specifications for embedding interactive multiple-choice quizzes (<Quiz>, <Question>, <Option>) in DocuKelo Docusaurus documentation.
  * [Docusaurus Resource Visualizer](./.agents/skills/resource_visualizer/SKILL.md): Guides agents on how to visually illustrate educational links and tools in DocuKelo using simple, clean, SVG schemas (vector diagrams).
  * [Pedagogical SVG Designer](./.agents/skills/pedagogical_svg_designer/SKILL.md): Reasoning protocol, visual grammar, shape/color vocabularies, a 10-pattern catalog and QA rules to create abstract, conceptual, low-text SVG diagrams for slides on any topic (includes `references/shape-library.md` and `references/pattern-catalog.md`).


